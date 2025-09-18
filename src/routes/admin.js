import express from "express"
import adminStatus from "../controller/admin-status.js";
import runCommandIfOnline from "../controller/rc.js";
import order from "../model/order.js";
import rank from "../model/ranks.js";
import Guard from "../middleware/Guard.js";
import getAdmin from "../middleware/admin.js";

const admin = express.Router()
admin.get("/create", (req,res)=>{
    res.render("coming")
})
admin.get("/delete", (req,res)=>{
    res.render("coming")
})
admin.get('/admin-status', Guard, getAdmin, adminStatus)
admin.post("/denied", async(req, res)=>{
    const {Description, orderId} = req.body
    await order.updateOne({orderID:orderId}, {$set:{reason:Description, status:-1}})
    res.render("denied",{reason:Description})
})
admin.get("/approved",Guard,getAdmin, async(req, res)=>{
    const {orderId} = req.query
    const o = await  order.findOne({orderID:orderId})
    const pro = await rank.findOne({product_id:o.product_id})
    const value = pro.value
    const player = o.mcName
    let command
    if(pro.type == "rank"){
        command = `lp user ${player} parent set ${value}`
    }
    else if(pro.type == "coin"){
        command = `say command 2`
    }
    try{
        await runCommandIfOnline(command)
        await order.updateOne({orderID:o.orderID}, {$set:{status:1}})
        res.render("approved")
    }catch(err){
    res.send(err.message)
}
})

export default admin;