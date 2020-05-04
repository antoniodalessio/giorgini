"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    getAll(req, res, populate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let limit = 0;
                let filter = {};
                let sort = {};
                let range = [];
                if (req.query.hasOwnProperty('filter')) {
                    filter = JSON.parse(req.query.filter);
                    if (filter.hasOwnProperty("q")) {
                        //$text: {$search: request.searchtext}
                        filter.$text = { $search: filter.q };
                        delete filter.q;
                    }
                }
                if (req.query.hasOwnProperty('range')) {
                    range = JSON.parse(req.query.range);
                }
                if (req.query.hasOwnProperty('sort')) {
                    const sortTmp = JSON.parse(req.query.sort);
                    sortTmp[1] == 'ASC' ? sort = `${sortTmp[0]}` : sort = `-${sortTmp[0]}`;
                }
                const all = yield this.model.find(filter);
                limit = range[1] - range[0] + 1;
                const data = yield this.model.find(filter).sort(sort).skip(range[0]).limit(limit).populate(populate);
                res.header('Content-Range', all.length);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    get(req, res, populate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = yield this.model.findOne({ _id: id }).populate(populate);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            this.model.deleteOne({ _id: id }, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        });
    }
}
exports.default = BaseController;
//# sourceMappingURL=base.controller.js.map