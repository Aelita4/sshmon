import { Request, Response } from 'express';
import { readFileSync } from 'fs';

module.exports = {
    method: "GET",
    url: "/",
    callback: async (data: any, req: Request, res: Response) => {
        data.addresses = JSON.parse(readFileSync("../data.json", {encoding:'utf8', flag:'r'}));
        //@ts-ignore
        if(!req.session.user) res.redirect("/login");
        else res.render('pages/index.ejs', {
            addresses: data.addresses,
            timeoutDelay: data.timeoutDelay,
            //@ts-ignore
            loggedIn: req.session.user ? true : false,
            //@ts-ignore
            username: req.session.user?.username
        });
    }
}