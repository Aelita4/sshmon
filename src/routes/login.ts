import { Request, Response } from 'express';

export default {
    method: "GET",
    url: "/login",
    callback: async (data: any, req: Request, res: Response) => {
        res.render("pages/login.ejs", { invalid: "" });
    }
}