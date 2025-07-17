import express from 'express';
import { createTask, getAllTasks, updateTask, deleteTask, smartAssign, getTaskById } from '../controllers/taskController.js';
import { auth } from '../middlewares/auth.js';
import { getLogs } from '../controllers/taskController.js';

const router = express.Router();

router.post('/create-task', auth, createTask);
router.get('/', auth, getAllTasks);
router.put('/update-task/:id', auth, updateTask);
router.delete('/delete-task/:id', auth, deleteTask);
router.post('/smart-assign/:id', auth, smartAssign);
router.get('/logs/recent', auth, getLogs);
router.get('/:id', auth, getTaskById);

export default router;