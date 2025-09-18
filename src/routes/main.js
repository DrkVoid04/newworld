import express from "express"
import support from "../controller/support.js"
import Admin from "../model/admin.js"

const main = express.Router()


main.get('/', async(req, res) => {
    let ad = await Admin.findOne()
    res.render("index", {server:ad.ip, port:ad.port, banner:ad.discord_banner})
})

main.get('/home',async (req, res) => {
const ad = await Admin.findOne()
    res.render("index", {server:ad.ip, port:ad.port, banner:ad.discord_banner})
    })
main.get('/discord',async (reg, res)=>{
    const ad = await Admin.findOne()
        res.redirect(ad.discord_link)
    })
main.get('/test-cookies', (req, res) => {
        console.log(req.cookies); // Should log the full cookies object
        res.send(req.cookies.uid ? 'Cookie found' : 'No cookie');
    });
    
main.get('/support', (reg, res)=>{
        res.render("support")
}).post("/support-send", support)
    

export default main