import { Request, Response } from 'express';
import { existsSync, writeFileSync, readFileSync } from 'fs'

module.exports = {
    method: "GET",
    url: "/removeIP/:ip",
    callback: async (data: any, req: Request, res: Response) => {
        if(!existsSync("../data.json")) writeFileSync("../data.json", "[]");
        const json = JSON.parse(readFileSync("../data.json", {encoding:'utf8', flag:'r'}));
    
        json.splice(json.indexOf(req.params.ip.toString()), 1)
    
        writeFileSync("../data.json", JSON.stringify(json))
    
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "OK" }));
    }
}