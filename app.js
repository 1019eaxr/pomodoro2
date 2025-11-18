// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(cors());              // allows all origins
app.use(express.json());      // parse JSON body data
app.use(express.urlencoded({ extended: true })); // parse form data

// ---------- Database connection ----------
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------- Schema & Model ----------
const taskSchema = new mongoose.Schema({
  name: String,
  num: Number,
  finish: { type: Number, default: 0 },
});

const Task = mongoose.model("Task", taskSchema);

// ---------- Routes ----------

// Get all tasks
app.get("/getTasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add a new task  (use POST instead of GET)
app.post("/addTask", async (req, res) => {
  try {
    const { name, num } = req.body;
    const task = await Task.create({ name, num });
    const tasks = await Task.find();
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update an existing task
app.put("/updateTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { finish } = req.body;
    await Task.findByIdAndUpdate(id, { finish }, { new: true });
    const tasks = await Task.find();
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a task
app.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    const tasks = await Task.find();
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------- Run Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
