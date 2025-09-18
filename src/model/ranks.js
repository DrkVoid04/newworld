import mongoose, { Schema } from "mongoose";


const rankSchema = new Schema({
    name: String,
    short_desc: String,
    desc: String,
    banner: String,
    type: String,
    value: String,
    perks: [],
    preview:{
        RankImage: String,
        ChatImage: String,
        PlayerPreview: String,
        banner: String,
    },
    price:{
        amount:Number,
        off:Number
    },
    redirect:String,
    product_id:String
})

const rank = mongoose.model("ranks", rankSchema)
export default rank