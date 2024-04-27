import { Request } from "express";

export default interface AuthUserReq extends Request {
    userId?: string;
} 