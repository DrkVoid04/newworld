// import User from "../model/user.js"
// import { SetUser } from "../services/auth.js"
// async function CheckUser(req,res){
//     let a = req.body
// try{
//     let b = await User.findOne({username:a.name, password:a.password})
//     if(b == null){
//         let c = await User.findOne({email:a.name, password:a.password})
//         if(c == null){
//             res.render("login", {err: "error-1"})
//         }
//         else{
//             let token = SetUser(c)
//             res.cookie("uid",token)
//             res.redirect("/")
//         }
//     }
//     else{
//         let token = SetUser(b)
//         res.cookie("uid",token)
//         res.redirect("/")
//     }
// }
// catch(err){
//    console.error(err.message)
// }
// }
// export default CheckUser;

import User from "../model/user.js";
import { SetUser } from "../services/auth.js";

async function CheckUser(req, res) {
  const { name, password } = req.body;

  try {
    // Convert `name` to lowercase for case-insensitive search
    const usernameOrEmail = name.toLowerCase();

    // Check for user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      password: password
    });

    if (!user) {
      // Render login with an error if no user is found
      return res.render("login", { err: "error-1" });
    }

    // If user is found, create a token and set cookie
    const token = SetUser(user);
    res.cookie("uid", token);
    res.redirect("/");
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error processing login" });
  }
}

export default CheckUser;
