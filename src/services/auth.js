import jwt from "jsonwebtoken"
const secret = "vrizzkapapadrk"

function SetUser(user){
    return jwt.sign({
        __id:user.__id,
        email:user.email,
        username:user.username
    }, secret)
}
function GetUser(token){
    try{
       return jwt.verify(token, secret)
       
    }
    catch{
        return null;
    }
}
export {SetUser, GetUser};