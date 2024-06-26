import user from "../models/user.js";
import bcryptjs from 'bcryptjs';
export const getAllUser = async(req,res,next)=>{
    let users;
    try{
        users = await user.find();
    }catch(err){
        console.log(err);
    }
    if(!users){
        return res.status(404).json({message:"No users found"});
    }
    return res.status(200).json({users:users});
};

export const signup= async (req,res,next)=>{
    const {name,email,password}=req.body;
    let existingUser;
    try{
        existingUser = await user.findOne({email});
    }catch(err){
        console.log(err);
    }
    if(existingUser){
        return res.status(400).json({message:"User already exists, please login"});
    }
    const hashedPassword =bcryptjs.hashSync(password);
    const newUser = new user({
        name,
        email,
        password:hashedPassword,
        blogs:[],
    });
    
    try{
        await newUser.save();
    }catch(err){
        return console.log(err);
    }
    return res.status(201).json({user});
}

export const login=async (req,res,next)=>{
    const {email,password}=req.body;
    let existingUser;
    try{
        existingUser = await user.findOne({email});
    }catch(err){
        console.log(err);
    }
    if(!existingUser){
        return res.status(404).json({message:"User not exists"});
    }

    const isPassword = bcryptjs.compareSync(password,existingUser.password);
    if(!isPassword){
        return res.status(401).json({message:"Invalid password"});
    }
    return res.status(200).json({message:"Login Successful"});

};