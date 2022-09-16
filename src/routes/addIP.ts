import { Request, Response } from 'express';
import { connection } from '../index.js';

export default {
    method: "GET",
    url: "/addIP/:ip",
    callback: async (data: any, req: Request, res: Response) => {  
        connection.query("SELECT * FROM ips WHERE ip=$ip", {
            ip: req.params.ip
        }).then((result: any) => {
            if(result[0].result.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: "OK" }));
            } else {
                connection.query("CREATE ips SET ip=$ip", {
                    ip: req.params.ip
                }).then((resultt: any) => {
                    data.pings.set(req.params.ip, `${Date.now()}_1`);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: "OK" }));
                }).catch((err: any) => {
                    throw err;
                });
            }
        }).catch((err: any) => {
            throw err;
        }); 
    }
}