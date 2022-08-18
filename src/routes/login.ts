import { Request, Response } from 'express';

module.exports = {
    method: "GET",
    url: "/login",
    callback: async (data: any, req: Request, res: Response) => {
        res.render("pages/login.ejs", { invalid: "" });
    }
}