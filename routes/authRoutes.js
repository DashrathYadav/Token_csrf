
const { Router }=require('express');

const { signup_get,signup_post,login_get,login_post,home_get, changeEmail,profile_get,account_get, changePassword_get, changePassword_post, forgotPassword_get, forgotPassword_post} =require('../controller/authController');
const { authorize } = require('../middleware/authHandler');

 const router=Router();
 router.post("/changemail",authorize,changeEmail);
router.get("/",authorize,home_get);
router.get("/profile",authorize,profile_get);
router.get("/signup",signup_get);
 router.post("/signup",signup_post);
 router.get("/login",login_get);
 router.post("/login",login_post);
 router.get("/account",account_get);

 // Add this line to the top, with the other require statements

// Add these lines at the bottom, after the existing routes
router.get("/change-password",authorize,changePassword_get);
router.post("/change-password",authorize,changePassword_post);


// Add this line to the top, with the other require statements

// Add these lines at the bottom, after the existing routes
router.get("/forgot-password", forgotPassword_get);
router.post("/forgot-password", forgotPassword_post);


//  router.get("/profile",authorize,get_Profile);

 
 module.exports=router;




