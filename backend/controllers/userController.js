const { User } = require('../models');
const bcrypt = require('bcrypt');

// 🔹 Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🔹 Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

// 🔹 Get user by ID
exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// 🔹 Update user
exports.updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, email, role } = req.body;
  await user.update({ name, email, role });
  res.json(user);
};

// 🔹 Delete user
exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.destroy();
  res.json({ message: 'User deleted' });
};
