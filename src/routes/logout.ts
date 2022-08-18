import { Request, Response } from 'express';

module.exports = {
    method: "GET",
    url: "/logout",
    callback: async (data: any, req: Request, res: Response) => {
        req.session.destroy(err => {
            res.redirect('/login');
        });
    }
}