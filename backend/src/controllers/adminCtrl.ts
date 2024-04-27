import { Request, Response } from "express";
import User from "../interfaces/UserInterface";
import adminHelper from "../DatabaseHelper/adminHelper";
import {v2 as cloudinary} from 'cloudinary'
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken'

function generateJwtToken(email: string, type: string, secretKey: string) {
    const payload = { email, type };
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, secretKey, options);
}

export default {
    getAllUsers: async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: User[] | [] = await adminHelper.getAllUser();
            res.status(200).json({
                userData
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    getUserDetails: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: string = req.params.userId;
            if(!userId) return;
            const userData: User | null = await adminHelper.getUserData(userId);
            
            if(!userData)return;
            res.status(200).json({
                userData
            });
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    updateUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: string = req.params.userId;
            // checking wheather the email is already taken by other user
            const emailTaken: boolean = await adminHelper.isEmailTaken(userId, req.body.email);
            

            if(emailTaken){
                res.status(401).json({
                    message: 'Email already taken',
                    errOpt: 'emailTaken',
                    err: 'email'
                });
                return;
            }

            // makeing the data obj for updateing the userData
            const updateData: User = {
                name: req.body.name,
                email: req.body.email
            }

            // if profileImg provided
            if(req.body.profileImg){
                const uploadResponse = await cloudinary.uploader.upload(req.body.profileImg, {
                    resource_type: 'auto'
                });
                updateData.profileImg = uploadResponse.secure_url;
            }

            // if new password is provided
            if(req.body.password){
                const hashedPass: string = bcrypt.hashSync(req.body.password, 10);
                updateData.password = hashedPass;
            }

            // for updating data in the db
            await adminHelper.updateUserData(userId, updateData);

            res.status(200).json({
                message: 'User Updated successfuly'
            });
        } catch (err: any) {
            console.error(err, 'update user');
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    deleteUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: string = req.params.userId;
            await adminHelper.deleteUserData(userId);
            res.status(200).json({
                message: 'User Deleted Successfuly'
            });
        } catch (err: any) {
            console.error(err, 'delete user');
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    addUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const emailTaken: boolean = await adminHelper.isEmailTaken(null, req.body.email);
            

            if(emailTaken){
                res.status(401).json({
                    message: 'Email already taken',
                    errOpt: 'emailTaken',
                    err: 'email'
                });
                return;
            }

            const userData: User = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            }

            // if profileImg provided
            if(req.body.profileImg){
                const uploadResponse = await cloudinary.uploader.upload(req.body.profileImg, {
                    resource_type: 'auto'
                });
                userData.profileImg = uploadResponse.secure_url;
            }

            await adminHelper.createUser(userData);

            res.status(200).json({
                message: 'New User Added Successfuly'
            });
        } catch (err: any) {
            console.error(err, 'add user');
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    login: async(req: Request, res: Response): Promise<void> => {
        try {
            const adminEmail: string = process.env.ADMIN_EMAIL!;
            const adminPassword: string = process.env.ADMIN_PASSWORD!;

            if(adminEmail !== req.body.email) {
                res.status(401).json({
                    message: 'No admin with that email',
                    err: 'email',
                    errOpt: 'notExist'
                });
                return;
            }

            if(adminPassword !== req.body.password){
                res.status(401).json({
                    message: 'Invalid crendential',
                    err: 'password',
                    errOpt: 'infoErr'
                });
                return;
            }

            const token: string = generateJwtToken(adminEmail, 'Admin', process.env.JWTSecrectKey!);

            res.status(200).json({
                message: 'Successfuly Logged in',
                token
            });
        } catch (err: any) {
            console.error(err, 'login admin');
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    verifyAdmin: async (req: Request, res: Response): Promise<void> => {
        try {
            const token: string = req.header('Authorization')!;
            const decoded = jwt.verify(token, process.env.JWTSecrectKey!) as JwtPayload;
            if(decoded.type !== 'Admin'){
                res.status(401).json({
                    message: "Invalid token",
                    invalidToken: true
                });
                return;
            }
            res.status(200).json({
                message: "Valid token",
                invalidToken: false
            });
        } catch (err:any) {
            console.error(err);
            res.status(401).json({
                message: "Invalid token",
                invalidToken: true
            });
        }
    },
}