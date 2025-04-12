const express = require('express');
const { getConnection } = require('../database');
const router = express.Router();

//Middle ware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

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
            `BEGIN Employee_hire_sp(:first_name, :last_name, :email, :salary, :hire_date, :phone, :job_id, :manager_id, :department_id); END;`
            `BEGIN employee_hire_sp(:dept_id, :salary); END;`,
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

module.exports = router;
