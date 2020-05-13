import { Document } from 'mongoose';

const defaultPageField = {
  meta: {
      title: {
          type: String, 
      },
      description: {
          type: String, 
      },
      keywork: {
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
  }
};

interface IBasePage extends Document {
  meta: any;
  title: string;
  description: string;
  body: string;
  slug: string;
  ord: number;
  published: boolean;
}

export { defaultPageField, IBasePage }