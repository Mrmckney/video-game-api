import { MongoClient } from 'mongodb'
import 'dotenv/config'

export default function dbConnect() {
    const client = new MongoClient(process.env.DB_CONNECTION);
    client.connect();
    return client.db("Game-Retriever");
}