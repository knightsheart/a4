const express = require('express');
const cors = require('cors');
const database = require('./database.js');
const app = express();
const oracledb = require('oracledb');

//Middle ware
app.use(express.json());
app.use(cors());

database.initialize();

app.get('/messages', (req, res) => {
  res.send("Hello, world");
})

app.get('/title', (req, res) => {
  res.status(200).send({
    job_id: 'AC_ACCOUNT',
    job_title: 'Public Accountant'
  })
})

app.get('/title/:id', async (req, res) => {
  const job_id = req.params.id;
  console.log(job_id);
  if (!job_id){
    res.send({message: "We need an id."})
  }
  else{
    try {
      const conn = await database.getConnection();
      const result = await conn.execute(
          `BEGIN :title := get_job(:id); END;`,
          {
              id: job_id,
              title: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
            }
          );
          res.json({ id: job_id, title: result.outBinds.title }).status(200);
      } catch (error) {
          console.error('Cant get job title:', error.message);
          res.json({ error: error.message });
      }
  }
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(` Server running on port 3000`);
});