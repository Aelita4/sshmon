import { Request, Response } from 'express';
import { existsSync, writeFileSync, readFileSync } from 'fs'

module.exports = {
    method: "GET",
    url: "/removeIP/:ip",
    callback: async (data: any, req: Request, res: Response) => {
        if(!existsSync("/usr/src/app/data.json")) writeFileSync("/usr/src/app/data.json", "[]");
        const json = JSON.parse(readFileSync("/usr/src/app/data.json", {encoding:'utf8', flag:'r'}));
    
        json.splice(json.indexOf(req.params.ip.toString()), 1)
    
        writeFileSync("/usr/src/app/data.json", JSON.stringify(json))
    
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "OK" }));
    }
}