import { Request, Response } from 'express';

export default {
    method: "GET",
    url: "/logout",
    callback: async (data: any, req: Request, res: Response) => {
        req.session.destroy(err => {
            res.redirect('/login');
        });
    }
}