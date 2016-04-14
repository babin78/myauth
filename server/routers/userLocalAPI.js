
var express = require('express');
var router = express.Router();
var User=require('../models/user');
var passport = require('passport');


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




router.post('/register', function(req, res, next) {
  console.log('registering user');
  User.register(new User({username:req.body.username,emailid:req.body.emailid,firstname:req.body.firstname,lastname:req.body.lastname,contact:req.body.contact}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');

    res.status(200).send({status:'success',message:'registration sucessfull'});
  });
});


router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).send({status:'success',message:'user sucessfully loggedout'});
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({status:'success',
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status:'success',
        message: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/isactive',function(req,res){

	 if (req.user) {
	 	console.log(req.user);
        res.status(200).send({status:'success',message:'user session is still active'});
    } else {
        res.status(401).send({status:'failed',message:'user session expired'});
    }
});

router.get('/isadmin/:username',function(req,res,next){

      //console.log(req.param.emailid);
      //console.log(emailid);
      User.findOne({'username':req.params.username}).exec(function(err,user){
        
        
        if(err){
           return	next(err);
        }

        var userObj=null;
        if(user){

        	userObj=JSON.parse(JSON.stringify(user));
	        console.log(userObj);
	        console.log(userObj.isadmin);
        }
        if(userObj && (userObj.isadmin===true)){
        	res.status(200).send({status:'success',message:'true'});
        }
        else{
        	res.status(200).send({status:'success',message:'false'});
        } 	
        
       
      });

  });

router.post('/changepassword/',function(req,res,next){

    
  User.findByUsername(req.body.username, function(err, user) {	
    console.log('user found');
    console.log(user);
    if (err) { next(err);}

    console.log('updating new password:'+req.body.password);
    
    
    user.setPassword(req.body.password, function(err) {
        if (err) { next(err);}
        else{
		        console.log('updated user');
            console.log(user);
            console.log('saving user');
            user.save(function(err) {
		            if (err) { next(err);}
                else {
                  
                  console.log('after saving');
                  console.log(user);
                
                  res.status(200).send({status:'success',message:'password changed sucessfully'});

                }
		        });

    	   }
    });

    



});

  

});
	 
router.get('/isemailverified/:emailid',function(req,res,next){

      //console.log(req.param.emailid);
      //console.log(emailid);
      User.findOne({'emailid':req.params.emailid}).exec(function(err,user){
        
        
        if(err){
           return	next(err);
        }

        var userObj=null;
        if(user){

        	userObj=JSON.parse(JSON.stringify(user));
	        console.log(userObj);
	        console.log(userObj.isemailverified);
        }
        if(userObj && (userObj.isemailverified===true)){
        	res.status(200).send({status:'success',message:'true'});
        }
        else{
        	res.status(200).send({status:'success',message:'false'});
        } 	
        
       
      });

  });

router.get('/iscontactverified/:emailid',function(req,res,next){

      
      User.findOne({'emailid':req.params.emailid}).exec(function(err,user){
        
        
        if(err){
           return	next(err);
        }

        var userObj=null;
        if(user){

        	userObj=JSON.parse(JSON.stringify(user));
	        
        }
        if(userObj && (userObj.isecontactverified===true)){
        	res.status(200).send({status:'success',message:'true'});
        }
        else{
        	res.status(200).send({status:'success',message:'false'});
        } 	
        
       
      });

  });

router.post('/setadmin/',function(req,res,next){
  if(!req.user){

    next(new Error('you are not authenticated'));
  }
  
   var user=JSON.parse(JSON.stringify(req.user));
   //console.log(user);

  if(user.isadmin ===true){

    next(null);


  }
  else{
    
    next(new Error('you are not authorized'));
  }

},function(req,res,next){

        User.findOne({emailid:req.body.emailid},function(err,doc){

                    //doc.isadmin='false';
                   
                    doc.isadmin=req.body.flag;
                    doc.markModified('isadmin');

                    console.log(doc);
                    doc.save(function(err){

                        if(err){next(err);}
                        else{
                            return res.status(200).send({status:'success',message:'done'}); 
                        }
                    });


                  });

  });


router.post('/test',function(req,res){

   /*
   User.findOneAndUpdate({emailid:'subhanshu@newgen.co.in'},function(err,doc){
    return res.status(200).send({error:err,dx:doc}); 

  });
*/
User.findOne({emailid:'subhanshu@gmail.com'},function(err,doc){

  //doc.isadmin='false';

  doc.isadmin='mmmmmmm';
  doc.save(function(err){

      return res.status(200).send({error:err}); 
  });


});
/*
  User.findOneAndUpdate({'firstname':'subhanshu'},{'isadmin':'true'},{new:true,upsert:true},function(err,doc){
    return res.status(200).send({error:err,dx:doc}); 

  });

*/


});


module.exports = router;

