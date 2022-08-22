import { Request, Response } from 'express';
import { connection, bcrypt } from '../index.js'

export default {
    method: "POST",
    url: "/registerUser",
    callback: async (data: any, req: Request, res: Response) => {
        if(!req.body.username || !req.body.password) {
            res.render("pages/register.ejs", { invalid: "noinput" });
            return;
        }

        if(req.body.password !== req.body.password2) {
            res.render("pages/register.ejs", { invalid: "nomatch" });
            return;
        }

        const encryptedPassword = await bcrypt.hash(req.body.password, 10);

        connection.query("SELECT * FROM users WHERE username = ?", req.body.username, (err, results, fields) => {
            if(err) throw err;

            if(results.length > 0) res.render("pages/register.ejs", { invalid: "exists" });
            else {
                connection.query("INSERT INTO users VALUES (NULL, ?, ?)", [req.body.username, encryptedPassword], (errr, resultss, fieldss) => {
                    if(errr) throw errr
                    res.render("pages/register.ejs", { invalid: "created" });
                });
            }
        });
    }
}