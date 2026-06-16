import React, { useState, useEffect } from 'react';
import Modal from '../../../shared/components/Modal';

const emptyForm = {
  title: '',
  description: '',
  project_id: '',
  assigned_to: '',
  status: 'Pending',
  due_date: '',
};

const TaskFormModal = ({
  isOpen,
  onClose,
  mode = 'create',
  initialData = null,
  projects = [],
  onCreate,
  onUpdate,
}) => {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        title: initialData.title ?? '',
        description: initialData.description ?? '',
        project_id: initialData.project_id ?? '',
        assigned_to: initialData.assigned_to ?? '',
        status: initialData.status ?? 'Pending',
        due_date: initialData.due_date ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [mode, initialData, isOpen]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.project_id) {
      setError('Title and Project are required');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const payload = {
      title: form.title,
      description: form.description || null,
      project_id: Number(form.project_id),
      assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
      status: form.status,
      due_date: form.due_date || null,
    };

    try {
      if (mode === 'create') {
        await onCreate(payload);
      } else {
        await onUpdate(initialData.id, payload);
      }
      onClose();
    } catch (err) {
      console.error('Task submit error:', err);
      setError(err.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Task' : 'Edit Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-3">
        {error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-2">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange('title')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={handleChange('description')}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={form.project_id}
          onChange={handleChange('project_id')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Assigned to (employee ID, optional)"
          value={form.assigned_to}
          onChange={handleChange('assigned_to')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.status}
            onChange={handleChange('status')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <input
            type="date"
            value={form.due_date}
            onChange={handleChange('due_date')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Save Task'}
        </button>
      </form>
    </Modal>
  );
};

export default TaskFormModal;