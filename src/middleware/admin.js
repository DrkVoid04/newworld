import jwt from "jsonwebtoken"
import User from "../model/user.js"

async function getAdmin(req, res, next) {
    const value = jwt.decode(req.cookies.uid).email
    const admin = await User.findOne({email:value, is_Admin:true})
    if(!admin){
      return res.send("You are not an admin!")
    }
    else{
        next()
    }

}
export default getAdmin