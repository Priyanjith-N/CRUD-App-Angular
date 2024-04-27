import mongodb from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const con = await mongodb.connect(process.env.MONGO_URL!);

        console.log(`Server connected to host ${con.connection.host}`);
    } catch (err: any) {
        console.error(err);
        process.exit(1);
    }
}

export default connectDB;