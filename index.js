const express = require("express");
const authRoutes = require("./routes/authRoutes");
const app = express();
require('dotenv').config({path:'./.env'})
const mongoose=require("mongoose");
const bodyParser = require("body-parser");
const cookeiParser=require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(authRoutes);
app.use(cookeiParser());
const dbURI =process.env.DB_URL;

mongoose
  .connect(dbURI)
  .then((result,err) => {
    console.log("DataBase Connected");
  });

const token = "TOKEN_IS_HERE";
const port = 3000;

// app.get("/", (req, res) => {


//     res.cookie("secondUser",false,{maxAge:1000*60,secure:true,httpOnly:true});
//     res.send("Cookie is set");

// });

app.get("/",(req,res)=>{
  console.log('route hit');
  // console.log(req.headers.cookie);
//  res.cookie()
  console.log( (req.cookies));
  res.send(req.cookies);
})

// app.post("/signup", function (req, res) {});

// app.get("/login", function (req, res) {
//   res.sendFile(__dirname + "/login.html");
// });

// app.post("/login", function (req, res) {
//   // Add logic to decode body
//   // body should have email and password
//   const email = req.body.Email.toLowerCase();
//   const password = req.body.password;
//   // Check if the user with the given email exists in the USERS array
//   // Also ensure that the password is the same
//   if (
//     USERS.find((user) => {
//       return user.email === email && password === user.password;
//     })
//   ) {
//     res.status(200).send({ token: token });
//   } else {
//     res.status(401).send(`<p>401 <br> Not Matching</p>`);
//   }
//   // If the password is the same, return back 200 status code to the client
//   // Also send back a token (any random string will do for now)
//   // If the password is not the same, return back 401 status code to the client
// });

// app.get("/questions", function (req, res) {
//   //return the user all the questions in the QUESTIONS array
//   res.send(QUESTIONS);
// });

// app.get("/submissions", (req, res) => {
//   res.sendFile(__dirname + "/submissions.html");
// });

// app.post("/submissions", function (req, res) {
//   // return the users submissions for this problem
//   let title = req.body.title;
//   if (title !== undefined) title = title.toLowerCase();

//   let ans = SUBMISSION.find((submit) => {
//     return submit.title === title;
//   });

//   if (ans === undefined) {
//     ans =
//       "No submition for  yet  for the particular Problem You can be first to submit !";
//   }

//   res.status(200).send(ans);
// });

// app.get("/submit", (req, res) => {
//   res.sendFile(__dirname + "/submit.html");
// });

// app.post("/submit", function (req, res) {
//   // let the user submit a problem, randomly accept or reject the solution
//   // Store the submission in the SUBMISSION array above
//   let id = req.body.id;
//   let title = req.body.title;
//   let solution = req.body.solution;

//   SUBMISSION.push({ id, title, solution });

//   let wasRight = Math.round(Math.random() * 10) % 2;
//   console.log(wasRight);

//   if (wasRight) {
//     res.status(200).send({ Verdict: "Accepted" });
//   } else {
//     res.status(200).send({ Verdict: "Wrong" });
//   }
// });

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

const PORT= process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
  console.log("http://localhost:3000");
});
