import express from "express"
import adminStatus from "../controller/admin-status.js";
import runCommandIfOnline from "../controller/rc.js";
import order from "../model/order.js";
import rank from "../model/ranks.js";
import Log from "../model/logs.js";
import Guard from "../middleware/Guard.js";
import getAdmin from "../middleware/admin.js";
import jwt from "jsonwebtoken";

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
    const adminEmail = jwt.decode(req.cookies.uid).email
    
    await order.updateOne({orderID:orderId}, {$set:{reason:Description, status:-1}})
    
    // Log the denial
    await Log.create({
        action: 'DENY',
        entity: 'ORDER',
        entityId: orderId,
        adminEmail: adminEmail,
        description: `Denied order ${orderId}: ${Description}`,
        ipAddress: req.ip
    });
    
    res.render("denied",{reason:Description})
})
admin.get("/approved",Guard,getAdmin, async(req, res)=>{
    const {orderId} = req.query
    const adminEmail = jwt.decode(req.cookies.uid).email
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
        
        // Log the approval
        await Log.create({
            action: 'APPROVE',
            entity: 'ORDER',
            entityId: orderId,
            adminEmail: adminEmail,
            description: `Approved order ${orderId} for ${o.mcName}`,
            ipAddress: req.ip
        });
        
        res.render("approved")
    }catch(err){
        // Log the error
        await Log.create({
            action: 'ERROR',
            entity: 'ORDER',
            entityId: orderId,
            adminEmail: adminEmail,
            description: `Failed to approve order ${orderId}: ${err.message}`,
            ipAddress: req.ip
        });
        
    res.send(err.message)
}
})

export default admin;