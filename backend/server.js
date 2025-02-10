// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for all origins (adjust for production if needed)
app.use(express.json()); // Parse JSON bodies

// --- In-Memory Data (for demo purposes) ---
let users = [
  { id: 1, email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: 2, email: 'teacher@example.com', password: 'teacher123', role: 'teacher' },
];

let teachers = [
  { id: 1, name: 'John Doe', email: 'johndoe@example.com', subject: 'Math', phone: '+123456789' },
  { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', subject: 'English', phone: '+987654321' },
];

// --- API Endpoints ---

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    // In production, generate and return a secure token.
    res.json({ success: true, user: { email: user.email, role: user.role } });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

// POST /api/reset-password
app.post('/api/reset-password', (req, res) => {
  const { email } = req.body;
  // In production, send a reset link via email.
  res.json({
    success: true,
    message: 'If this email exists in our system, a reset link has been sent.',
  });
});

// GET /api/teachers - Return list of teachers
app.get('/api/teachers', (req, res) => {
  res.json({ success: true, teachers });
});

// POST /api/teachers - Add a new teacher
app.post('/api/teachers', (req, res) => {
  const { name, email, subject, phone } = req.body;
  if (!name || !email || !subject || !phone) {
    return res.json({ success: false, message: 'Missing required fields' });
  }
  const newTeacher = {
    id: teachers.length + 1,
    name,
    email,
    subject,
    phone,
  };
  teachers.push(newTeacher);
  res.json({ success: true, teacher: newTeacher });
});

// DELETE /api/teachers?email=<teacher-email>
app.delete('/api/teachers', (req, res) => {
  const email = req.query.email;
  const index = teachers.findIndex((t) => t.email === email);
  if (index !== -1) {
    teachers.splice(index, 1);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Teacher not found' });
  }
});

// Additional endpoints (students, fees, etc.) would be defined similarly.

// --- Start the Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
