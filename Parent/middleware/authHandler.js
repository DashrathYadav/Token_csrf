const jwt=require("jsonwebtoken");

module.exports.authorize= async function(req,res,next){


    // console.log((req.headers.cookie.slice(4)));
    const token=req?.headers?.cookie?.slice(4);
    console.log(req.headers.cookie);
    if(token)
    {
        jwt.verify(token,"Thisisthemostsecrerkey",(err,decode)=>{
            if(err)
            {
                console.log("Not Matching");
                console.log(err);
                res.redirect("/login");
                return;
            }
            next();
            return;

        })
    }
    else{
        console.log("No token found");
        res.redirect("/login");
        return;
    }
  
}