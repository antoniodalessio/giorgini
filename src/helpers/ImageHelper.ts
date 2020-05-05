var fs = require('fs');
var Jimp = require('jimp');
import FTP from './../utils/ftp'

var clientftp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);

class ImageHelper {
  
  async saveImageFile(imageBase64: any, name: string) {
    try{
      imageBase64 = imageBase64.replace(/^data:image\/jpeg;base64,/, "");
      const path = `${process.env.SITE_IMAGE_PATH}${name}.jpg`
      await fs.writeFileSync(path, imageBase64, 'base64')
      await this.createImageFormatAndUpload(name)
    }catch(e) {
      console.log(e)
    }
  }

  async createSingleImageAndUpload(name: string, size: any, suffix: string) {
    const image = await Jimp.read(`${process.env.SITE_IMAGE_PATH}${name}.jpg`)
    await image.resize(size.width, size.height);
    let result = await image.getBufferAsync(Jimp.MIME_JPEG);
    await fs.writeFileSync(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, result)
    await clientftp.upload(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, `${process.env.REMOTE_IMAGES_PATH}${name}${suffix}.jpg`, 755)
  }

  async createImageFormatAndUpload(name: string) {
    await this.createSingleImageAndUpload(name, {width: 640, height: 640}, "_thumb")
    await this.createSingleImageAndUpload(name, {width: 640, height: 640}, "_normal")
    await this.createSingleImageAndUpload(name, {width: 1024, height: 1024}, "_x2")
  }
}

export default ImageHelper