var handlebars = require("handlebars");
var fs = require('fs');
const YAML = require('yaml')


handlebars.registerHelper('limit', function (arr: any, limit: any) {  
  if (!Array.isArray(arr)) { return []; }
  return arr.slice(0, limit);
});

handlebars.registerHelper({
  eq: (v1: any, v2: any) => v1 === v2,
  ne: (v1: any, v2: any) => v1 !== v2,
  lt: (v1: any, v2: any) => v1 < v2,
  gt: (v1: any, v2: any) => v1 > v2,
  lte: (v1: any, v2: any) => v1 <= v2,
  gte: (v1: any, v2: any) => v1 >= v2,
  and() {
      return Array.prototype.every.call(arguments, Boolean);
  },
  or() {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  }
});

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
      const template = await fs.readFileSync(`${this.options.templatesPath}/${name}.hbs`, 'utf8')
      let templateData = this.parseData(template)
      handlebars.partials['body'] = handlebars.compile(templateData.template)
      return templateData.data
    } catch(e) {
      console.log(e)
    }
  }

  async render(name: string, data: any) {
    let templateFile = await fs.readFileSync(`${this.options.defaultLayout}`, 'utf8')

    let newdata = await this.setTemplate(name, data)

    let template = handlebars.compile(templateFile)
    const tmpData = Object.assign(data, newdata);
    
    let result = template(tmpData)

    try {
      await fs.writeFileSync(`${this.options.defaultFolder}${data.slug}.html`, result)
    }catch(e) {
      console.log(e)
    }
  }

  async renderSimple(templatename: string, data: any) {
    //render template without a layout
    let templateFile = await fs.readFileSync(`${this.options.templatesPath}/${templatename}.hbs`, 'utf8')
    let template = handlebars.compile(templateFile)
    let result = template(data)
    try {
      await fs.writeFileSync(`${this.options.defaultFolder}${data.slug}.html`, result)
    }catch(e) {
      console.log(e)
    }
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