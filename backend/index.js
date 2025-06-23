require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const moduleRoutes = require('./routes/moduleRoutes');
app.use('/api/modules', moduleRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const noteRoutes = require('./routes/noteRoutes');
app.use('/api/notes', noteRoutes);

const classeRoutes = require('./routes/classeRoutes');
app.use('/api/classes', classeRoutes);

const emploiRoutes = require('./routes/emploiDuTempsRoutes');
app.use('/api/emplois', emploiRoutes);






// const schoolRoutes = require('./routes/school');
// app.use('/api/school', schoolRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
