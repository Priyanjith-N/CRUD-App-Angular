import { Request, Response } from "express";
import User from "../interfaces/UserInterface";
import userHelper from "../DatabaseHelper/userHelper";
import Userdb from "../DB/models/userModel";
import jwt, { JwtPayload, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import AuthUserReq from "../interfaces/AuthUserReqInterface";
import {v2 as cloudinary} from 'cloudinary'

function generateJwtToken(userId: string, email: string, type: string, secretKey: string) {
    const payload = { userId, email, type };
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, secretKey, options);
}
  

export default {
    loginUser: async (req: Request, res: Response) => {
        console.log(req.body);
        
        const user: User | null = await userHelper.isUserExists(req.body.email);

        if(!user) {
            return res.status(401).json({
                message: 'No User Found With That Email',
                err: 'email',
                errOpt: 'notExist'
            });
        }

        if(!bcrypt.compareSync(req.body.password, user.password!)){
            return res.status(401).json({
                message: 'Invalid Credentials',
                err: 'password',
                errOpt: 'invalidPass'
            });
        }

        const token: string = generateJwtToken(user._id!.toString(), user.email, "User", process.env.JWTSecrectKey!);
        const data: User = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImg: user.profileImg
        }
        return res.status(200).json({
            message: 'Login Successful',
            userData: data,
            token

        });
    },
    createUser: async (req: Request, res: Response): Promise<void> => {
        //For retriving user data with email 
        const isExits: User | null = await userHelper.isUserExists(req.body.email);

        if(isExits){
            //if user exits with a emial that's already taken pass error
            res.status(401).json({
                message: `Email already taken`,
                err: true,
                errOpt: 'isExist'
            });
            return;
        }

        //For saving user data make user register
        const userData = await userHelper.createUser(req.body);

        //jwt token for auth purpose with payload email userId type
        const token: string = generateJwtToken(userData._id.toString(), userData.email, "User", process.env.JWTSecrectKey!);
        res.status(200).json({
            message: `Account Successfuly Created`,
            token
        });
    },
    verifyUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const token: string = req.header('Authorization')!;
            const decoded = jwt.verify(token, process.env.JWTSecrectKey!) as JwtPayload;
            if(decoded.type !== 'User'){
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
    getUser: async(req: AuthUserReq, res: Response) => {
        const { userId } = req;

        try {
            const userData: User = await userHelper.getUser(userId!);
            res.status(200).json({
                userData
            });
        } catch (err: any) {
            res.status(401).json({
                message: err.message,
                invalid: true
            })
        }
    },
    updateUser: async(req: AuthUserReq, res: Response) => {
        const { userId } = req;

        try {
            //For retriving user data with email 
            const isExits: User | null = await userHelper.isUserExists(req.body.email);

            if(isExits && (isExits._id!.toString() !== userId)){
                //if user exits with a emial that's already taken pass error
                res.status(401).json({
                    message: `Email already taken`,
                    err: 'email',
                    errOpt: 'isExist'
                });
                return;
            }

            const newUserData: User = {
                name: req.body.name,
                email: req.body.email,
            }

            if(req.body.currentPass){
                const currentUser: User = await userHelper.getUserById(userId!);
                if(!bcrypt.compareSync(req.body.currentPass, currentUser.password!)){
                    res.status(401).json({
                        message: 'Current Password Is Worng',
                        err: 'currentPass',
                        errOpt: 'passErr'
                    });
                    return;
                }

                const hashedPass: string = bcrypt.hashSync(req.body.newPass, 10);
                
                newUserData.password = hashedPass;
            }

            // if profileImg provided
            if(req.body.profileImg){
                const uploadResponse = await cloudinary.uploader.upload(req.body.profileImg, {
                    resource_type: 'auto'
                });
                newUserData.profileImg = uploadResponse.secure_url;
            }

            await userHelper.updateUserData(userId!, newUserData);

            res.status(200).json({
                message: 'User Updated Successfuly',
            });
        } catch (err: any) {
            res.status(500).json({
                message: 'Internal Server Error'
            })
        }
    }
}