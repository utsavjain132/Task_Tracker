const Task = require('../models/Task');

const getTasks = async (req, res) => {
  console.log('GET /tasks called by user:', req.user?._id);

  try {
    const { status, search } = req.query;
    let query = { user: req.user._id };

    console.log('Building task query...');

    if (status) {
      console.log('Filtering by status:', status);
      query.status = status;
    }

    if (search) {
      console.log('Applying search filter:', search);
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    console.log('Final Query:', query);

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    console.log('Tasks fetched:', tasks.length);

    res.json(tasks);
  } catch (error) {
    console.error('Error in getTasks:', error.message);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
};

const createTask = async (req, res) => {
  console.log('POST /tasks called by user:', req.user?._id);
  console.log('Incoming task data:', req.body);

  try {
    const { title, description, dueDate, priority, status } = req.body;

    console.log('Creating new task in database...');
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDate,
      priority,
      status,
    });

    console.log('Task created with ID:', task._id);

    res.status(201).json(task);
  } catch (error) {
    console.error('Error in createTask:', error.message);
    res.status(500).json({ message: 'Server error while creating task' });
  }
};

const updateTask = async (req, res) => {
  console.log('PUT /tasks/:id called. Task ID:', req.params.id);

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      console.log('Update failed: Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      console.log('Unauthorized update attempt by user:', req.user._id);
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    console.log('Updating task with data:', req.body);

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    console.log('Task updated:', updatedTask._id);

    res.json(updatedTask);
  } catch (error) {
    console.error('Error in updateTask:', error.message);
    res.status(500).json({ message: 'Server error while updating task' });
  }
};

const deleteTask = async (req, res) => {
  console.log('DELETE /tasks/:id called. Task ID:', req.params.id);

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      console.log('Delete failed: Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      console.log('Unauthorized delete attempt by user:', req.user._id);
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    console.log('Deleting task...');
    await Task.findByIdAndDelete(req.params.id);

    console.log('Task deleted:', req.params.id);

    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error('Error in deleteTask:', error.message);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
