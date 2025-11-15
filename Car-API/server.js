import dotenv from 'dotenv';
import express from 'express';
import connectDb from './db/dbConfig.js';
import carRoutes from './routes/car-routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use('/api/cars' , carRoutes)

const startServer = async () => {
    try {
        await connectDb(); 
        app.listen(process.env.PORT, () => {
            console.log(`Server running at http://localhost:${process.env.PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to DB:", err);
        process.exit(1);
    }
};

startServer();
