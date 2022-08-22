# sshmon
### Utility to monitor uptime of servers/services

## First configuration
1. Create docker image
- `$ docker build -t sshmon .`

2. Setup containers
- `$ docker-compose up -d`

  - This will open ports 3306 for database, 8080 for main app and 8081 for phpMyAdmin

3. Create database and tables
- Script does not create database and tables by default
  - Create database `sshmon` with 2 tables: 
    <table>
        <thead>
            <tr>
                <th colspan=3>ips</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Name</td>
                <td>Type</td>
                <td>Extra</td>
            </tr>
            <tr>
                <td>id</td>
                <td>int</td>
                <td>AUTO_INCREMENT PRIMARY KEY</td>
            </tr>
            <tr>
                <td>ip</td>
                <td>varchar(255)</td>
                <td></td>
            </tr>
        </tbody>
    </table>
    <table>
        <thead>
            <tr>
                <th colspan=3>users</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Name</td>
                <td>Type</td>
                <td>Extra</td>
            </tr>
            <tr>
                <td>id</td>
                <td>int</td>
                <td>AUTO_INCREMENT PRIMARY KEY</td>
            </tr>
            <tr>
                <td>username</td>
                <td>varchar(255)</td>
                <td></td>
            </tr>
            <tr>
                <td>password</td>
                <td>varchar(255)</td>
                <td></td>
            </tr>
        </tbody>
    </table>

4. Register new account in app
5. Login
6. Enjoy!

