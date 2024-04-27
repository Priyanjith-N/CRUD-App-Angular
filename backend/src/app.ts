import express, { Application, Request, Response } from 'express'
import userRoutes from './routers/userRoutes';
import adminRoutes from './routers/adminRoutes';
import {config} from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { v2 as cloudinary } from 'cloudinary'
import fileUpload from 'express-fileupload';

config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

import connectDB from './DB/connection/connection'
connectDB();

const port: number | string = process.env.PORT || 3000;

const app: Application = express();

app.use(fileUpload({
    useTempFiles:true,    
    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  
app.use(express.json({ limit: "100mb" }));
app.use(
express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 })
);

app.use(
    cors({
        origin: 'http://localhost:4200'
    })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);
app.use('/admin/api', adminRoutes);

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});