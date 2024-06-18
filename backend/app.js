import express from 'express';
import mongoose from 'mongoose';
import {router} from './routes/user-routes.js';
import { blogRouter } from './routes/blog-routes.js';

const app=express();
app.use(express.json()); //previous parser was used now we use this middleware
app.use('/api/user/',router);
app.use('/api/blog',blogRouter)

mongoose.connect('mongodb+srv://admin:sahuabhay123@cluster0.tmid40s.mongodb.net/Blog?retryWrites=true&w=majority').then(()=>app.listen(5000)).then(()=>console.log("Connected to database and listening to localhost port 5000")).catch((err)=>console.log(err));
;