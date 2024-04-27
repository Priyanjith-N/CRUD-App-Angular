import Userdb from "../DB/models/userModel";
import User from "../interfaces/UserInterface";

export default {
    isUserExists: async(email: string) => {
        return await Userdb.findOne({email}); 
    },
    createUser: async(data: User) => {
        const userData = new Userdb(data);
        await userData.save();
        return userData;
    },
    getUser: async(userId: string) => {
        const userData = await Userdb.findOne({_id: userId}, {password: 0});
        try {
            if(!userData){
                throw new Error('User Not Found');
            }

            return userData;
        } catch (err: any) {
            throw err;
        }
    },
    getUserById: async(userId: string) => {
        try {
            const userData = await Userdb.findOne({_id: userId});
            if(!userData){
                throw new Error('User Not Found');
            }

            return userData;
        } catch (err: any) {
            throw err;
        }
    },
    updateUserData: async(userId: string, newUserData: User): Promise<void> => {
        try {
            await Userdb.updateOne({_id: userId}, {$set: newUserData});
        } catch (err: any) {
            throw err;
        }
    }
}