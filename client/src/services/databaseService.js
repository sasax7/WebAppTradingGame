// services/databaseService.js
import { createClient } from "@libsql/client";

const client = createClient({
  url: "libsql://webapp-sasax7.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTQwMzU5MDUsImlkIjoiMjQ4ZjQyZWYtZjZkOS00ZjgwLTk2MjEtMDVmYzE3YTgxNGM2In0.VVCkl67OyXElA105A-0gUA5lwQgUDrlppN4XrU46-FIffIXBw4eSfC2IMdYcOh7XIpKRyEHQLpbf2WYrb2MEDg",
});

export async function executeQuery(sql, args = []) {
  try {
    const result = await client.execute({ sql, args });
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}


export async function fetchCandlestickData() {
  try {
    const result = await client.execute("SELECT * FROM candlesticks"); // Adjust SQL query as needed
    console.log("Candlestick data:", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error fetching candlestick data:", error);
    throw error;
  }
}