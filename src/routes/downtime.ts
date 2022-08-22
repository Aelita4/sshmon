import { Request, Response } from 'express';

export default {
    method: "GET",
    url: "/downtime/:ip",
    callback: async (data: any, req: Request, res: Response) => {
        const ip = req.params.ip;

        const json = { downSince: data.pings.get(ip).split("_")[0] };

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(json));
    }
}