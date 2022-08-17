const express = require('express');
const Ping = require('ping');
const fs = require('fs');

const ping = async host => {
    const result = await Ping.promise.probe(host, {
        timeout: 2,
        extra: ["-i", "2"],
    });
    return result;
}

const app = new express();

const pings = new Map();

if(!fs.existsSync("data.json")) fs.writeFileSync("data.json", "[]");
let addresses = JSON.parse(fs.readFileSync("./data.json", {encoding:'utf8', flag:'r'}))
addresses.forEach(a => pings.set(a, -1));
const timeoutDelay = 60000;

app.get("/", async (req, res) => {
    addresses = JSON.parse(fs.readFileSync("./data.json", {encoding:'utf8', flag:'r'}))
    let out = `<html><head><script>const addresses = ["${addresses.join('", "')}"];
    function clock() {
        
        const x = new Date();

        document.getElementById("time").innerHTML = String(x.getHours()).padStart(2, '0') + ":" + String(x.getMinutes()).padStart(2, '0') + ":" + String(x.getSeconds()).padStart(2, '0');
    }

    async function addIP() {
        const addrElement = document.getElementById("addresses");
        const ip = document.getElementById("ipaddr").value;

        addresses.push("ip")
        addrElement.innerHTML += '<div id="' + ip + '_main"><tr><td><input type="button" name="' + ip + '_rem" value="x" onClick="removeIP(\"' + ip + '\")"></td><td><div style="display: inline-block;" id="' + ip + '_addr">' + ip + '</div></td><td><div style="display: inline-block; margin-left: 5em" id="' + ip + '_status"><span style="color:blue;">PINGING...</span></div></td></tr></div>'
        const b = document.getElementById(ip + "_status");
        await fetch('http://localhost:8080/addIP/' + ip)
        window.location.reload(true);
        /*await fetch('http://localhost:8080/ping/' + ip)
        .then((response) => response.json())
        .then((data) => {
            b.innerHTML = data.alive ? '<span style="color:green;">UP (' + data.numeric_host + ") " + data.time + 'ms</span>' : '<span style="color:red;">DOWN' + ((data.host == "unknown") ? " (UNKNOWN HOST)" : (" (" + data.numeric_host + ")")) + '</span>'
        });*/
        
    }

    async function removeIP(ip) {
        const tab = document.getElementById("tab");
        tab.deleteRow(addresses.indexOf(ip.toString()));
        await fetch('http://localhost:8080/removeIP/' + ip)
        const a = document.getElementById(ip + "_main");
        a.remove();
    }
    
    async function aaa() {
        const date = new Date();
        document.getElementById("main").innerHTML = "Last checked: " + date;
        document.getElementById("eta").innerHTML = "Next scheduled check: " + new Date(date.getTime() + ${timeoutDelay});
        addresses.forEach(async a => {
        const b = document.getElementById(a + "_status");
        if(!b) return;
        b.innerHTML = '<span style="color:blue;">PINGING...</span>'
        await fetch('http://localhost:8080/ping/' + a)
        .then((response) => response.json())
        .then(async (data) => {
            b.innerHTML = data.alive ? '<span style="color:green;">UP (' + data.numeric_host + ") " + data.time + 'ms</span>' : '<span style="color:red;">DOWN' + ((data.host == "unknown") ? " (UNKNOWN HOST)" : (" (" + data.numeric_host + ")")) + " since " + new Date((await (await fetch('http://localhost:8080/downtime/' + a)).json()).downSince) + '</span>'
        });
        
    })
    setTimeout(aaa, ${timeoutDelay})
    }

    window.onload = async () => {
        const x = new Date();
        document.getElementById("time").innerHTML = String(x.getHours()).padStart(2, '0') + ":" + String(x.getMinutes()).padStart(2, '0') + ":" + String(x.getSeconds()).padStart(2, '0');
        
        const clockRefresh = 1000;
        aaa();
        setInterval(clock, clockRefresh);
    }
    </script></head><body><div id="time">12:00:00</div><div id="main"></div><div id="eta"></div><br />
    <input type="text" name="ipaddr" id="ipaddr" value=""><input type="submit" id="but" name="but" value="Add" onClick="addIP()"><br /><br /><div id="addresses"><table id="tab">`;

    addresses.forEach(a => {
        out += `<div id="${a}_main"><tr><td><input type="button" name="${a}_rem" value="x" onClick="removeIP('${a}')"></td><td><div style="display: inline-block;" id="${a}_addr">${a}</div></td><td><div style="display: inline-block; margin-left: 5em" id="${a}_status"><span>WAITING</span></div></td></tr></div>`;
    })

    out += `</table></div><script>document.getElementById("ipaddr")
    .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("but").click();
        }
    });</script></body></html>`;

    res.send(out);
});

app.get("/ping/:ip", async (req, res) => {
    const ip = req.params.ip;
    const r = await ping(ip);
    if(!r.alive && pings.get(ip) === -1) pings.set(ip, Date.now());
    else if(r.alive) pings.set(ip, -1);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(r));
});

app.get("/downtime/:ip", async (req, res) => {
    const ip = req.params.ip;

    const json = { downSince: pings.get(ip) };

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(json));
});

app.get("/addIP/:ip", async (req, res) => {
    if(!fs.existsSync("data.json")) fs.writeFileSync("data.json", "[]");
    const json = JSON.parse(fs.readFileSync("./data.json", {encoding:'utf8', flag:'r'}));

    json.push(req.params.ip);


    fs.writeFileSync("./data.json", JSON.stringify(json))

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: "OK" }));
});

app.get("/removeIP/:ip", async (req, res) => {
    if(!fs.existsSync("data.json")) fs.writeFileSync("data.json", "[]");
    const json = JSON.parse(fs.readFileSync("./data.json", {encoding:'utf8', flag:'r'}));

    json.splice(json.indexOf(req.params.ip.toString()), 1)

    fs.writeFileSync("./data.json", JSON.stringify(json))

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: "OK" }));
});

app.listen(8080, () => console.log('rdy'));