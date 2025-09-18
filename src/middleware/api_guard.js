import User from "../models/User.js"

async function api_guard(req, res, next) {
    let query = req.query.token
    let token = await User.findOne({token:req.query.token})
    if(!query) return res.send("page not found")
    if(!token) return res.send("invalid session")
    if(!token==null) return res.send("invalid session")
    next()
}
export default api_guard;