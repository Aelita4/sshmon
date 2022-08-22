import express, { Request, Response } from 'express';
import Ping from 'ping';
import { existsSync, readdirSync, writeFileSync, readFileSync } from 'fs';
import sessions from "express-session"
import cookieParser from "cookie-parser"
import mysql from 'mysql'
import bcrypt from 'bcrypt'
import url from 'url';

//const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const ping = async (host: string) => {
    const result = await Ping.promise.probe(host, {
        timeout: 2,
        extra: ["-i", "2"],
    });
    return result;
}

const getIP = () : Promise<string[]> => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM ips", async (err, results, fields) => {
            if(err) reject(err);
            const addresses = [...results.slice()];
    
            resolve(addresses);
        });
    });
}

const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "sshmon"
});

connection.connect();

const app = express();

app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');
app.use(sessions({
    secret: "jkthaljkerhwejhflsbglsrbhsbfgdnbsdktiu34y5i4",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));
app.use(cookieParser());
app.use(express.urlencoded());

const pings = new Map();

let addresses: Array<string> = await getIP();

//if(!existsSync("/usr/src/app/data.json")) writeFileSync("/usr/src/app/data.json", "[]");
//let addresses = JSON.parse(readFileSync("/usr/src/app/data.json", {encoding:'utf8', flag:'r'}))
addresses.forEach((a: string) => pings.set(a, -1));
const timeoutDelay = 60000;

const routes = readdirSync(__dirname + "/routes");
routes.forEach(async route => {
    const file = await import(`${__dirname}/routes/${route}`);
    console.log(`[${file.default.method}] ${file.default.url}`);
    switch(file.default.method) {
        case "GET": app.get(file.default.url, file.default.callback.bind(null, { addresses, ping, pings, timeoutDelay })); break;
        case "POST": app.post(file.default.url, file.default.callback.bind(null, { addresses, ping, pings, timeoutDelay })); break;
    }
});

app.listen(8080, () => console.log('rdy'));

export interface Data {
    ping: Function,
    pings: Map<string, number>,
    addresses: Array<string>,
    timeoutDelay: number
};

export interface User {
    username: string
}

export { connection, bcrypt, getIP };