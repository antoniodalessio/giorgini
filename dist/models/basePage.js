"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultPageField = {
    meta: {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        keywords: {
            type: String,
        }
    },
    template: {
        type: String
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true,
        required: '{PATH} is required!'
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    body: {
        type: String
    },
    ord: {
        type: Number
    },
    published: {
        type: Boolean
    },
    icon: {
        type: String
    }
};
exports.defaultPageField = defaultPageField;
//# sourceMappingURL=basePage.js.map