import { createUser, authenticateUser } from '../services/user.service.js';
import User from '../models/User.js';

// GET /users/list
export const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error listing users' });
  }
};

// POST /user/register
export const register = async (req, res) => {
  console.log("Registering user:", req.body);

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required' });
  }

  const validRoles = ['client', 'artisan'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Role must be either client or artisan' });
  }

  // Validação de formato de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validação de tamanho de senha
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const user = await createUser({ name, email, password, role });
    console.log("Saved user:", user.email);
    return res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

// POST /user/login
export const login = async (req, res) => {
  console.log("Logging in user:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const { token, name, role } = await authenticateUser({ email, password });
    console.log("User logged in successfully:", email);
    return res.status(200).json({ message: 'Login successful', token, name, role });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    return res.status(400).json({ message: error.message });
  }
};
