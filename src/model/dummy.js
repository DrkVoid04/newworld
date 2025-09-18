
import mongoose from "mongoose";
import rank from "./ranks.js";
import Admin from "./admin.js";

mongoose.connect("mongodb+srv://drkvoid:drkvoid98280@mydicordbot.wsrhai6.mongodb.net/")

// const a = new rank({product_id:"dummy",type:"rank", name:"dummy", desc:"dummy", short_desc:"dummy", preview:{RankImage:"link1",ChatImage:"link2", PlayerPreview:"link3"}, perks:["perk1","perk2","perk3"], redirect:"https://www.ognetwork.fun", price:{amount:32,off:34}})
// a.save()

// console.log('done', a);


import coin from "./ranks.js";


// const b = new coin({product_id:"coin_bundle_1",type:"coin", short_desc:"dummy", name:"5000 coins", price:{amount:300, off:23}})
// b.save()

const c = new Admin({upi:"dummy@upi", rcon_ip:"13124411441",mail:"dummy@mail.com",discord_link: "https://discord.gg/og-network",discord_banner: "dsa", rcon_port:"12331", rcon_pass:"jhdaiuhaid", website_link:"yoursite.com", ip:"yourip.net",port:"2131"})
c.save()