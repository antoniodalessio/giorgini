'use strict';

const ftp = require('basic-ftp');
const fs = require('fs');

class FTPClient {

  private client: any
  private settings: any

  constructor(host: string = 'localhost', port: number = 21, username: string = 'anonymous', password: string = 'guest', secure: boolean = false) {
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

  async upload(sourcePath: string, remotePath: string, perm: number) {
      
    try {
      let access = await this.client.access(this.settings);
      let upload = await this.client.upload(fs.createReadStream(sourcePath), remotePath);
      let permissions = await this.changePermissions(perm.toString(), remotePath);
    } catch(err) {
      console.log(err);
    }
    this.client.close();
      
  }

  close() {
    this.client.close();
  }

  changePermissions(perms: any, filepath: string) {
    let cmd = 'SITE CHMOD ' + perms + ' ' + filepath;
    return this.client.send(cmd, false);
  }

  async rename(oldFile: string, newFile: string) {
    let access = await this.client.access(this.settings);
    let rename = await this.client.rename(oldFile, newFile)
  }
}

export default FTPClient