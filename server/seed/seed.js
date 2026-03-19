import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Configuration
const NUM_USERS = 5;
const SESSIONS_PER_USER = 120;
const TASKS_PER_USER = 100;

// Random helpers
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysAgo));
  date.setHours(randomInt(6, 22), randomInt(0, 59), 0, 0);
  return date;
};

const futureDate = (daysAhead) => {
  const date = new Date();
  date.setDate(date.getDate() + randomInt(1, daysAhead));
  date.setHours(randomInt(9, 18), 0, 0, 0);
  return date;
};

// Sample data
const sessionLabels = [
  "Deep work",
  "Study session",
  "Project work",
  "Reading",
  "Coding",
  "Writing",
  "Research",
  "Practice",
  "Homework",
  "Review",
  "Planning",
  "Design work",
  "Debugging",
  "Learning",
  "Documentation",
];

const taskNames = [
  "Complete assignment",
  "Review lecture notes",
  "Prepare presentation",
  "Write report",
  "Fix bug",
  "Update documentation",
  "Team meeting prep",
  "Research topic",
  "Code review",
  "Test feature",
  "Design mockup",
  "Client call prep",
  "Submit proposal",
  "Organize files",
  "Email follow-up",
  "Create slides",
  "Database cleanup",
  "API integration",
  "Write tests",
  "Refactor code",
];

const taskTypes = ["work", "school", "personal"];

const taskDescriptions = [
  "Need to finish this ASAP",
  "Important deadline coming up",
  "Should be straightforward",
  "Might need help with this",
  "Been putting this off",
  "Quick task",
  "This will take a while",
  "High priority item",
  "Can do this anytime",
  "Waiting on dependencies",
];

// Generate users
const generateUsers = async (count) => {
  const users = [];
  const hashedPassword = await bcrypt.hash("password123", 10);

  for (let i = 1; i <= count; i++) {
    users.push({
      _id: new ObjectId(),
      username: `testuser${i}`,
      email: `testuser${i}@example.com`,
      password: hashedPassword,
      createdAt: new Date(),
    });
  }
  return users;
};

// Generate sessions for a user
const generateSessions = (userId, count) => {
  const sessions = [];

  for (let i = 0; i < count; i++) {
    sessions.push({
      userId: userId,
      duration: randomElement([15, 20, 25, 30, 45, 60]),
      label: randomElement(sessionLabels),
      type: randomElement(["work", "break"]),
      completedAt: randomDate(30),
    });
  }
  return sessions;
};

// Generate tasks for a user
const generateTasks = (userId, count) => {
  const tasks = [];

  for (let i = 0; i < count; i++) {
    const isCompleted = Math.random() > 0.6;
    const isPastDue = Math.random() > 0.7;

    tasks.push({
      userId: userId,
      name: `${randomElement(taskNames)} #${i + 1}`,
      desc: randomElement(taskDescriptions),
      type: randomElement(taskTypes),
      due: isPastDue ? randomDate(14) : futureDate(14),
      done: isCompleted,
      createdAt: randomDate(30),
    });
  }
  return tasks;
};

// Main seed function
const seed = async () => {
  console.log("Connecting to MongoDB...");

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("focusflow");

    // Clear existing data
    console.log("Clearing existing data...");
    await db.collection("users").deleteMany({});
    await db.collection("sessions").deleteMany({});
    await db.collection("tasks").deleteMany({});

    // Generate and insert users
    console.log(`Generating ${NUM_USERS} users...`);
    const users = await generateUsers(NUM_USERS);
    await db.collection("users").insertMany(users);
    console.log(`Inserted ${users.length} users`);

    // Generate and insert sessions
    console.log(`Generating ${NUM_USERS * SESSIONS_PER_USER} sessions...`);
    let allSessions = [];
    for (const user of users) {
      const sessions = generateSessions(user._id, SESSIONS_PER_USER);
      allSessions = allSessions.concat(sessions);
    }
    await db.collection("sessions").insertMany(allSessions);
    console.log(`Inserted ${allSessions.length} sessions`);

    // Generate and insert tasks
    console.log(`Generating ${NUM_USERS * TASKS_PER_USER} tasks...`);
    let allTasks = [];
    for (const user of users) {
      const tasks = generateTasks(user._id, TASKS_PER_USER);
      allTasks = allTasks.concat(tasks);
    }
    await db.collection("tasks").insertMany(allTasks);
    console.log(`Inserted ${allTasks.length} tasks`);

    // Summary
    const totalRecords = users.length + allSessions.length + allTasks.length;
    console.log("\n=== Seed Complete ===");
    console.log(`Users: ${users.length}`);
    console.log(`Sessions: ${allSessions.length}`);
    console.log(`Tasks: ${allTasks.length}`);
    console.log(`Total records: ${totalRecords}`);
    console.log("\nTest credentials:");
    console.log("Email: testuser1@example.com");
    console.log("Password: password123");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await client.close();
    console.log("\nConnection closed");
  }
};

seed();
