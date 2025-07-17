import { ActionLog } from "../models/actionLog.js"
import { io } from "../server.js"

export async function logAction({ action, message, taskId, userId, assignedTo }) {
  const log = await ActionLog.create({
    action,
    message,
    task: taskId,
    user: userId,
    assignedTo: assignedTo
  });

  const populatedLog = await ActionLog.findById(log._id)
    .populate("user", "username")
    .populate("task", "title")
    .populate("assignedTo", "username")

  io.emit("log:new", populatedLog)  // ✅ Always emit fully populated log
}
