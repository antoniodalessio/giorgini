'use strict';

const ftp = require('basic-ftp');
//const fs = require('fs');

class FTPClient {

    private fs
    private client
    private settings

    constructor(host = 'localhost', port = 21, username = 'anonymous', password = 'guest', secure = false, fs) {
        this.fs = fs
        this.client = new ftp.Client();
        this.settings = {
            host: host,
            port: port,
            user: username,
            password: password,
            secure: secure,
            secureOptions: { rejectUnauthorized: false }
        };
    }

    upload(sourcePath, remotePath, perm) {
        
        (async () => {
            try {
                let access = await this.client.access(this.settings);
                let upload = await this.client.upload(this.fs.createReadStream(sourcePath), remotePath);
                let permissions = await this.changePermissions(perm.toString(), remotePath);
            } catch(err) {
                console.log(err);
            }
            this.client.close();
        })();
    }

    close() {
        this.client.close();
    }

    changePermissions(perms, filepath) {
        let cmd = 'SITE CHMOD ' + perms + ' ' + filepath;
        return this.client.send(cmd, false);
    }
}

module.exports = FTPClient;