// app.js
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// ✅ Use the port Railway gives you, or 3000 locally
const PORT = process.env.PORT || 3000;

// ✅ Enable JSON and CORS handling (for API safety)
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// ✅ Use an environment variable for MongoDB connection
// (You’ll set MONGODB_URI in Railway’s Variables tab)
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Schema & Model ---
const taskSchema = new mongoose.Schema({
  name: String,
  num: Number,
  finish: Number,
});

const Task = mongoose.model("Task", taskSchema);

// --- Routes ---

// Get all tasks
app.get("/getTasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add a new task
app.get("/addTask", async (req, res) => {
  try {
    const task = new Task({
      name: req.query.name,
      num: req.query.num,
      finish: 0,
    });
    await task.save();
    const tasks = await Task.find();
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update an existing task
app.get("/updateTask", async (req, res) => {
  try {
    const { id, finish } = req.query;
    await Task.findByIdAndUpdate(id, { finish }, { new: true });
    const tasks = await Task.find();
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a task
app.get("/deleteTask", async (req, res) => {
  try {
    const { id } = req.query;
    await Task.findByIdAndDelete(id);
    const tasks = await Task.find();
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- Run Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
