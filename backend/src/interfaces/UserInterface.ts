import mongoose from "mongoose";

export default interface User {
    _id?: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    profileImg?: string;
}