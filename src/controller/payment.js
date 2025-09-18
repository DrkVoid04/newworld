import QRCode from "qrcode";
import path from "path";
import rank from "../model/ranks.js";
import fs from "fs";
import Randomstring from "randomstring";
import jwt from "jsonwebtoken"

import { fileURLToPath } from "url";
import { dirname } from "path";
import order from "../model/order.js";
import { now } from "mongoose";
import Admin from "../model/admin.js";

// Function to mimic __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function orderId(req) {
  const { mcName, dcName, productId } = req.body;
  const product = await rank.findOne({ product_id: productId });
  const old_price = product.price.amount;
  const off = product.price.off;
  const price = Math.floor(old_price - (old_price / 100) * off);
  const orderId = Randomstring.generate({
    length: 15,
    charset: "numeric",
  });
  const values = jwt.decode(req.cookies.uid)
  const email =  values.email

  await order.create({
    orderID: orderId,
    product_id: productId,
    email:email,
    name:product.name,
    mcName: mcName,
    dcName: dcName,
    status: 0,
    price: price,
    creationTime: now(),
    is_Payed: false,
  });
  return {o:orderId, p:price, mc:mcName};

}

async function paymentMethod(req, res) {
  const {o,p,mc} = await orderId(req);
  const form = await  Admin.findOne()
  const upiId = form.upi;
  const qrFileName = `qr_code_${Date.now()}.png`; // Unique name for each QR code
  const qrFilePath = path.join(__dirname, "..", "..", "public", qrFileName);

  // Format UPI URI
  const upiString = `upi://pay?pa=${upiId}&pn=${mc}&am=${p}&cu=INR`;

  try {
    // Generate QR code and save it as a PNG file
    await QRCode.toFile(qrFilePath, upiString);
    // Pass the QR code image URL to the EJS template
    res.render("confirm", { qrCodeImage: `/${qrFileName}`, orderId:o,price:p});

    // Schedule the QR file to be deleted after 5 minutes (300,000 milliseconds)
    setTimeout(() => {
      fs.unlink(qrFilePath, (err) => {
        if (err) {
          console.error("Error deleting QR code file", err);
        } else {
          console.log(`QR code file ${qrFileName} deleted successfully.`);
        }
      });
    }, 300000); // 5 minutes = 300000 ms
  } catch (err) {
    console.error("Error generating QR code", err);
    res.status(500).send("Error generating QR code");
  }
}

export default paymentMethod;
