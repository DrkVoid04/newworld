import { GetUser } from "../services/auth.js";

async function Guard(req,res,next){
    let UserId = await req.cookies?.uid
    if(!UserId) return res.redirect("/login")
    
    let user = GetUser(UserId)
    if(!user) return res.redirect("/login")
    
    req.user = user
    next()
}

export default Guard;
