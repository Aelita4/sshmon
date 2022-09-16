import { Request, Response } from 'express';
import { connection, bcrypt } from '../index.js'

export default {
    method: "POST",
    url: "/loginUser",
    callback: async (data: any, req: Request, res: Response) => {
        connection.query(`SELECT * FROM users WHERE username=$user`, {
            user: req.body.username
        }).then(async (result: any) => {
            if(result[0].result.length === 0) res.render("pages/login.ejs", { invalid: "baduserorpass" });
            else {
                const compare = await bcrypt.compare(req.body.password, result[0].result[0].password);
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
        }).catch((err: any) => {
            throw err;
        });
    }
}