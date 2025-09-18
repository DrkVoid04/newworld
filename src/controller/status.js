import jwt from "jsonwebtoken"
import order from "../model/order.js"

async function stat(value, reason = null){
   if(value == 0){
    return {status:"🟡Pending", color:"rgb(255, 241, 51)", desc:"Please wait for payment approval from our staff, it may take up to 24 hours"}
   }
   else if(value == 1){
    return {status:"🟢Approved", color:"rgb(92, 255, 140)", desc:"Payment have been approved, Thank for donating"}
   }
   else if(value == -1){
    return {status:"🔴Denied", color:"rgb(255, 80, 80)", desc:`Reason: ${reason}`}
   }
}

async function statusList(req, res){
const email = jwt.decode(req.cookies.uid).email

const list = await order.find({email:email, is_Payed:true})
const array = list.reverse();

let html = "";
for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const name = element.name
    const {status, color, desc} = await stat(element.status, element.reason)
    const txnId = element.transId
    const orderID = element.orderID
    const price = element.price
    const mcName = element.mcName
    const dateRaw = new Date(element.creationTime);
    const date = `${dateRaw.getDate().toString().padStart(2, '0')}/${(dateRaw.getMonth() + 1).toString().padStart(2, '0')}/${dateRaw.getFullYear()}`;
    html += `<div class="hero-section less">
                <div class="hero-body-info">
                    <div class="hero-body-info-div">
                        <h2>${name} <p style="color: ${color}">${status}</p></h2>
                        <h3>${desc}</h3>
                    </div>
                    <div class="hero-body-info-more">
                        <h4><p>Minecraft name: </p>${mcName}</h4>
                        <h4><p>TXN ID: </p>${txnId}</h4>
                        <h4><p>ORDER ID: </p>${orderID}</h4>
                        <h4><p>Paid: </p>${price} INR</h4>
                        <h4><p>Date: </p>${date}</h4>
                    </div>
                </div>
                <div class="hero-body-name" style="justify-content: flex-end !important;">
                    <div class="form-div">
                        <button class="button toggle">Show More</button>
                    </div>
                </div>
            </div>`
}
res.render("status", {html:html})   

}
export default statusList