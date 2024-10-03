// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI!;

// if (!MONGODB_URI) {
//   throw new Error(
//     'Please define the MONGODB_URI environment variable inside .env.local'
//   );
// }

// async function dbConnect() {
//   if (mongoose.connection.readyState >= 1) {
//     return;
//   }

//   try {
//     await mongoose.connect(MONGODB_URI);
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Failed to connect to MongoDB:', error);
//     throw new Error('Unable to connect to the database');
//   }
// }

// export default dbConnect;
