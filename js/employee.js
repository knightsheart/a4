import express from 'express';
import { getConnection } from '../../db/database.js';

const router = express.Router();

// below done by sara
router.post('/api/employees', async (req, res) => {
    const { deptId, salary } = req.body;
    try {
        const conn = await getConnection();
        await conn.execute(
            `BEGIN employee_hire_sp(:dept_id, :salary); END;`,
            { dept_id: deptId, salary },
            { autoCommit: true }
        );
        res.json({ message: '✅ Employee hired successfully' });
    } catch (error) {
        console.error('❌ Hire Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
