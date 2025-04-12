const express = require('express');
const { getConnection } = require('../database');
var bodyParser = require('body-parser');
const oracledb = require('oracledb')
const router = express.Router();


//Middle ware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

// GET job title by job ID
router.get('/job-description/:id', async (req, res) => {
    try {
        const conn = await getConnection();
        const result = await conn.execute(
            `BEGIN :title := get_job(:id); END;`,
            {
                id: req.params.id,
                title: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
            }
        );
        res.json({ jobTitle: result.outBinds.title });
    } catch (error) {
        console.error('Job Fetch Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST to create a new job
router.post('/create-job', async (req, res) => {
  if(req.body){
    const { jobId, jobTitle, minSalary, maxSalary } = req.body;
    try {
        const conn = await getConnection();
        await conn.execute(
            `BEGIN new_job(:p_job_id, :p_job_title, :p_min_salary, :p_max_salary); END;`,
            {
                p_job_id: jobId,
                p_job_title: jobTitle,
                p_min_salary: minSalary,
                p_max_salary: maxSalary
            },
            { autoCommit: true }
        );
        res.json({ message: '✅ Job created successfully' });
    } catch (error) {
        console.error('❌ Job Creation Error:', error.message);
        res.status(500).json({ error: error.message });
    }
  }
  else{
    res.status(400).send("No body data received");
  }
})

module.exports = router;
