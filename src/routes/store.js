import express from "express"
import createRanklist from "../functions/ranklist.js"
import cardBuilder from "../functions/card.js"
import createCoinlist from "../functions/coinlist.js"
import paymentMethod from "../controller/payment.js"
import rank from "../model/ranks.js"
import Guard from "../middleware/Guard.js"
import order from "../model/order.js"
import statusList from "../controller/status.js"
import jwt from "jsonwebtoken"


const router = express.Router()

router.get('/store',Guard, async (reg, res)=>{
    let rank = await createRanklist()
    let coins = await createCoinlist()
        res.render("shop", {ranks : rank, coin: coins})
    
    })
router.get("/store/product",Guard, async (req, res)=>{
    let data = req.query
    if (Object.keys(data).length === 0) {
        res.redirect("/store")
      } else {
        const main = await cardBuilder(data.product_id)
        res.render("card",{card:main})
      }
})
router.get('/qr',Guard, paymentMethod)
router.get('/purchase', async (req, res)=>{
    const product = await rank.findOne({product_id:req.query.product})
    const old_price = product.price.amount
    const off = product.price.off
    const price = Math.floor(old_price - ((old_price/100)*off))
        res.render("purchase", {name:product.name,desc:product.short_desc,price:price,productId:product.product_id})  
    })

router.post("/confirmation",Guard, paymentMethod)

router.post("/confirmed",async (req,res)=>{
    try{
        const values = jwt.decode(req.cookies.uid)
        const email =  values.email
        await order.updateOne({orderID:req.body.orderId}, {$set:{transId:req.body.TXNId,is_Payed:true}})
        res.render("confirmed")
    }catch(err){
        console.log(err.message);
        res.send("Something Went wrong")
    }
})

router.get("/status", statusList)
// router.post("/payment", async(req,res) => {
//     let a = await req.body
//     let username = a.username
//     let discord = a.discord
//     let product_id = a.product_id
//     let orderID = random.generate(15)
//     let section = product.find({product_id:product_id})
//     let old_price = a.price.amount
//     let off = a.price.off
//     let price = Math.floor(old_price - ((old_price/100)*off))
    
//     let order = new order({orderID:orderID, product_id:product_id, d_Username:discord, m_Username:username, price:price, status:false})

//     //payment gateway logic here

    
// })

export default router;
