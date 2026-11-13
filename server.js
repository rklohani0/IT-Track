/**
 * ╔══════════════════════════════════════════════╗
 * ║   IT TRACK — Computer Center Web Server     ║
 * ║   Node.js + Express Server                  ║
 * ║   Run: node server.js                       ║
 * ║   Visit: http://localhost:3000              ║
 * ╚══════════════════════════════════════════════╝
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// API Routes

// GET — Course list
app.get('/api/courses', (req, res) => {
    const courses = [
        { id: 1,  name: 'CIT',                fullName: 'Certificate in Information Technology',    duration: '6 Months', level: 'Beginner',     icon: 'fas fa-desktop' },
        { id: 2,  name: 'DIT',                fullName: 'Diploma in Information Technology',        duration: '1 Year',   level: 'Intermediate', icon: 'fas fa-award' },
        { id: 3,  name: 'Agentic AI',         fullName: 'Autonomous AI Agents Development',        duration: '4 Months', level: 'Advanced',     icon: 'fas fa-robot' },
        { id: 4,  name: 'MS Office',          fullName: 'Microsoft Office Complete Suite',          duration: '3 Months', level: 'Beginner',     icon: 'fab fa-microsoft' },
        { id: 5,  name: 'Python',             fullName: 'Python Programming Mastery',               duration: '4 Months', level: 'All Levels',   icon: 'fab fa-python' },
        { id: 6,  name: 'Dart',               fullName: 'Dart & Flutter App Development',           duration: '5 Months', level: 'Intermediate', icon: 'fas fa-mobile-alt' },
        { id: 7,  name: 'AI',                 fullName: 'Artificial Intelligence & Machine Learning',duration: '6 Months', level: 'Advanced',    icon: 'fas fa-brain' },
        { id: 8,  name: 'YouTube Automation', fullName: 'YouTube Channel Automation & Growth',      duration: '3 Months', level: 'All Levels',   icon: 'fab fa-youtube' },
        { id: 9,  name: 'Prompt Engineering', fullName: 'AI Prompt Design & Engineering',           duration: '2 Months', level: 'Beginner',     icon: 'fas fa-terminal' },
        { id: 10, name: 'CSS + JavaScript',   fullName: 'Frontend Web Development',                 duration: '4 Months', level: 'Intermediate', icon: 'fab fa-js-square' },
    ];
    res.json({ status: 'success', courses });
});

// POST — Contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, phone, course, message } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            status: 'error',
            message: 'Name and email are required.'
        });
    }

    // Log the contact
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${name} | ${email} | ${phone || 'N/A'} | ${course || 'N/A'} | ${message || 'No message'}\n`;

    fs.appendFileSync(path.join(__dirname, 'contacts.log'), logEntry, 'utf-8');

    console.log(`  ✉  New contact: ${name} (${email}) — ${course || 'General inquiry'}`);

    res.json({
        status: 'success',
        message: `Thank you ${name}! We will contact you soon about ${course || 'your inquiry'}.`
    });
});

// GET — Stats
app.get('/api/stats', (req, res) => {
    res.json({
        courses: 10,
        students: '500+',
        successRate: '95%',
        instructors: 15
    });
});

// Fallback — Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log();
    console.log('  ╔══════════════════════════════════════════════╗');
    console.log('  ║                                              ║');
    console.log('  ║       🚀  IT TRACK — Computer Center         ║');
    console.log('  ║          Node.js Server Running              ║');
    console.log('  ║                                              ║');
    console.log(`  ║    🌐  http://localhost:${PORT}                  ║`);
    console.log('  ║                                              ║');
    console.log('  ║    Press Ctrl+C to stop                      ║');
    console.log('  ║                                              ║');
    console.log('  ╚══════════════════════════════════════════════╝');
    console.log();
});
