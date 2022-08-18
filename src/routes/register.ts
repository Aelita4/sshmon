import { Request, Response } from 'express';

module.exports = {
    method: "GET",
    url: "/register",
    callback: async (data: any, req: Request, res: Response) => {
        res.render("pages/register.ejs", { invalid: "" });
    }
}