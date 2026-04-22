import express from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db/connection.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
};

// POST /api/tasks/
router.post("/", async (req, res) => {
  try {
    const { name, desc, due, type = "work" } = req.body;
    const tasks = getCollection("tasks");

    const task = {
      userId: new ObjectId(req.user.userId),
      name: name,
      desc: desc,
      type,
      due: parseDate(due),
      done: false,
    };

    const result = await tasks.insertOne(task);
    res.status(201).json({ ...task, _id: result.insertedId });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/tasks/ — with pagination
router.get("/", async (req, res) => {
  try {
    const tasks = getCollection("tasks");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const userId = new ObjectId(req.user.userId);

    const [userTasks, totalCount] = await Promise.all([
      tasks
        .find({ userId })
        .sort({ done: 1, due: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      tasks.countDocuments({ userId }),
    ]);

    res.json({
      tasks: userTasks,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, due, done } = req.body;
    const tasks = getCollection("tasks");

    const update = {};
    if (name !== undefined) update.name = name;
    if (desc !== undefined) update.desc = desc;
    if (due !== undefined) update.due = parseDate(due);
    if (done !== undefined) update.done = done;

    const result = await tasks.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(req.user.userId) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = getCollection("tasks");

    const result = await tasks.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(req.user.userId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete tasks error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
