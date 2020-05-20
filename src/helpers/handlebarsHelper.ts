var handlebars = require("handlebars");

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

//   handlebars.registerHelper('breadcrumb', function(type: string, _id: any) {
//     return `<div>Io sono il breadcrumb UUUUUUUUUU</div>`
//   })

  export default handlebars;