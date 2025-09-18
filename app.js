import express from "express"
import mongoose from "mongoose"
import main from "./src/routes/main.js"
import auth from "./src/routes/user.js"
import store from "./src/routes/store.js"
import cookieParser from 'cookie-parser';
import admin from "./src/routes/admin.js"


const app = express()
const port = 3000
mongoose.connect("mongodb+srv://drkvoid:drkvoid98280@mydicordbot.wsrhai6.mongodb.net/")

app.use(express.static("views"))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.use(express.json()); // Accepts data in JSON format
app.use(express.urlencoded({ extended: true })); // Decodes data sent by form
app.use(cookieParser());

// Routes
app.use("/", main)
app.use("/", auth)
app.use("/", store)
app.use("/", admin)


app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})