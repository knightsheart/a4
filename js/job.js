import express from 'express';
import { getConnection } from '../../db/database.js';
import oracledb from 'oracledb';

const router = express.Router();

// GET job title by job ID
router.get('/api/job-description/:id', async (req, res) => {
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
router.post('/api/create-job', async (req, res) => {
    const { jobId, jobTitle, minSalary, maxSalary } = req.body;

    try {
        const conn = await getConnection();
        await conn.execute(
            `BEGIN new_job(:job_id, :title, :min_sal, :max_sal); END;`,
            {
                job_id: jobId,
                title: jobTitle,
                min_sal: minSalary,
                max_sal: maxSalary
            },
            { autoCommit: true }
        );
        res.json({ message: '✅ Job created successfully' });
    } catch (error) {
        console.error('❌ Job Creation Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
