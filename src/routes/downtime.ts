import { Request, Response } from 'express';

module.exports = {
    method: "GET",
    url: "/downtime/:ip",
    callback: async (data: any, req: Request, res: Response) => {
        const ip = req.params.ip;

        const json = { downSince: data.pings.get(ip) };

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(json));
    }
}