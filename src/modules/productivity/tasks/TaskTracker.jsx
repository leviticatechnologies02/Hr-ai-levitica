import React, { useState, useEffect, useCallback } from 'react';
import {
  HiOutlinePlus,
  HiOutlineClipboardDocumentList,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import {
  listTasks,
  createTask,
  updateTask,
  completeTask,
  reopenTask,
  deleteTask,
  listProjects,
} from '../services/projectAndTaskApi';
import TaskFormModal from '../components/TaskFormModal';

const statusStyles = {
  Pending: 'bg-gray-100 text-gray-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
};

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingTask, setEditingTask] = useState(null);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    Promise.all([listTasks(), listProjects()])
      .then(([taskData, projectData]) => {
        setTasks(Array.isArray(taskData) ? taskData : []);
        setProjects(Array.isArray(projectData) ? projectData : []);
      })
      .catch((err) => {
        console.error('Failed to load task tracker data:', err);
        setError(err.message || 'Failed to load tasks');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const projectName = (projectId) =>
    projects.find((p) => p.id === projectId)?.name || `Project #${projectId}`;

  const openCreateModal = () => {
    setModalMode('create');
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setModalMode('edit');
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreate = async (payload) => {
    await createTask(payload);
    loadData();
  };

  const handleUpdate = async (id, payload) => {
    await updateTask(id, payload);
    loadData();
  };

  const handleComplete = async (id) => {
    try {
      await completeTask(id);
      loadData();
    } catch (err) {
      console.error('Failed to complete task:', err);
      setError(err.message || 'Failed to complete task');
    }
  };

  const handleReopen = async (id) => {
    try {
      await reopenTask(id);
      loadData();
    } catch (err) {
      console.error('Failed to reopen task:', err);
      setError(err.message || 'Failed to reopen task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await deleteTask(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(err.message || 'Failed to delete task');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineClipboardDocumentList className="text-blue-600 w-6 h-6" />
            Task Tracker
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track project tasks</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <HiOutlinePlus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-gray-500">Loading tasks…</div>
        ) : tasks.length === 0 ? (
          <div className="p-6 text-sm text-gray-400">No tasks found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 font-medium">Title</th>
                  <th className="font-medium">Project</th>
                  <th className="font-medium">Status</th>
                  <th className="font-medium">Due Date</th>
                  <th className="font-medium text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td className="text-gray-700">{projectName(task.project_id)}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusStyles[task.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="text-gray-700">{task.due_date || '-'}</td>
                    <td className="px-4">
                      <div className="flex items-center justify-end gap-2">
                        {task.status === 'Completed' ? (
                          <button
                            onClick={() => handleReopen(task.id)}
                            title="Reopen task"
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                          >
                            <HiOutlineArrowPath className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleComplete(task.id)}
                            title="Mark complete"
                            className="p-1.5 rounded-lg hover:bg-green-50 text-green-600"
                          >
                            <HiOutlineCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(task)}
                          title="Edit"
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={editingTask}
        projects={projects}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default TaskTracker;