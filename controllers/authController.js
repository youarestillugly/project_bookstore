const bcrypt=require('bcryptjs');
 const db=require('../config/db');

 //Signup
 exports.registerUser=async(req,res)=>{
    const{name,email,password}=req.body;
    const hashedPassword=awaitbcrypt.hash(password,10);
    
    try{
        await db.none('INSERTINTOusers(name,email,password)VALUES($1,$2,$3)',
            [name,email,hashedPassword]);
            res.status(201).json({message:'Userregisteredsuccessfully'});
        }catch(err){
            res.status(500).json({error:'Errorregisteringuser'});
        }
    };

 //Login
 exports.loginUser=async(req,res)=>{
    const{email,password}=req.body;
    try{
        const user=awaitdb.oneOrNone('SELECT*FROM users WHERE email=$1',[email]);
        if(!user){
            return res.status(401).json({error:'Invalid email or password'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({error:'Invalid email or password'});
        }
        req.session.user={id:user.id,name:user.name,email:user.email};
        res.json({message:'Loginsuccessful',user:req.session.user});
    }catch(err){
        res.status(500).json({error:'Errorloggingin'});
    }
};
//Logout
exports.logoutUser=(req,res)=>{
    req.session.destroy();
    res.json({message:'Logged out successfully'});
};