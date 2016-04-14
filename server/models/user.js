var mongoose=require('mongoose');
require('mongoose-type-email');
var   Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	emailid:{type: mongoose.SchemaTypes.Email, required: true,unique:true},
	firstname:{type:String ,required:true},
	lastname:{type:String,required:true},
	contact: 
       {type:Number , required:true},
  isadmin:Boolean
       /* ,
       validate: {
            validator: function(v) {
                return /d{10}/.test(v);
            },
            message: '{VALUE} is not a valid 10 digit number!'
        } */
    
});

var options={
  
  usernameField:'emailid',
  usernameQueryFields: ['email'] ,
  attemptsField:'attempts',
  lastLoginField:'lastlogin',
  limitAttempts:true,
  maxAttempts:5,
  passwordValidator:function(password,cb){

    var Maxln=10;
    var Minln=5;
    var pwdlen=password.length;
    if((pwdlen<Minln) ||(pwdlen>Maxln))
     {
      cb(new Error('password policy mismatch'));
     } 
     else{
      cb(null);
     }

  }


  
  /*errorMessages:{
   
   MissingUsernameError :'No emailid was given',
   UserExistsError :'A user with the given emailid is already registered' 


  }
  */


};

User.plugin(passportLocalMongoose,options);
//User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);