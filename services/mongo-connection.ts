import mongoose from 'mongoose'
import { db } from '../config/db'

async function connectDB() {
  mongoose.connect(db, { connectTimeoutMS: 1000000 })

  const conn = mongoose.connection

  conn.on('error', () => console.error.bind(console, 'connection error'))
  conn.once('open', () => console.log('Connection to Database is successful'))
}

export default connectDB
