import { connectToDatabase } from "@/lib/mongodb";

export async function ensureDatabaseConnection() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.warn("Database connection failed, falling back to mock data.", error.message);
  }
}
