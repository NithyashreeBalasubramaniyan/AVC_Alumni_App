// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const requestRoutes = require('./routes/requestRouter');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// mount
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/requests', requestRoutes);

app.get('/health', (req,res) => res.json({ success: true, ts: new Date().toISOString() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
