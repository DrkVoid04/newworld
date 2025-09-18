import jwt from "jsonwebtoken"
import order from "../model/order.js"
import Log from "../model/logs.js"

async function stat(value, reason = null){
   if(value == 0){
    return {status:"🟡Pending", color:"rgb(255, 241, 51)", desc:"Please check if this order is correct or not!"}
   }
   else if(value == 1){
    return {status:"🟢Approved", color:"rgb(92, 255, 140)", desc:"Payment have been approved, Thank for donating"}
   }
   else if(value == -1){
    return {status:"🔴Denied", color:"rgb(255, 80, 80)", desc:`Reason: ${reason}`}
   }
}

async function adminStatus(req, res){
const adminEmail = jwt.decode(req.cookies.uid).email

const list = await order.find({is_Payed:true, status:0})
const array = list.reverse();

let html = "";
for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const name = element.name
    const orderID = element.orderID
    const {status, color, desc} = await stat(element.status, element.reason)
    const txnId = element.transId
    const price = element.price
    const dateRaw = new Date(element.creationTime);
    const date = `${dateRaw.getDate().toString().padStart(2, '0')}/${(dateRaw.getMonth() + 1).toString().padStart(2, '0')}/${dateRaw.getFullYear()}`;
    html += ` <div class="hero-section less">
                <div class="hero-body-info">
                    <div class="hero-body-info-div">
                        <h2>${name} <p style="color: ${color}">${status}</p></h2>
                        <h3>${desc}</h3>
                    </div>
                    <div class="hero-body-info-more">
                        <h4><p>TXN ID: </p>${txnId}</h4>
                        <h4><p>ORDER ID: </p>${orderID}</h4>
                        <h4><p>Paid: </p>${price}.00 INR</h4>
                        <h4><p>Date: </p>${date}</h4>
                    </div>
                </div>
                <div class="hero-body-name">
                    <div class="form-div">
                        <form class="form_box" action="/denied" method="post" novalidate>
                            <textarea name="Description" id="desc" name="reason" rows="5" placeholder="Description *" required
                                pattern="[a-zA-Z0-9]{3,12}"></textarea>
                            <input type="hidden" name="orderId" value="${orderID}">
                        </form>
                        <button class="form_submit button lol" onclick="submit_form()">Deny</button>
                        <button class="button lol" onclick="approve('${orderID}')">Approve</button>
                        <button class="button toggle hide">Show More</button>
                    </div>
                </div>
            </div>`
}

// Log the view action
await Log.create({
    action: 'VIEW',
    entity: 'ORDER',
    adminEmail: adminEmail,
    description: 'Viewed pending orders',
    ipAddress: req.ip
});

res.render("admin/orders", {html:html})   
}
export default adminStatus