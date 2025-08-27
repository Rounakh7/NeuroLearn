import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

function TaskAnalysisBuilder({ onSave, onClose, editingTask = null }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    category: 'daily_living',
    difficulty: 'beginner',
    estimatedTime: 10,
    steps: [
      { id: 1, instruction: '', prompt: '', visualAid: '', completed: false }
    ],
    reinforcement: {
      points: 10,
      message: 'Great job completing this task!',
      celebration: 'confetti'
    },
    prerequisites: [],
    tags: []
  });
  const [availableTasks, setAvailableTasks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTaskData(editingTask);
    }
    fetchAvailableTasks();
  }, [editingTask]);

  const fetchAvailableTasks = async () => {
    try {
      const tasksQuery = query(
        collection(db, 'taskAnalysis'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(tasksQuery);
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAvailableTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setTaskData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepChange = (stepId, field, value) => {
    setTaskData(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, [field]: value } : step
      )
    }));
  };

  const addStep = () => {
    const newStepId = Math.max(...taskData.steps.map(s => s.id)) + 1;
    setTaskData(prev => ({
      ...prev,
      steps: [...prev.steps, {
        id: newStepId,
        instruction: '',
        prompt: '',
        visualAid: '',
        completed: false
      }]
    }));
  };

  const removeStep = (stepId) => {
    if (taskData.steps.length > 1) {
      setTaskData(prev => ({
        ...prev,
        steps: prev.steps.filter(step => step.id !== stepId)
      }));
    }
  };

  const moveStep = (stepId, direction) => {
    const currentIndex = taskData.steps.findIndex(step => step.id === stepId);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < taskData.steps.length - 1)
    ) {
      const newSteps = [...taskData.steps];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newSteps[currentIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[currentIndex]];
      
      setTaskData(prev => ({ ...prev, steps: newSteps }));
    }
  };

  const handleReinforcementChange = (field, value) => {
    setTaskData(prev => ({
      ...prev,
      reinforcement: {
        ...prev.reinforcement,
        [field]: value
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !taskData.tags.includes(newTag.trim())) {
      setTaskData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTaskData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    if (!taskData.title.trim() || taskData.steps.length === 0) {
      alert('Please provide a title and at least one step.');
      return;
    }

    setSaving(true);
    try {
      const taskToSave = {
        ...taskData,
        createdBy: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'task_analysis'
      };

      if (editingTask) {
        await updateDoc(doc(db, 'taskAnalysis', editingTask.id), taskToSave);
      } else {
        await addDoc(collection(db, 'taskAnalysis'), taskToSave);
      }

      if (onSave) onSave(taskToSave);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      communication: '💬',
      social: '👥',
      academic: '📚',
      daily_living: '🏠',
      motor: '🤸',
      cognitive: '🧠',
      emotional: '❤️'
    };
    return icons[category] || '📋';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'danger'
    };
    return colors[difficulty] || 'primary';
  };

  return (
    <div className="task-analysis-builder">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              {editingTask ? 'Edit Task Analysis' : 'Create New Task Analysis'}
            </h4>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            
            {/* Basic Information */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-bold">Task Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={taskData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Brushing Teeth, Making a Sandwich"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Estimated Time (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={taskData.estimatedTime}
                  onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value))}
                  min="1"
                  max="120"
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-4">
                <label className="form-label fw-bold">Category</label>
                <select
                  className="form-select"
                  value={taskData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="daily_living">🏠 Daily Living</option>
                  <option value="communication">💬 Communication</option>
                  <option value="social">👥 Social Skills</option>
                  <option value="academic">📚 Academic</option>
                  <option value="motor">🤸 Motor Skills</option>
                  <option value="cognitive">🧠 Cognitive</option>
                  <option value="emotional">❤️ Emotional</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Difficulty Level</label>
                <select
                  className="form-select"
                  value={taskData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                >
                  <option value="beginner">🟢 Beginner</option>
                  <option value="intermediate">🟡 Intermediate</option>
                  <option value="advanced">🔴 Advanced</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Points Reward</label>
                <input
                  type="number"
                  className="form-control"
                  value={taskData.reinforcement.points}
                  onChange={(e) => handleReinforcementChange('points', parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={taskData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this task teaches and its goals..."
              />
            </div>

            {/* Task Steps */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Task Steps</h5>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={addStep}
                >
                  + Add Step
                </button>
              </div>

              {taskData.steps.map((step, index) => (
                <div key={step.id} className="card mb-3">
                  <div className="card-header py-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Step {index + 1}</span>
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => moveStep(step.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => moveStep(step.id, 'down')}
                          disabled={index === taskData.steps.length - 1}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeStep(step.id)}
                          disabled={taskData.steps.length === 1}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <label className="form-label">Instruction *</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={step.instruction}
                          onChange={(e) => handleStepChange(step.id, 'instruction', e.target.value)}
                          placeholder="Clear instruction for this step..."
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Helpful Prompt</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={step.prompt}
                          onChange={(e) => handleStepChange(step.id, 'prompt', e.target.value)}
                          placeholder="Additional guidance if needed..."
                        />
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-12">
                        <label className="form-label">Visual Aid (URL or description)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={step.visualAid}
                          onChange={(e) => handleStepChange(step.id, 'visualAid', e.target.value)}
                          placeholder="Image URL or description of visual aid..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reinforcement Settings */}
            <div className="mb-4">
              <h5 className="mb-3">Reinforcement Settings</h5>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Success Message</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={taskData.reinforcement.message}
                        onChange={(e) => handleReinforcementChange('message', e.target.value)}
                        placeholder="Positive reinforcement message..."
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Celebration Type</label>
                      <select
                        className="form-select"
                        value={taskData.reinforcement.celebration}
                        onChange={(e) => handleReinforcementChange('celebration', e.target.value)}
                      >
                        <option value="confetti">🎉 Confetti</option>
                        <option value="stars">⭐ Stars</option>
                        <option value="fireworks">🎆 Fireworks</option>
                        <option value="balloons">🎈 Balloons</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="form-label fw-bold">Tags</label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={addTag}
                >
                  Add
                </button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {taskData.tags.map(tag => (
                  <span key={tag} className="badge bg-secondary">
                    {tag}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: '0.7em' }}
                      onClick={() => removeTag(tag)}
                    ></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mb-4">
              <h5 className="mb-3">Preview</h5>
              <div className="card bg-light">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2" style={{ fontSize: '1.5rem' }}>
                      {getCategoryIcon(taskData.category)}
                    </span>
                    <div>
                      <h6 className="mb-0">{taskData.title || 'Task Title'}</h6>
                      <small className="text-muted">
                        <span className={`badge bg-${getDifficultyColor(taskData.difficulty)} me-2`}>
                          {taskData.difficulty}
                        </span>
                        {taskData.estimatedTime} min • {taskData.reinforcement.points} points
                      </small>
                    </div>
                  </div>
                  <p className="text-muted mb-2">{taskData.description || 'Task description...'}</p>
                  <small className="text-muted">
                    {taskData.steps.length} step{taskData.steps.length !== 1 ? 's' : ''}
                  </small>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                  </>
                ) : (
                  editingTask ? 'Update Task' : 'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskAnalysisBuilder;
