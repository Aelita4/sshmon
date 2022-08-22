import { Request, Response } from 'express';
import { connection } from '../index.js';

export default {
    method: "GET",
    url: "/removeIP/:ip",
    callback: async (data: any, req: Request, res: Response) => {
        connection.query("SELECT * FROM ips WHERE ip = ?", req.params.ip, (err, results, fields) => {
            if(err) throw err;

            if(results.length == 0) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: "OK" }));
            } else {
                connection.query("DELETE FROM ips WHERE ip = ?", req.params.ip, (errr, resultss, fieldss) => {
                    if(errr) throw errr
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: "OK" }));
                });
            }
        });
    }
}