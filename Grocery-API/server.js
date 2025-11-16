import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

import connectDB from './db/dbConfig.js';
connectDB();

import groceryRoutes from './routes/routes.js';

app.use(express.json());

app.use('/api/groceries', groceryRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});