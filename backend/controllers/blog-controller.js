import mongoose from 'mongoose';
import blog from '../models/Blog.js'; //{} remove
import User from "../models/user.js";
export const getAllBlogs= async(req,res,next)=>{
    let blogs;
    try{
        blogs=await blog.find();
    } catch(err){
        console.log(err);
    }
    if(!blogs){
        return res.status(404).json({message:"No blogs found"});
    }
    return res.status(200).json({blogs});
}

export const addBlog= async(req, res,next)=>{
    const {title, description, image, user} = req.body
    let existingUser;
    try{
        existingUser = await User.findById(user);
    }catch(err){
        return console.log(err);
    }
    if(!existingUser){
        return res.status(400).json({message:"Unable to find user by this id"});
    }
    const blogs= new blog({
        title,description,image,user
    });
    try{
       const session=await mongoose.startSession();
       session.startTransaction();
       await blogs.save({session});
       existingUser.blogs.push(blogs);
       await existingUser.save({session});
       await session.commitTransaction();
    }catch(err){
        return console.log(err);
        return res.status(500).json({message:err});
    }
    return res.status(200).json({blogs});
}

export const updateBlog= async(req, res, next)=>{
    const {title,description} = req.body;
    const blogId=req.params.id;
    let blogs;
    try{
        blogs=await blog.findByIdAndUpdate(blogId,{
            title,
            description
        });
    }catch(err){
        return console.log(err);
    }
    if(!blogs){
        return res.status(500).json({message:"Unable to update the blog"});
    }
    return res.status(200).json({blogs});
    
}

export const getById= async(req,res,next)=>{
    const id=req.params.id;
    let blogs;
    try{
        blogs=await blog.findById(id);
    }catch(err){
        return console.log(err);
    }
    if(!blogs){
        return res.status(404).json({message:"No blog found"});
    }
    return res.status(200).json({blogs});

}

export const deleteBlog= async(req,res,next)=>{
    const id=req.params.id;

    let blogs;
    try{
        blogs=await blog.findByIdAndDelete(id).populate('User');
        await blogs.user.blogs.pull(blogs);
        await blogs.user.save();
    }catch(err){
        return console.log(err);
    }
    if(!blogs){
        return res.status(404).json({message:"No blog to delete"});
    }
    return res.status(200).json({message:"Successfully deleted"});
}

export const getByUserId= async (req,res,next)=>{
const userId=req.params.id;
let userBlogs;
try{
    userBlogs=await User.findById(userId).populate('blog');
}
catch(err){
    return console.log(err);
}
if(!userBlogs){
    return res.status(404).json({message:"No blogs found"});
}
return res.status(200).json({blogs:userBlogs});
}