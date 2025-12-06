'use client';

import { createContext, useState, useContext } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get all tasks
  const getTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter) params.status = filter;
      if (searchQuery) params.search = searchQuery;

      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Create task
const createTask = async (taskData) => {
  try {
    const { data } = await api.post('/tasks', taskData);
    // Refresh tasks from server instead of manually adding
    await getTasks();
    toast.success('Task created successfully!');
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create task';
    toast.error(message);
    throw error;
  }
};
// Update task
const updateTask = async (id, taskData) => {
  try {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    // Refresh tasks from server
    await getTasks();
    toast.success('Task updated successfully!');
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update task';
    toast.error(message);
    throw error;
  }
};
  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast.error(message);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        getTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};