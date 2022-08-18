import express, { Request, Response } from 'express';
import * as Ping from 'ping';
import { existsSync, readdirSync, writeFileSync, readFileSync } from 'fs';
import sessions from "express-session"
import cookieParser from "cookie-parser"
import mysql from 'mysql'
import bcrypt from 'bcrypt'

const ping = async (host: string) => {
    const result = await Ping.promise.probe(host, {
        timeout: 2,
        extra: ["-i", "2"],
    });
    return result;
}

const connection = mysql.createConnection({
    host: "localhost",
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

if(!existsSync("../data.json")) writeFileSync("../data.json", "[]");
let addresses = JSON.parse(readFileSync("../data.json", {encoding:'utf8', flag:'r'}))
addresses.forEach((a: string) => pings.set(a, -1));
const timeoutDelay = 60000;

const routes = readdirSync("./routes");
routes.forEach(route => {
    const file = require(`./routes/${route}`);
    console.log(`[${file.method}] ${file.url}`);
    switch(file.method) {
        case "GET": app.get(file.url, file.callback.bind(null, { addresses, ping, pings, timeoutDelay })); break;
        case "POST": app.post(file.url, file.callback.bind(null, { addresses, ping, pings, timeoutDelay })); break;
    }
});

app.listen(8080, () => console.log('rdy'));

interface Data {
    ping: Function,
    pings: Map<string, number>,
    addresses: Array<string>,
    timeoutDelay: number
};

interface User {
    username: string
}

export { connection, bcrypt, User, Data };