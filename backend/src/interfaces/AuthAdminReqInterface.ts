import { Request } from "express";

export default interface AuthAdminReq extends Request {
    email?: string;
}