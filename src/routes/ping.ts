import { Request, Response } from 'express';

export default {
    method: "GET",
    url: "/ping/:ip",
    callback: async (data: any, req: Request, res: Response) => {
        const ip = req.params.ip;
        const r = await data.ping(ip);
        if(!r.alive && data.pings.get(ip).split("_")[1] === "1") data.pings.set(ip, `${Date.now()}_0`);
        else if(r.alive) data.pings.set(ip, `${Date.now()}_1`);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(r));
    }
}