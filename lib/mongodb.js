// lib/mongodb.js
console.log("Inside mongodb.js");
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function connectToDatabase() {
  try {
    if (!client.isConnected()) await client.connect();
    console.log("Successfully connected to MongoDB");
    const db = client.db("Disney-Snacks");
    return { db, client };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Re-throw the error to propagate it
  }
}
