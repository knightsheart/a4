const express = require('express');
const cors = require('cors');
const database = require('./database.js');
const app = express();
const employee = require('./routes/employee.js');
const job = require('./routes/job.js');

//Middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
database.initialize();

app.use('/api/job', job);
app.use('/api/employee', employee);

// Test route
app.get('/api/messages', (req, res) => {
  res.send("Hello, world");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(` Server running on port 3000`);
});