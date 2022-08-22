import { Request, Response } from 'express';
import { connection, bcrypt } from '../index.js'

export default {
    method: "POST",
    url: "/loginUser",
    callback: async (data: any, req: Request, res: Response) => {
        
        connection.query("SELECT * FROM users WHERE username = ?", req.body.username, async (err, results, fields) => {
            if(err) throw err;
            if(results.length === 0) res.render("pages/login.ejs", { invalid: "baduserorpass" });
            else {
                const compare = await bcrypt.compare(req.body.password, results[0].password);
                if(compare) {
                    const session = req.session;
                    //@ts-ignore
                    session.user = {}
                    //@ts-ignore
                    session.user.username = req.body.username;

                    session.save();
        
                    res.redirect("/");
                } else res.render("pages/login.ejs", { invalid: "baduserorpass" });
            }
        })
    }
}