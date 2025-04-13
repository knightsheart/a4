const express = require('express');
const { getConnection } = require('../database');
var bodyParser = require('body-parser');
const oracledb = require('oracledb');
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
    try {
        const conn = await getConnection();
        const { jobId, jobTitle, minSalary, maxSalary } = req.body;
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
        console.log('Job created successfully');
    } catch (error) {
        console.error('Job creation Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// api for change job for the tables
router.get('/table', async (req, res) => {
  try{
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT job_id, job_title, min_salary, max_salary FROM hr_jobs`,
      [], 
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows)
  }
  catch(e){
    console.log(e);
  }
})

// change job
router.post('/change-job', async(req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const { jobId, jobTitle, minSalary, maxSalary } = req.body;
    
    const result = await conn.execute(
      `UPDATE hr_jobs
       SET job_title = :job_title,
           min_salary = :min_salary,
           max_salary = :max_salary
       WHERE job_id = :job_id`,
      {
        job_id: jobId,
        job_title: jobTitle,
        min_salary: minSalary,
        max_salary: maxSalary
      },
      { autoCommit: true }
    );

    res.json({ 
      success: result.rowsAffected > 0,
      rowsAffected: result.rowsAffected 
    });

  } catch(e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});
module.exports = router;
