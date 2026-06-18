const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb+srv://ikoshdev_db_user:Islomov121@cluster0.i6iksbe.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoURI)
.then(() => console.log('✅ Connected to MongoDB successfully!'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Define Mongoose Schema for Contact Messages
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// API Route to handle contact form submissions
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: 'Name, email and message are required' });
        }

        const newMessage = new Message({ name, email, subject, message });
        await newMessage.save();

        res.status(201).json({ success: true, message: 'Message saved successfully!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle all other routes by sending the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Portfolio server is running on port ${port}`);
});