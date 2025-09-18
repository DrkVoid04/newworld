import express from "express"
import createUser from "../controller/Create.js"
import filter from "../middleware/Filter.js"
import CheckUser from "../controller/Check.js"
import Guard from "../middleware/Guard.js"
import jwt from "jsonwebtoken"
import forget from "../controller/forget.js"
import User from "../model/user.js"
const router =  express.Router()

router.get("/signup",(req, res)=>{
    res.render("signup", {err:null})
}).post("/signup",filter, createUser)

router.get("/login", (req,res) =>{
    res.render("login", {err:null})
}).post("/login", CheckUser)

router.get("/profile",Guard, (req,res)=>{
    const value = jwt.decode(req.cookies.uid)
    console.log(value)
    res.render("profile", {name:value.username, email:value.email})
})
router.get("/reset", (req, res) => {
    res.render("reset")
})
router.post("/reset-mail", forget)
router.get("/reset-password",async (req, res) =>{
    const token = req.query.token
    if(!token){
        res.send("Page not found")
    } else if (token == ""){
        res.send("Page not found")
    } else{
        const user = await User.findOne({token:token})
        if(user){
            res.render("password", {token:token})
        } else{
            res.send("Page not found")
        }
    }

    
})
router.post("/reset-submit",async (req, res)=>{
    const token = req.query.token
    if(!token){
        res.send("Page not found")
    } else if (token == ""){
        res.send("Page not found")
    } else{
        const user = await User.findOne({token:token})
        if(user){
            await  User.updateOne({token:token}, {$set:{password:req.body.password, token:""}})

            res.render("success",)
        } else{
            res.send("Page not found")
        }
    }
   
})
export default router;
