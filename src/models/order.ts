import { Schema, Document } from 'mongoose';


const order: Schema = new Schema({
  _id: Schema.Types.ObjectId,
  acquisitionDate: Date,
  orderFulfillmentDate: Date,
  paymentDate: Date,
  price: String,
  comment: String,
})

order.index({'$**': 'text'});

interface IOrder extends Document {
  acquisitionDate: Date,
  orderFulfillmentDate: Date,
  paymentDate: Date,
  price: string,
  comment: string
}

export { 
    order,
    IOrder
}