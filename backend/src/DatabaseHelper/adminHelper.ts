import Userdb from "../DB/models/userModel";
import User from "../interfaces/UserInterface";

export default {
    getAllUser: async(): Promise<User[] | []> => {
        try {
            return await Userdb.find({}, {password: 0});
        } catch (err: any) {
            throw err;
        }
    },
    getUserData: async(userId: string): Promise<User | null> => {
        try {
            return await Userdb.findOne({_id: userId}, {password: 0});
        } catch (err: any) {
            throw err;
        }
    },
    isEmailTaken: async(userId: string | null, email: string): Promise<boolean> => {
        try {
            if(!userId){
                const exists = await Userdb.findOne({email});
                return exists?true:false;
            }
            const exists = await Userdb.find({email, _id: {$ne: userId}});
            return (exists.length !== 0);
        } catch (err: any) {
            throw err;
        }
    },
    updateUserData: async(userId: string, newData: User): Promise<void> => {
        try {
            await Userdb.updateOne({_id: userId}, {$set: newData});
        } catch (err: any) {
            throw err;
        }
    },
    deleteUserData: async(userId: string): Promise<void> => {
        try {
            await Userdb.deleteOne({_id: userId});
        } catch (err: any) {
            throw err;
        }
    },
    createUser: async(userData: User): Promise<void> => {
        try {
            const newUser = new Userdb(userData);
            await newUser.save();
        } catch (err: any) {
            throw err;
        }
    }
}