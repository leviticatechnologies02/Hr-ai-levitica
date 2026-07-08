import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit3, Trash2, GripVertical, Save, X, Check } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';

const Stages = () => {

  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stageToDelete, setStageToDelete] = useState(null);
  const [editingStage, setEditingStage] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [draggedStage, setDraggedStage] = useState(null);
  const [newStage, setNewStage] = useState({ name: '', type: 'Screening' });
  const [hasChanges, setHasChanges] = useState(false);

  const stageTypes = ['Screening', 'Interview', 'Decision', 'Final'];
  const getStageTypeBadgeClass = (type) => {
    const typeClasses = {
      'Screening': 'badge bg-primary-50 text-primary-600 border',
      'Interview': 'badge bg-warning-50 text-warning-600 border',
      'Decision': 'badge bg-info-50 text-info-600 border',
      'Final': 'badge bg-success-50 text-success-600 border'
    };
    return typeClasses[type] || 'badge bg-secondary-50 text-secondary-600 border';
  };

  const loadStages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.STAGES}`);
      if (!res.ok) throw new Error('Failed to load stages');
      const data = await res.json();
      setStages(data.map((s) => ({ id: s.id, name: s.name, order: s.order, type: s.stage_type || 'Screening' })));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load stages');
      toast.error('Failed to load pipeline stages from the server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStages();
  }, [loadStages]);

  const handleDragStart = (e, stage) => {
    setDraggedStage(stage);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    if (!draggedStage || draggedStage.id === targetStage.id) return;

    const newStages = [...stages];
    const draggedIndex = newStages.findIndex(s => s.id === draggedStage.id);
    const targetIndex = newStages.findIndex(s => s.id === targetStage.id);

    const [removed] = newStages.splice(draggedIndex, 1);
    newStages.splice(targetIndex, 0, removed);

    const updatedStages = newStages.map((stage, index) => ({
      ...stage,
      order: index + 1
    }));

    setStages(updatedStages);
    setDraggedStage(null);
    setHasChanges(true);
  };

  const handleEditStart = (stage) => {
    setEditingStage(stage.id);
    setEditingName(stage.name);
  };

  const handleEditSave = async (stageId) => {
    const trimmed = editingName.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.STAGE(stageId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to rename stage');
      }
      setStages(stages.map(stage =>
        stage.id === stageId
          ? { ...stage, name: trimmed }
          : stage
      ));
      toast.success('Stage renamed');
    } catch (err) {
      toast.error(err.message || 'Failed to rename stage');
    } finally {
      setEditingStage(null);
      setEditingName('');
    }
  };

  const handleEditCancel = () => {
    setEditingStage(null);
    setEditingName('');
  };

  const handleTypeChange = async (stageId, newType) => {
    const prevStages = stages;
    setStages(stages.map(stage =>
      stage.id === stageId
        ? { ...stage, type: newType }
        : stage
    ));

    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.STAGE(stageId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage_type: newType }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to update stage type');
      }
    } catch (err) {
      setStages(prevStages); // revert on failure
      toast.error(err.message || 'Failed to update stage type');
    }
  };

  const handleDeleteStage = (stageId) => {
    const stage = stages.find(s => s.id === stageId);
    setStageToDelete(stage);
    setShowDeleteModal(true);
  };

  const confirmDeleteStage = async () => {
    if (!stageToDelete) return;
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.STAGE(stageToDelete.id)}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to delete stage');
      }
      setStages(stages.filter(stage => stage.id !== stageToDelete.id));
      toast.success(`Stage "${stageToDelete.name}" deleted`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete stage');
    } finally {
      setShowDeleteModal(false);
      setStageToDelete(null);
    }
  };

  const cancelDeleteStage = () => {
    setShowDeleteModal(false);
    setStageToDelete(null);
  };

  const handleAddStage = async () => {
    if (!newStage.name.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.STAGES}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStage.name.trim(),
          order: stages.length + 1,
          stage_type: newStage.type,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to add stage');
      }
      const created = await res.json();
      setStages([...stages, { id: created.id, name: created.name, order: created.order, type: created.stage_type || 'Screening' }]);
      setNewStage({ name: '', type: 'Screening' });
      setShowAddModal(false);
      toast.success(`Stage "${created.name}" added`);
    } catch (err) {
      toast.error(err.message || 'Failed to add stage');
    }
  };

  const handleSaveWorkflow = async () => {
    try {
      // Persist the current order for every stage (drag-and-drop reordering
      // is batched locally until this button is clicked).
      await Promise.all(
        stages.map((stage) =>
          fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.STAGE(stage.id)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: stage.order }),
          })
        )
      );
      setHasChanges(false);
      toast.success('Pipeline workflow saved successfully!');
    } catch (err) {
      toast.error('Failed to save the new stage order');
    }
  };

  return (
    <div className='container-fluid py-4'>
      <ToastContainer position="top-right" autoClose={3000} />
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-muted small mb-3">Loading stages…</div>}

      <div className='mb-12'>
        <h4 className='mb-2'>Pipeline Stages</h4>
        <p className='text-secondary-light mb-0'>Customize your hiring workflow by adding, editing, and reordering stages.</p>
      </div>
      
      <div className='card border shadow-none mb-24'>
        <div className='card-header bg-base border-bottom d-flex align-items-center justify-content-between'>
          <h5 className='card-title mb-0'>Manage Stages</h5>
          <div className='d-flex gap-2'>
            <button
              onClick={() => setShowAddModal(true)}
              className='btn btn-primary d-inline-flex align-items-center justify-content-center gap-2'
            >
              <Plus size={16} />
              Add Stage
            </button>
            {hasChanges && (
              <button
                onClick={handleSaveWorkflow}
                className='btn btn-success d-inline-flex align-items-center justify-content-center gap-2'
              >
                <Save size={16} />
                Save Workflow
              </button>
            )}
          </div>
        </div>
      </div>

      {stages.length === 0 ? (
        <div className='card border border-dashed border-secondary-light'>
          <div className='card-body p-48 text-center'>
            <div className='w-64-px h-64-px bg-primary-50 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-16'>
              <Plus size={32} className='text-primary-600' />
            </div>
            <h5 className='mb-8'>No stages defined yet</h5>
            <p className='text-secondary-light mb-24'>Add your first stage to start building your pipeline.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className='btn btn-primary d-flex align-items-center justify-content-center'
            >
              + Add Stage
            </button>
          </div>
        </div>
      ) : (
        <div className='card border shadow-none'>
          <div className='card-header bg-base border-bottom'>
            <h5 className='card-title mb-0'>Current Pipeline Stages</h5>
            <small className='text-secondary-light'>Drag and drop to reorder stages</small>
          </div>
          <div className='card-body p-0'>
            {stages.sort((a, b) => a.order - b.order).map((stage) => (
              <div
                key={stage.id}
                className={`p-16 d-flex align-items-center gap-3 border-bottom ${
                  draggedStage?.id === stage.id ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, stage)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                <div className='cursor-grab active:cursor-grabbing text-secondary-light hover-text-primary'>
                  <GripVertical size={20} />
                </div>

                <div className='w-32-px h-32-px bg-primary-50 rounded-circle d-flex align-items-center justify-content-center text-sm fw-medium text-primary-600'>
                  {stage.order}
                </div>

                <div className='flex-grow-1'>
                  {editingStage === stage.id ? (
                    <div className='d-flex align-items-center gap-2'>
                      <input
                        type='text'
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className='form-control form-control-sm'
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditSave(stage.id)}
                        className='btn btn-link text-success p-0'
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className='btn btn-link text-secondary-light p-0'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className='text-lg fw-medium'>{stage.name}</span>
                  )}
                </div>

                <div style={{ minWidth: '140px' }}>
                  <select
                    value={stage.type}
                    onChange={(e) => handleTypeChange(stage.id, e.target.value)}
                    className={`form-select form-select-sm form-select-center ${getStageTypeBadgeClass(stage.type)}`}
                    style={{ 
                      minWidth: '120px', 
                      paddingRight: '30px',
                      backgroundPosition: 'right 8px center'
                    }}
                  >
                    {stageTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className='d-flex align-items-center gap-2'>
                  <button
                    onClick={() => handleEditStart(stage)}
                    className='btn btn-link text-secondary-light hover-text-primary p-2'
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteStage(stage.id)}
                    className='btn btn-link text-secondary-light hover-text-danger p-2'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <>
          <div className='modal d-block' tabIndex='-1' role='dialog'>
            <div className='modal-dialog' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title mb-0'>Add New Stage</h5>
                  <button
                    type='button'
                    className='btn-close'
                    aria-label='Close'
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className='modal-body'>
                  <div className='d-grid gap-3'>
                    <div>
                      <label className='form-label'>Stage Name</label>
                      <input
                        type='text'
                        value={newStage.name}
                        onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                        placeholder='e.g., HR Review'
                        className='form-control'
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className='form-label'>Stage Type</label>
                      <select
                        value={newStage.type}
                        onChange={(e) => setNewStage({ ...newStage, type: e.target.value })}
                        className='form-select'
                      >
                        {stageTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary d-flex align-items-center justify-content-center'
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    className='btn btn-primary d-flex align-items-center justify-content-center'
                    onClick={handleAddStage}
                    disabled={!newStage.name.trim()}
                  >
                    Add Stage
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='modal-backdrop fade show'></div>
        </>
      )}

      {showDeleteModal && stageToDelete && (
        <>
          <div className='modal d-block' tabIndex='-1' role='dialog'>
            <div className='modal-dialog' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title mb-0'>Delete Stage</h5>
                  <button
                    type='button'
                    className='btn-close'
                    aria-label='Close'
                    onClick={cancelDeleteStage}
                  ></button>
                </div>
                <div className='modal-body'>
                  <p className='mb-0'>
                    Are you sure you want to delete the stage <strong>"{stageToDelete.name}"</strong>? 
                    This action cannot be undone.
                  </p>
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary d-flex align-items-center justify-content-center'
                    onClick={cancelDeleteStage}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    className='btn btn-danger d-flex align-items-center justify-content-center'
                    onClick={confirmDeleteStage}
                  >
                    Delete Stage
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='modal-backdrop fade show'></div>
        </>
      )}
    </div>
  );
};

export default Stages;