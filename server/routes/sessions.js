import express from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db/connection.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

// POST /api/sessions — Create session
router.post("/", async (req, res) => {
  try {
    const { duration, label, type } = req.body;
    const sessions = getCollection("sessions");

    const session = {
      userId: new ObjectId(req.user.userId),
      duration,
      label: label || "Focus Session",
      type: type || "work",
      completedAt: new Date(),
    };

    const result = await sessions.insertOne(session);
    res.status(201).json({ ...session, _id: result.insertedId });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/sessions — Get user sessions with pagination
router.get("/", async (req, res) => {
  try {
    const sessions = getCollection("sessions");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const userId = new ObjectId(req.user.userId);

    const [userSessions, totalCount] = await Promise.all([
      sessions
        .find({ userId })
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      sessions.countDocuments({ userId }),
    ]);

    res.json({
      sessions: userSessions,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/sessions/stats — Get streaks and stats
router.get("/stats", async (req, res) => {
  try {
    const sessions = getCollection("sessions");
    const userId = new ObjectId(req.user.userId);

    const userSessions = await sessions
      .find({ userId })
      .sort({ completedAt: -1 })
      .toArray();

    const totalSessions = userSessions.length;
    const totalMinutes = userSessions.reduce((sum, s) => sum + s.duration, 0);

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionDates = [
      ...new Set(
        userSessions.map((s) => {
          const d = new Date(s.completedAt);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      ),
    ].sort((a, b) => b - a);

    for (let i = 0; i < sessionDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (sessionDates[i] === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    res.json({
      totalSessions,
      totalMinutes,
      streak,
      averagePerDay:
        totalSessions > 0
          ? Math.round(totalMinutes / Math.max(sessionDates.length, 1))
          : 0,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/sessions/:id — Update session
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { duration, label, type } = req.body;
    const sessions = getCollection("sessions");

    const result = await sessions.findOneAndUpdate(
      { _id: new ObjectId(id), userId: new ObjectId(req.user.userId) },
      { $set: { duration, label, type, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Update session error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/sessions/:id — Delete session
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sessions = getCollection("sessions");

    const result = await sessions.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(req.user.userId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ message: "Session deleted" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
