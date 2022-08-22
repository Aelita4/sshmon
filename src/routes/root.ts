import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { getIP } from '../index.js';

export default {
    method: "GET",
    url: "/",
    callback: async (data: any, req: Request, res: Response) => {
        const tmp = await getIP();
        //@ts-ignore
        data.addresses = tmp.map(a => a.ip);
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