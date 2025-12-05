'use client';

import { useTasks } from '@/context/TaskContext';

export default function FilterBar() {
  const { filter, setFilter } = useTasks();

  const filters = [
    { value: '', label: 'All Tasks' },
    { value: 'To Do', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === f.value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}