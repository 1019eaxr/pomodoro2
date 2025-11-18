const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.set('strictQuery', false); // 解决deprecation警告

mongoose.connect('mongodb://115.190.50.47:27017/time_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  console.log('connect success');
});

mongoose.connection.once('close', () => {
  console.log('connect fail');
});

const taskSchema = {
    name: String,
    num: Number,
    finish: Number
};

const Task = mongoose.model('Task', taskSchema);

app.get('/getTasks', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let tasks = await Task.find();
    res.status(200).json({
        success: true,
        data: tasks
    });
});

app.get('/addTask', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const task = new Task({
        id: new Date().getTime(),
        name: req.query.name,
        num: req.query.num,
        finish: 0
    });
    await task.save();
    let tasks = await Task.find();
    res.status(200).json({
        success: true,
        data: tasks
    });
});

app.get('/updateTask', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const task = await Task.findById(req.query.id);
    task.finish = req.query.finish;
    await Task.findByIdAndUpdate(
        req.query.id,
        task,
        { new: true, runValidators: true }
    );
    let tasks = await Task.find();
    res.status(200).json({
        success: true,
        data: tasks
    });
});

app.get('/deleteTask', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    await Task.findByIdAndDelete(req.query.id);
    let tasks = await Task.find();
    res.status(200).json({
        success: true,
        data: tasks
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`server run at http://localhost:${PORT}`);
});