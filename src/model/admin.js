import mongoose, { Schema } from 'mongoose';

const AdminSchema = new Schema({
   upi: String,
   rcon_ip: String,
   rcon_port: String,
   rcon_pass: String,
   website_link: String,
   discord_link: String,
   rank:String,
   coin:String,
   discord_banner: String,
   mail: String,
   ip: String,
   port: String
});

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;