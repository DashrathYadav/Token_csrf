const userModel = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
let current_user;
// formating response to send to user
const userHandler = function (status, msg, result) {
  const message = { status, msg, result };
  return message;
};

// creating token
const maxAge = 60 * 60; //1 hour
function createToken(id) {
  return jwt.sign({ id }, "Thisisthemostsecrerkey", { expiresIn: maxAge });
}

//get  signup
module.exports.signup_get = (req, res) => {
  res.render("signup", { error: undefined });
};

// post sign up
module.exports.signup_post = (req, res) => {
  let email = req.body.Email;
  let password = req.body.password;
  email = email.toLowerCase();
  userModel
    .create({ email, password })
    .then((result) => {
      current_user=email;
      const data = userHandler(201, { message: "New user created" }, result);
      const token = createToken(result._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); // 1 hour
      res.redirect("/");
      
      // res.render("welcome", data);
      return;
    })
    .catch((result) => {
      let msg;
      if (result.code === 11000) msg = "User with this  Id already exist";
      else msg = result.message;
      const data = userHandler(res, 401, msg, result);
      res.render("signup", { error: msg });
      return;
    });
};

// get login
module.exports.login_get = (req, res) => {
  res.render("login",{error:undefined});
  return;
};

// post login
module.exports.login_post = async (req, res) => {
  let message=''
  let email = req.body.Email;
  let password = req.body.password;
  if (!validator.default.isEmail(email) || password.length < 4) {
    // userHandler(
    //   res,
    //   401,
    //   { message: "Invalid Email or Password length  is less than 4 " },
    //   {}
    // );
      res.render("login",{error: "Invalid Email or Password length  is less than 4 "})
    return;
  }

  email = email.toLowerCase();

  const user = userModel
    .findOne({ email })
    .then((result) => {
      if (result !== null) {
        console.log(result.password);
        bcrypt.compare(password, result.password).then((Result) => {
          if (Result)
          {
            current_user=email
           const data =userHandler(200, { message: "User Found " }, result);
           console.log(data);
           const token = createToken(result._id);
           res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
           res.redirect("/");
           return;
          }
            
          else
            // userHandler(res, 401, { message: "Credintials Not Match" }, result);
            res.render("login",{error: "Credintials Not Match"})
          return;
        });
        return;
      } else if (result === null){
        // userHandler(res, 401, { message: "User Not Found" }, {});
        res.render("login",{error: "User Not Found"})

      }
      else{
        // userHandler(res, 401, { message: "Invalid Credintials" }, {});
      res.render("login",{error: "Invalid Credintials"})

    }
      return;
    })
    .catch((result) => {
      console.log("here");
      // userHandler(res, 401, { message: "something went wrong" }, result);
      res.render("login",{error: "something went wrong"})
      console.log(result);
      return;
    });
};


// home route
module.exports.home_get=(req,res)=>{


  console.log( "user cookie is",req.headers.cookie);
  res.render("home");

}


//making user possible to change email
module.exports.changeEmail=async function(req,res){


  const Email=req.body.Email;
  console.log("form email ",Email)
  const token=req?.headers?.cookie?.slice(4);
  console.log("token in this.changeEmail ",token);
  jwt.verify(token,"Thisisthemostsecrerkey",async (err,decode)=>{
    if(err)
    {
        console.log("Not Matching");
        console.log(err);
        res.redirect("/login");
        return;
    }
    const user_id=decode?.id;
    console.log("user id is ",decode?.id);
    const filter={ _id:user_id};
    const update={email:Email};

     const record=await userModel.findOneAndUpdate( filter ,update);

   console.log("User chane is triggered",record);
   res.redirect("/");
   return;

})
}

module.exports.profile_get = (req, res) => {
  console.log("current user is",current_user)
  res.render("profile",{email:current_user});
  return;
};


module.exports.profile_get = (req, res) => {
  console.log("current user is",current_user)
  res.render("profile",{email:current_user});
  return;
};

module.exports.account_get = (req, res) => {
  console.log("current user is",current_user)
  res.render("secrete");
  return;
};


// -----------Additional code
// get change password
module.exports.changePassword_get = (req, res) => {
  res.render("change-password", { error: undefined });
};

// post change password
module.exports.changePassword_post = async (req, res) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  // Check if the current password is correct
  const user = await userModel.findOne({ email: current_user });
  if (!user) {
    res.render("change-password", { error: "User not found" });
    return;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.render("change-password", { error: "Incorrect current password" });
    return;
  }

// ----- Do not hash as it will rehash by middleware of mongodb

  // Generate a new hashed password
  // const salt=await bcrypt.genSalt();
  // // this.password=await bcrypt.hash(this.password,salt);
  // // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update the user's password in the database
  user.password = newPassword;
  await user.save();

  res.redirect("/profile");
};




// --------------Forgotten Password 




// ...

// get forgot password
module.exports.forgotPassword_get = (req, res) => {
  res.render("forgot-password", { error: undefined });
};


// post forgot password
module.exports.forgotPassword_post = async (req, res) => {
  const email = req.body.email;

  // Check if the email exists in the database
  const user = await userModel.findOne({ email });
  if (!user) {
    res.render("forgot-password", { error: "Email not found" });
    return;
  }

  // Generate a new password
  const newPassword = Math.random().toString(36).substring(2, 6);

  // Encrypt the new password
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update the user's password in the database
  user.password = newPassword;
  await user.save();

  // Send the password reset email

  // const transporter = nodeMailer.createTransport({
  //   host:"smtp.gmail.com",
  //   port: 465,
  //   service:'gmail',
  //   auth: {
  //     user: process.env.SMPT_MAIL,
  //     pass: process.env.SMPT_PASSWORD,
  //   },
  // });



  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "userhosting01@gmail.com",
      pass: "kxamazsesayttoxj",
    },
  });

  const mailOptions = {
    from: "userhosting01@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Your new password is: ${newPassword}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully!");
    }
  });

  res.redirect("/login");
};
