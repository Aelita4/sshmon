import { Request, Response } from 'express';

export default {
    method: "GET",
    url: "/register",
    callback: async (data: any, req: Request, res: Response) => {
        res.render("pages/register.ejs", { invalid: "" });
    }
}