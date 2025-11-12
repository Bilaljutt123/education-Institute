// routes/auth.js

import express from 'express';
import { login, register } from '../controllers/authController.js';
const router = express.Router();
// import { register, login } from '../controllers/authController.js'; // Import named exports

router.post('/register', register);
router.post('/login', login);

export default router; // Use export default