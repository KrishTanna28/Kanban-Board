import { Task } from '../models/tasks.js';
import { User } from '../models/users.js';
import { io } from '../server.js';
import { ActionLog } from '../models/actionLog.js';
import { logAction } from '../utils/logAction.js';

// Create a new task
export async function createTask(req, res) {
    try {
        let { title, description, priority, status, assignedTo } = req.body;

        // Check for duplicate title (case-insensitive)
        const existing = await Task.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ message: 'Task title already exists' });
        }

        // If assignedTo is a string and not a valid ObjectId, treat as username
        if (assignedTo && typeof assignedTo === 'string' && assignedTo.length && !assignedTo.match(/^[0-9a-fA-F]{24}$/)) {
            const user = await User.findOne({ username: assignedTo });
            if (!user) {
                return res.status(400).json({ message: `User '${assignedTo}' not found` });
            }
            assignedTo = user._id;
        }

        const task = new Task({
            title,
            description,
            priority,
            status,
            assignedTo: assignedTo || undefined,
            createdBy: req.user._id
        });

        await task.save();
        const populatedTask = await Task.findById(task._id).populate('assignedTo', 'username email');
        io.emit('task:created', populatedTask);
        await logAction({
            action: 'CREATE',
            message: `Task "${task.title}" created.`,
            taskId: task._id,
            userId: req.user._id,
            assignedTo: task.assignedTo
        });
        return res.status(201).json(populatedTask);
    } catch (err) {
        console.error('Error creating task:', err);
        return res.status(500).json({ message: 'Error creating task' });
    }
}

// Get all tasks
export async function getAllTasks(req, res) {
    try {
        const tasks = await Task.find().populate('assignedTo', 'username email');
        return res.status(200).json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        return res.status(500).json({ message: 'Error fetching tasks' });
    }
}

// Update a task
export async function updateTask(req, res) {
    try {
        const taskId = req.params.id;
        const { clientUpdatedAt, force, ...updates } = req.body;

        // If assignedTo is a string and not a valid ObjectId, treat as username
        if (updates.assignedTo && typeof updates.assignedTo === 'string' && updates.assignedTo.length && !updates.assignedTo.match(/^[0-9a-fA-F]{24}$/)) {
            const user = await User.findOne({ username: updates.assignedTo });
            if (!user) {
                return res.status(400).json({ message: `User '${updates.assignedTo}' not found` });
            }
            updates.assignedTo = user._id;
        }

        const taskInDb = await Task.findById(taskId);
        if (!taskInDb) return res.status(404).json({ message: 'Task not found' });

        // Conflict check (skip if force=true)
        if (!force && clientUpdatedAt && new Date(clientUpdatedAt).getTime() !== new Date(taskInDb.updatedAt).getTime()) {
            return res.status(409).json({
                message: 'Conflict detected',
                clientVersion: updates,
                latestVersion: taskInDb
            });
        }

        const oldStatus = taskInDb.status;
        const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true }).populate('assignedTo', 'username email');
        io.emit('task:updated', updatedTask);

        // Determine what changed
        const statusChanged = typeof updates.status !== 'undefined' && updates.status !== oldStatus;
        const otherFieldsChanged = Object.keys(updates).some(
            key => key !== 'status' && updates[key] !== undefined && updates[key] !== taskInDb[key]
        );

        // Log only STATUS_CHANGE if status changed, otherwise log UPDATE if other fields changed
        if (statusChanged) {
            await logAction({
                action: 'STATUS_CHANGE',
                message: `Task "${updatedTask.title}" status changed from ${oldStatus} to ${updates.status}.`,
                taskId: updatedTask._id,
                userId: req.user._id
            });
        } else if (otherFieldsChanged) {
            await logAction({
                action: 'UPDATE',
                message: force
                    ? `Task "${updatedTask.title}" force-overwritten by ${req.user.username}.`
                    : `Task "${updatedTask.title}" updated.`,
                taskId: updatedTask._id,
                userId: req.user._id
            });
        } else {
            await logAction({
                action: 'UPDATE',
                message: `Task "${updatedTask.title}" updated (no significant field changed).`,
                taskId: updatedTask._id,
                userId: req.user._id
            });
        }

        return res.status(200).json(updatedTask);
    } catch (err) {
        console.error('Error updating task:', err);
        return res.status(500).json({ message: 'Error updating task' });
    }
}


// Delete a task
export async function deleteTask(req, res) {
    try {
        const taskId = req.params.id;

        const task = await Task.findByIdAndDelete(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        io.emit('task:deleted', taskId);
        await logAction({
            action: 'DELETE',
            message: `Task "${task.title}" smart-assigned to ${task.assignedTo.username}.`,
            taskId: task._id,
            userId: req.user._id
        });
        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        return res.status(500).json({ message: 'Error deleting task' });
    }
}

export async function smartAssign(req, res) {
    try {
        const taskId = req.params.id;

        // Step 1: Get all users
        const users = await User.find({ _id: { $ne: req.user._id } });

        // Step 2: Count active tasks for each user
        const counts = await Promise.all(users.map(async (user) => {
            const count = await Task.countDocuments({
                assignedTo: user._id,
                status: { $ne: 'Done' }
            });
            return { user, count };
        }));

        // Step 3: Find the user with the fewest active tasks
        const leastBusy = counts.reduce((min, current) =>
            current.count < min.count ? current : min
        );

        // Step 4: Assign task to them
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { assignedTo: leastBusy.user._id },
            { new: true }
        ).populate('assignedTo', 'username email');

        // Step 5: Emit event
        io.emit('task:updated', updatedTask);
        await logAction({
            action: 'ASSIGN',
            message: `Task "${updatedTask.title}" smart-assigned to ${updatedTask.assignedTo.username}.`,
            taskId: updatedTask._id,
            userId: req.user._id,
            assignedTo: leastBusy.user._id
        });
        return res.status(200).json(updatedTask);
    } catch (err) {
        console.error('Smart Assign Error:', err);
        return res.status(500).json({ message: 'Error assigning task smartly' });
    }
}

export async function getLogs(req, res) {
    try {
        const logs = await ActionLog.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('user', 'username')
            .populate('task', 'title')
            .populate('assignedTo', 'username');
        return res.status(200).json(logs);
    } catch (err) {
        console.error('Error fetching logs:', err);
        return res.status(500).json({ message: 'Error fetching activity logs' });
    }
}

export async function getTaskById(req, res) {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId).populate('assignedTo', 'username email');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        return res.status(200).json(task);
    } catch (err) {
        console.error('Error fetching task:', err);
        return res.status(500).json({ message: 'Error fetching task' });
    }
}