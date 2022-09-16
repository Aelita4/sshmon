import express, { NextFunction } from 'express';
import Ping from 'ping';
import { readdirSync } from 'fs';
import sessions from "express-session"
import cookieParser from "cookie-parser"
//@ts-ignore
import Surreal from 'surrealdb.js'
import bcrypt from 'bcrypt'
import url from 'url';

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
        connection.query("SELECT * FROM ips").then((data : any) => {
            const addresses = [...data[0].result.slice()].map(a => a.ip);
            resolve(addresses);
        }).catch((err : any) => {
            reject(err);
        });
        /*connection.query("SELECT * FROM ips", async (err, results, fields) => {
            if(err) reject(err);
            const addresses = [...results.slice()].map(a => a.ip);
    
            resolve(addresses);
        });*/
    });
}

const connection = new Surreal("http://127.0.0.1:8000/rpc");

await connection.signin({
    user: "root",
    pass: "root"
});

await connection.use("sshmon", "sshmon");

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

addresses.forEach((a: string) => pings.set(a, `${Date.now()}_1`));
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

app.all("*", (req, res, next) => {
    console.log(`${req.method} ${req.httpVersion} ${req.path}`);
    next();
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