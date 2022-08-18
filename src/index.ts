import express, { Request, Response } from 'express';
import * as Ping from 'ping';
import { existsSync, readdirSync, writeFileSync, readFileSync } from 'fs';

const ping = async (host: string) => {
    const result = await Ping.promise.probe(host, {
        timeout: 2,
        extra: ["-i", "2"],
    });
    return result;
}

const app = express();

const pings = new Map();

if(!existsSync("../data.json")) writeFileSync("../data.json", "[]");
let addresses = JSON.parse(readFileSync("../data.json", {encoding:'utf8', flag:'r'}))
addresses.forEach((a: string) => pings.set(a, -1));
const timeoutDelay = 60000;

const routes = readdirSync("./routes");
routes.forEach(route => {
    const file = require(`./routes/${route}`);
    app.get(file.url, file.callback.bind(null, { addresses, ping, pings, timeoutDelay }))
});

app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');
app.listen(8080, () => console.log('rdy'));

export interface Data {
    ping: Function,
    pings: Map<string, number>,
    addresses: Array<string>,
    timeoutDelay: number
};