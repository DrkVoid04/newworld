import mongoose, { now, Schema } from "mongoose";


const orderSchema = new Schema({
    orderID: String,
    product_id:String,
    name:String,
    transId:String,
    mcName:String,
    dcName:String,
    email:String,
    status:Number,
    reason:String,
    price:String,
    creationTime:String,
    ReviewTime:String,
    is_Payed:Boolean,
})

const order = mongoose.model("order", orderSchema)
export default order