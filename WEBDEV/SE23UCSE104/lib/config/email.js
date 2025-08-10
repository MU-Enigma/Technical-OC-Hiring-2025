import mongoose from "mongoose";

const ConnectmongoDB = async () => {
  await mongoose.connect("mongodb+srv://vercel-admin-user-68824c6d5fa6f5690c476720:E09gfB14eR8owDoe@cluster0.xrkzxj0.mongodb.net/karthikDatabase?retryWrites=true&w=majority")
};

export default ConnectmongoDB;
