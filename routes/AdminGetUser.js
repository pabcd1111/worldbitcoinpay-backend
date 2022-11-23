const mongoose =require("mongoose")
// Accepting {email: email}

module.exports=function AdminGetUser(req, res){
    mongoose.model("User").findOne(
        {email: req.body.email},

        function(err, response){
            res.send(response);
        }
    )
    
}