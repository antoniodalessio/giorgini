var handlebars = require("handlebars");
var fs = require('fs');
const YAML = require('yaml')

class Assemble {

  public options: any;

  constructor(options: any) {
      this.options = options
      this.createPartials()
  }

  async createPartials() {

    let files = fs.readdirSync(this.options.partialsPath)
    files.forEach(async  (file: any) => {
      const data = await fs.readFileSync(`${this.options.partialsPath}${file}`, 'utf8')
      handlebars.partials[file.replace(".hbs", "")] = handlebars.compile(data)
    });

  }

  async setTemplate(name: string, data: any) {
    try {
      const template = await fs.readFileSync(`${this.options.templatesPath}${name}.hbs`, 'utf8')
      let templateData = this.parseData(template)
      handlebars.partials['body'] = handlebars.compile(templateData.template)
      return templateData.data
    } catch(e) {
      console.log(e)
    }
  }

  async render(name: string, data: any) {
    let template = await fs.readFileSync(`${this.options.defaultLayout}`, 'utf8')

    let newdata = await this.setTemplate(name, data)

    template = handlebars.compile(template)
    let result = template(Object.assign(data, newdata))
    await fs.writeFileSync(`${this.options.defaultFolder}${name}.html`, result)
  }

  parseData(template: any) {

    let pattern = /---([\s\S]*)---/gim

    let text = pattern.exec(template)
    let data = {}

    if (text && text.length > 1) {
      data = YAML.parse(text[1])
    }

    return {
      template: template.replace(pattern, ""),
      data
    }
  }
}

export default Assemble;