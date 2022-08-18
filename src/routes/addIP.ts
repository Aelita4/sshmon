import { Request, Response } from 'express';
import { existsSync, writeFileSync, readFileSync } from 'fs'

module.exports = {
    method: "GET",
    url: "/addIP/:ip",
    callback: async (data: any, req: Request, res: Response) => {
        if(!existsSync("../data.json")) writeFileSync("../data.json", "[]");
        const json = JSON.parse(readFileSync("../data.json", {encoding:'utf8', flag:'r'}));
    
        json.push(req.params.ip);
    
    
        writeFileSync("../data.json", JSON.stringify(json))
    
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "OK" }));
    }
}