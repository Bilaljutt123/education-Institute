// server.js (updated)

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js'; // <-- Import user routes
import applicationRoutes from './routes/application.js';
import courseRoutes from './routes/course.js';


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // <-- Mount user routes
app.use('/api/applications', applicationRoutes); 
app.use('/api/courses', courseRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));