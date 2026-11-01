const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sprintRoutes = require('./routes/sprintRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Dev Sprint Backend Running' });
});

app.use('/api/sprint', sprintRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});