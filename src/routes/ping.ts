import { Request, Response } from 'express';
import { connection } from '../index.js';

export default {
    method: "GET",
    url: "/ping/:ip",
    callback: async (data: any, req: Request, res: Response) => {
        const ip = req.params.ip;
        const r = await data.ping(ip);
        if((Number(data.pings.get(ip).split("_")[0]) + (1000 * 60 * 5)) < Date.now()) {
            if(!r.alive) connection.query("SELECT * FROM downtime WHERE ip=? AND date=? AND status=?", [ip, new Date(Number(data.pings.get(ip).split("_")[0])).toISOString().slice(0, 19).replace('T', ' '), "DOWN"], (err, results, fields) => {
                if(err) throw err;
                if(results.length === 0) connection.query("INSERT INTO downtime VALUES (NULL, ?, ?, ?)", [ip, new Date(Number(data.pings.get(ip).split("_")[0])).toISOString().slice(0, 19).replace('T', ' '), "DOWN"], (errr, resultss, fieldss) => {
                    if(errr) throw errr;
                });
            });
            
            else connection.query("SELECT * FROM downtime WHERE ip=? AND date=? AND status=?", [ip, new Date(Number(data.pings.get(ip).split("_")[0])).toISOString().slice(0, 19).replace('T', ' '), "UP"], (err, results, fields) => {
                if(err) throw err;
                if(results.length === 0) connection.query("INSERT INTO downtime VALUES (NULL, ?, ?, ?)", [ip, new Date(Number(data.pings.get(ip).split("_")[0])).toISOString().slice(0, 19).replace('T', ' '), "UP"], (errr, resultss, fieldss) => {
                    if(errr) throw errr;
                });
            });
        }
        if(!r.alive && data.pings.get(ip).split("_")[1] === "1") data.pings.set(ip, `${Date.now()}_0`);
        else if(r.alive) data.pings.set(ip, `${Date.now()}_1`);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(r));
    }
}