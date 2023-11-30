import express from "express";
import mongoose from "mongoose";

import ejs from "ejs"
import bcrypt from "bcrypt"


const saltRounds=10;
const app=express();
const port=3000;
const uri="mongodb+srv://pridhi:Pridhi1062@cluster0.raivfgo.mongodb.net/?retryWrites=true&w=majority"
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));



mongoose.connect(uri)
.then(function(db){
console.log("database connected")
})
.catch(function(err){
    console.log(err)
})

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})
const college=new mongoose.model("college",userSchema);


app.get('/',(req,res)=>{
    res.render("home.ejs");
})
app.get('/login',(req,res)=>{
    res.render("login.ejs");
})
app.get('/register',(req,res)=>{
    res.render("register.ejs");
})



app.post("/register",async(req,res)=>{
const hash=await bcrypt.hash(req.body.password,saltRounds);
const newUser={
    email:req.body.username,
    role:req.body.role,
    password:hash
}
const data= await college.create(newUser);
res.render("login.ejs");
console.log(data);
})


app.post('/login',async (req,res)=>{
const user=req.body.username;
const pass=req.body.password;
const data=await college.findOne({email: user});
if(data){
   const ch =await bcrypt.compare(pass,data.password);
   if(ch){
        res.render("dashboard.ejs",({
            role:data.role,
            username:data.email,
        
}));
   }
   else{
    res.redirect("/login");
   }
    }
else{
    res.redirect("/login");
}

})



app.listen(port,(req,res)=>{
    console.log(`listing on ${port}`);
})