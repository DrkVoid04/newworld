import { Rcon } from "rcon-client";
import Admin from "../model/admin.js";



async function runCommandIfOnline(command) {

  try {
    const ad = await Admin.findOne()
    const SERVER_HOST = ad.rcon_ip;   // Only IP, without port
    const RCON_PORT = ad.rcon_port;                 // Your custom RCON port
    const RCON_PASSWORD = ad.rcon_pass;
    const rcon = await Rcon.connect({
      host: SERVER_HOST,
      port: RCON_PORT,
      password: RCON_PASSWORD
    });

    // If connection is successful, send the command
    const response = await rcon.send(command);
    console.log('Command Response:', response);
    rcon.end(); // Close the connection after sending the command

  } catch (error) {
    // Throw a new error specifically indicating the server is offline
    throw new Error("Server is offline");
  }
}

export default runCommandIfOnline;
