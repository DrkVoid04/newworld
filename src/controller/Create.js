import User from "../model/user.js";

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    // Convert name and email to lowercase before creating the user
    const lowercaseName = name.toLowerCase();
    const lowercaseEmail = email.toLowerCase();

    let user = await User.create({
      username: lowercaseName,
      email: lowercaseEmail,
      password: password,
    });
    res.redirect("/login");
  } catch (error) {
    console.log(error.code);
    res.render("signup", { err: "error-3" });
  }
}

export default createUser;
