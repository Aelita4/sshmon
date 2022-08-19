import { Request, Response } from 'express';
import { existsSync, writeFileSync, readFileSync } from 'fs'

module.exports = {
    method: "GET",
    url: "/addIP/:ip",
    callback: async (data: any, req: Request, res: Response) => {
        if(!existsSync("/usr/src/app/data.json")) writeFileSync("/usr/src/app/data.json", "[]");
        const json = JSON.parse(readFileSync("/usr/src/app/data.json", {encoding:'utf8', flag:'r'}));
    
        json.push(req.params.ip);
    
    
        writeFileSync("/usr/src/app/data.json", JSON.stringify(json))
    
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "OK" }));
    }
}