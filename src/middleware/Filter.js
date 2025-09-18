// import User from "../model/user.js"
// async function findUser(user){
//     let a = await User.findOne({username: user.name})
//     if(a == null){
//         return true
//     }
//     else{
//         return false
//     }
// }
// async function findEmail(user){
//     let a = await User.findOne({email: user.email})
//     if(a == null){
//         return true
//     }
//     else{
//         return false
//     }
// }

// async function filter(req,res,next){
//     let body = await req.body
//     let c = await findUser(body)  //if user  already exists
//     if(!c) return res.render("signup",{err:"error-1"})
 
//     let email = await findEmail(body)  //if email already exists
//     if(!email) return res.render("signup",{err:"error-2"})
//     next()
// }
// export default filter;


import User from "../model/user.js";

async function userExists({ name, email }) {
  // Convert name and email to lowercase for case-insensitive search
  const lowercaseName = name.toLowerCase();
  const lowercaseEmail = email.toLowerCase();

  // Check if a user exists with the provided username or email
  const existingUser = await User.findOne({
    $or: [{ username: lowercaseName }, { email: lowercaseEmail }]
  });

  return existingUser;
}

async function filter(req, res, next) {
  const { name, email } = req.body;

  try {
    const existingUser = await userExists({ name, email });

    if (existingUser) {
      // Check if the existing user has the same username or email, and respond accordingly
      if (existingUser.username === name.toLowerCase()) {
        return res.render("signup", { err: "error-1" }); // Username exists
      } else if (existingUser.email === email.toLowerCase()) {
        return res.render("signup", { err: "error-2" }); // Email exists
      }
    }
    
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: "Error processing signup" });
  }
}

export default filter;
