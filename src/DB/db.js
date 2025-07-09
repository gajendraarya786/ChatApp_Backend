import mongoose from 'mongoose'

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log(`MONGODb connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Mongo Db connection failed", error);
    }
}
export default connectDb;
