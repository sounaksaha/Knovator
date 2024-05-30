const mongoose = require("mongoose");

const password = encodeURIComponent('Sounak@saha1');
const connectionString = `mongodb+srv://Sounak:${password}@cluster0.aoxels1.mongodb.net/Knovator`;

const connectDb = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`Connected to MongoDB at host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
  }
};

module.exports = connectDb;
