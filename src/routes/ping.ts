import { Request, Response } from 'express';
import { connection } from '../index.js';

export default {
    method: "GET",
    url: "/ping/:ip",
    callback: async (data: any, req: Request, res: Response) => {
        const ip = req.params.ip;
        const r = await data.ping(ip);
        if((Number(data.pings.get(ip).split("_")[0]) + (1000 * 60 * 5)) < Date.now()) {
            if(!r.alive) {
                connection.query("SELECT * FROM downtime WHERE ip=$ip AND date=$date AND status=$status", {
                    ip: ip,
                    date: new Date(Number(data.pings.get(ip).split("_")[0])).toISOString().slice(0, 19).replace('T', ' '),
                    status: "DOWN"
                }).then((result: any) => {
                    if(result[0].result.length === 0) connection.query("CREATE downtime SET ip=$ip, date=$date, status=$status", {
                        ip: ip,
                        date: new Date(Number(data.pings.get(ip).split("_")[0])).toISOString().slice(0, 19).replace('T', ' '),
                        status: "DOWN"
                    });
                                          
                }).catch((err: any) => {
                    throw err;
                });
            } else {
                connection.query("SELECT * FROM downtime WHERE ip=$ip AND date=$date AND status=$status", {
                    ip: ip,
                    date: new Date(Number(data.pings.get(ip).split("_")[0])).toISOString().slice(0, 19).replace('T', ' '),
                    status: "UP"
                }).then((result: any) => {
                    if(result[0].result.length === 0) connection.query("CREATE downtime SET ip=$ip, date=$date, status=$status", {
                        ip: ip,
                        date: new Date(Number(data.pings.get(ip).split("_")[0])).toISOString().slice(0, 19).replace('T', ' '),
                        status: "UP"
                    });
                                          
                }).catch((err: any) => {
                    throw err;
                });
            }
        }

        if(!r.alive && data.pings.get(ip).split("_")[1] === "1") data.pings.set(ip, `${Date.now()}_0`);
        else if(r.alive) data.pings.set(ip, `${Date.now()}_1`);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(r));
    }
}