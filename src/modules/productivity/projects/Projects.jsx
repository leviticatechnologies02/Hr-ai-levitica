import React, { useState, useEffect, useCallback } from 'react';
import {
  HiOutlinePlus,
  HiOutlineFolderOpen,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi2';
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../services/projectAndTaskApi';
import ProjectFormModal from '../components/ProjectFormModal';

const statusStyles = {
  Active: 'bg-green-100 text-green-700',
  Completed: 'bg-blue-100 text-blue-700',
  'On Hold': 'bg-yellow-100 text-yellow-700',
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingProject, setEditingProject] = useState(null);

  const loadProjects = useCallback(() => {
    setIsLoading(true);
    setError(null);
    listProjects()
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Failed to load projects:', err);
        setError(err.message || 'Failed to load projects');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setModalMode('edit');
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCreate = async (payload) => {
    await createProject(payload);
    loadProjects();
  };

  const handleUpdate = async (id, payload) => {
    await updateProject(id, payload);
    loadProjects();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    try {
      await deleteProject(id);
      loadProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError(err.message || 'Failed to delete project');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineFolderOpen className="text-blue-600 w-6 h-6" />
            Projects
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage productivity projects</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <HiOutlinePlus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-400">
          No projects found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    statusStyles[project.status] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {project.status}
                </span>
              </div>
              {project.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {project.description}
                </p>
              )}
              <div className="text-xs text-gray-400 mb-3">
                {project.start_date || '—'} to {project.end_date || '—'}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(project)}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <HiOutlinePencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <HiOutlineTrash className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={editingProject}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default Projects;