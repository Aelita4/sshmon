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

        connection.query(`SELECT * FROM users WHERE username=$user`, {
            user: req.body.username
        })
        .then((result: any) => {
            if(result[0].result.length > 0) res.render("pages/register.ejs", { invalid: "exists" });
            else {
                connection.query("CREATE users SET username=$user, password=$pass", {
                    user: req.body.username,
                    pass: encryptedPassword
                }).then((resultt: any) => {
                    res.render("pages/register.ejs", { invalid: "created" });
                }).catch((err: any) => {
                    throw err;
                });
            }
        }).catch((err: any) => {
            throw err;
        });
    }
}