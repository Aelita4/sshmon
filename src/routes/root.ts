import { Request, Response } from 'express';
import { readFileSync } from 'fs';

module.exports = {
    url: "/",
    callback: async (data: any, req: Request, res: Response) => {
        data.addresses = JSON.parse(readFileSync("../data.json", {encoding:'utf8', flag:'r'}))
        res.render('pages/index.ejs', {
            addresses: data.addresses,
            timeoutDelay: data.timeoutDelay
        });
    }
}