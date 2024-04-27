import mongodb from 'mongoose';
import bcrypt from 'bcrypt';

import User from '../../interfaces/UserInterface';

const UserSchema = new mongodb.Schema<User>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: ''
    }
});


UserSchema.pre('save',function (next) {
    const user = this;
    
    if (!user.isModified('password')) return next();

    try {
        const salt = 10;
        const hash = bcrypt.hashSync(user.password, salt);

        user.password = hash;
        next();
    } catch (error: any) {
        next(error);
    }
});

const Userdb = mongodb.model<User>('Userdbs', UserSchema);

export default Userdb;