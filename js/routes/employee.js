const express = require('express');
const { getConnection } = require('../database');
const router = express.Router();
const oracledb = require('oracledb');

//Middle ware
router.use(express.json());
router.use(express.urlencoded({extended: true}));


// api for update employee for the table
router.get('/table', async (req, res) => {
  try{
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT employee_id, salary, phone_number, email FROM hr_employees`,
      [], 
      { outFormat: oracledb.OUT_FORMAT_OBJECT } 
    );
    res.json(result.rows)
  }
  catch(e){
    console.log(e);
  }
})

router.post('/update-employee', async(req, res) => {
  try{
    const conn = await getConnection();
    const { employeeId, salary, email, phone } = req.body;
    console.log(req.body);
    await conn.execute(
      `UPDATE hr_employees
       SET salary = :salary,
           phone_number = :phone_number,
           email = :email
       WHERE employee_id = :employee_id
      `,
      {
        employee_id: employeeId,
        salary: salary,
        phone_number: phone,
        email: email
      },
      {autoCommit: true}
    );
    console.log("Employee sucessfully updated.");
  }
  catch(e){
    console.error(e);
  }
});

// below done by sara
router.post('/hire-employee', async (req, res) => {
    const { 
      firstName,
       lastName,
       email,
       salary,
       hireDate,
       phone,
       jobId,
       managerId,
       departmentId
    } = req.body;

    try {
        const conn = await getConnection();
        await conn.execute(
            `BEGIN Employee_hire_sp(:first_name, :last_name, :email, :salary, :hire_date, :phone, :job_id, :manager_id, :department_id); END;`,
            { first_name: firstName,
              last_name: lastName,
              email: email,
              salary: salary,
              hire_date: hireDate,
              phone: phone,
              job_id: jobId,
              manager_id: managerId,
              department_id: departmentId
            },
            { autoCommit: true }
        );
        res.json({ message: '✅ Employee hired successfully' });
    } catch (error) {
        console.error('❌ Hire Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});


// all ids
router.get('/id/job', async (req, res) => {
  const conn = await getConnection();
  const result = await conn.execute('SELECT job_id FROM hr_jobs');
  res.json(result.rows);
});

router.get('/id/manager', async (req, res) => {
  const conn = await getConnection();
  const result = await conn.execute('SELECT manager_id FROM hr_employees');
  res.json(result.rows);
});

router.get('/id/department', async (req, res) => {
  const conn = await getConnection();
  const result = await conn.execute('SELECT department_id FROM hr_employees');
  res.json(result.rows);
});
module.exports = router;
