import React, { useState, useEffect } from 'react';
import Modal from '../../../shared/components/Modal';

const emptyForm = {
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  status: 'Active',
};

const ProjectFormModal = ({
  isOpen,
  onClose,
  mode = 'create',
  initialData = null,
  onCreate,
  onUpdate,
}) => {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        name: initialData.name ?? '',
        description: initialData.description ?? '',
        start_date: initialData.start_date ?? '',
        end_date: initialData.end_date ?? '',
        status: initialData.status ?? 'Active',
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
    if (!form.name) {
      setError('Project name is required');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: form.name,
      description: form.description || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: form.status,
    };

    try {
      if (mode === 'create') {
        await onCreate(payload);
      } else {
        await onUpdate(initialData.id, payload);
      }
      onClose();
    } catch (err) {
      console.error('Project submit error:', err);
      setError(err.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Project' : 'Edit Project'}
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
          placeholder="Project name"
          value={form.name}
          onChange={handleChange('name')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={handleChange('description')}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={form.start_date}
            onChange={handleChange('start_date')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={form.end_date}
            onChange={handleChange('end_date')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={form.status}
          onChange={handleChange('status')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Save Project'}
        </button>
      </form>
    </Modal>
  );
};

export default ProjectFormModal;