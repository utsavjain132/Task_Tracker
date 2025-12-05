'use client';

import { useEffect, useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';

export default function DashboardPage() {
  const { tasks, loading, getTasks, filter, searchQuery } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Fetch tasks on mount and when filter/search changes
  useEffect(() => {
    getTasks();
  }, [filter, searchQuery]);

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setTaskToEdit(null);
  };

  const handleCreateNew = () => {
    setTaskToEdit(null);
    setShowTaskForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Tasks</h2>
              <p className="text-gray-600 mt-1">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
              </p>
            </div>
            <button onClick={handleCreateNew} className="btn-primary">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Task
              </span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <SearchBar />
          <FilterBar />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="card max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {filter || searchQuery ? 'No tasks found' : 'No tasks yet'}
              </h3>
              <p className="mt-2 text-gray-500">
                {filter || searchQuery
                  ? 'Try adjusting your filters or search query'
                  : 'Get started by creating your first task!'}
              </p>
              {!filter && !searchQuery && (
                <button onClick={handleCreateNew} className="mt-6 btn-primary">
                  Create Your First Task
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm taskToEdit={taskToEdit} onClose={handleCloseForm} />
      )}
    </div>
  );
}