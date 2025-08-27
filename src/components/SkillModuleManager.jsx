import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import TaskAnalysisBuilder from './TaskAnalysisBuilder';

function SkillModuleManager({ onModuleSelect, userRole = 'patient' }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    search: ''
  });

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [modules, filters]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      
      // Fetch both discrete trials and task analysis modules
      const [trialsSnapshot, tasksSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'abaTrials'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'taskAnalysis'), orderBy('createdAt', 'desc')))
      ]);

      const trials = trialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        moduleType: 'discrete_trial'
      }));

      const tasks = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        moduleType: 'task_analysis'
      }));

      const allModules = [...trials, ...tasks];
      setModules(allModules);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = modules;

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(module => module.category === filters.category);
    }

    // Difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(module => module.difficulty === filters.difficulty);
    }

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(module =>
        module.title?.toLowerCase().includes(searchTerm) ||
        module.description?.toLowerCase().includes(searchTerm) ||
        module.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredModules(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleModuleEdit = (module) => {
    setEditingModule(module);
    setShowBuilder(true);
  };

  const handleModuleDelete = async (moduleId, moduleType) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        const collectionName = moduleType === 'discrete_trial' ? 'abaTrials' : 'taskAnalysis';
        await deleteDoc(doc(db, collectionName, moduleId));
        fetchModules(); // Refresh the list
      } catch (error) {
        console.error('Error deleting module:', error);
        alert('Error deleting module. Please try again.');
      }
    }
  };

  const handleBuilderClose = () => {
    setShowBuilder(false);
    setEditingModule(null);
    fetchModules(); // Refresh after saving
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

  const getModuleTypeIcon = (moduleType) => {
    return moduleType === 'discrete_trial' ? '🎯' : '📝';
  };

  const getModuleTypeName = (moduleType) => {
    return moduleType === 'discrete_trial' ? 'Discrete Trial' : 'Task Analysis';
  };

  if (showBuilder) {
    return (
      <TaskAnalysisBuilder
        onSave={handleBuilderClose}
        onClose={handleBuilderClose}
        editingTask={editingModule}
      />
    );
  }

  console.log("Current theme:", theme);

  return (
    <div className="skill-module-manager">
      {/* Enhanced Filters */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <h5 className="card-title mb-3">
            <i className="fas fa-filter me-2 text-primary"></i>
            Find Your Perfect Module
          </h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">🔍 Search</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="fas fa-search text-muted"></i>
                </span>
              <input
                type="text"
                  className="form-control border-start-0"
                placeholder="Search modules..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                  style={{ borderRadius: '0 8px 8px 0' }}
              />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">📚 Category</label>
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{ borderRadius: '8px' }}
              >
                <option value="all">All Categories</option>
                <option value="communication">💬 Communication</option>
                <option value="social">👥 Social Skills</option>
                <option value="academic">📚 Academic</option>
                <option value="daily_living">🏠 Daily Living</option>
                <option value="motor">🤸 Motor Skills</option>
                <option value="cognitive">🧠 Cognitive</option>
                <option value="emotional">❤️ Emotional</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">🎯 Difficulty</label>
              <select
                className="form-select"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                style={{ borderRadius: '8px' }}
              >
                <option value="all">All Levels</option>
                <option value="beginner">🟢 Beginner</option>
                <option value="intermediate">🟡 Intermediate</option>
                <option value="advanced">🔴 Advanced</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => setFilters({ category: 'all', difficulty: 'all', search: '' })}
                style={{ borderRadius: '8px', padding: '10px 16px' }}
              >
                <i className="fas fa-undo me-2"></i>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading modules...</span>
          </div>
          <p className="mt-3 text-muted">Loading your learning modules...</p>
        </div>
      ) : filteredModules.length > 0 ? (
        <div className="row">
          {filteredModules.map(module => (
            <div key={`${module.moduleType}-${module.id}`} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm border-0 module-card" 
                   style={{ 
                     borderRadius: '16px',
                     transition: 'all 0.3s ease',
                     border: '1px solid rgba(0,0,0,0.05)',
                   }}>
                <div className="card-header bg-transparent border-0 p-3">
                  <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-center">
                      <div className="module-icon me-3" style={{ 
                        fontSize: '2rem',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                      }}>
                      {getCategoryIcon(module.category)}
                      </div>
                      <div>
                        <span className="badge bg-light text-dark me-2" style={{ fontSize: '0.75rem' }}>
                          {getModuleTypeIcon(module.moduleType)} {getModuleTypeName(module.moduleType)}
                    </span>
                        <span className={`badge bg-${getDifficultyColor(module.difficulty)}`} style={{ fontSize: '0.75rem' }}>
                          {module.difficulty}
                    </span>
                      </div>
                  </div>
                  {(userRole === 'specialist' || userRole === 'parent') && (
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                          style={{ borderRadius: '8px' }}
                      >
                          <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleModuleEdit(module)}
                          >
                              <i className="fas fa-edit me-2"></i>Edit
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleModuleDelete(module.id, module.moduleType)}
                          >
                              <i className="fas fa-trash me-2"></i>Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  </div>
                </div>

                <div className="card-body p-4">
                <h5
                  className="card-title fw-bold mb-3"
                  style={{
                    color: theme === 'dark' ? '#ffffff' : '#2c3e50'
                  }}
                >
                  {module.title}
                </h5>
                  {/* <p className="card-text text-muted mb-3" style={{ lineHeight: '1.6' }}>
                    {module.description || 'No description available'}
                  </p> */}

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {module.estimatedTime && (
                      <span className="badge bg-info bg-opacity-10 text-info border border-info">
                        <i className="fas fa-clock me-1"></i>
                        {module.estimatedTime} min
                      </span>
                    )}
                    {module.reinforcement?.points && (
                      <span className="badge bg-warning bg-opacity-10 text-warning border border-warning">
                        <i className="fas fa-star me-1"></i>
                        {module.reinforcement.points} pts
                      </span>
                    )}
                  </div>

                  {module.tags && module.tags.length > 0 && (
                    <div className="mb-3">
                      {/* {module.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="badge bg-light text-dark me-1 mb-1" style={{ fontSize: '0.75rem' }}>
                          #{tag}
                        </span>
                      ))} */}
                      {module.tags.length > 3 && (
                        <span className="badge bg-light text-dark mb-1" style={{ fontSize: '0.75rem' }}>
                          +{module.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                    {/* <span>
                      <i className="fas fa-list-ol me-1"></i>
                      {module.moduleType === 'task_analysis' 
                        ? `${module.steps?.length || 0} steps`
                        : `${module.options?.length || 0} questions`
                      }
                    </span> */}
                    <span>
                      <i className="fas fa-calendar me-1"></i>
                      {/* {module.createdAt?.toDate?.()?.toLocaleDateString() || 'No date'} */}
                    </span>
                  </div>
                </div>

                <div className="card-footer bg-transparent border-0 p-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => onModuleSelect && onModuleSelect(module)}
                    style={{
                      borderRadius: '12px',
                      padding: '12px 24px',
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}
                  >
                    <i className="fas fa-play me-2"></i>
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="empty-state">
            <div className="mb-4" style={{ fontSize: '5rem', opacity: '0.3' }}>📚</div>
            <h4 className="text-muted mb-3">No modules found</h4>
            <p className="text-muted mb-4">
            {filters.search || filters.category !== 'all' || filters.difficulty !== 'all'
              ? 'Try adjusting your filters to see more modules.'
              : 'Create your first skill-building module to get started!'}
          </p>
          {(userRole === 'specialist' || userRole === 'parent') && (
            <button
                className="btn btn-primary btn-lg"
              onClick={() => setShowBuilder(true)}
                style={{ borderRadius: '12px', padding: '12px 32px' }}
            >
                <i className="fas fa-plus me-2"></i>
              Create First Module
            </button>
          )}
          </div>
        </div>
      )}

      {/* Enhanced Module Statistics */}
      {!loading && modules.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="card bg-gradient-primary text-white border-0 shadow" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h5 className="card-title mb-4 text-center">
                  <i className="fas fa-chart-bar me-2"></i>
                  Module Overview
                </h5>
                <div className="row text-center">
                  <div className="col-md-3 mb-3">
                    <div className="h2 mb-1">{modules.length}</div>
                    <small className="opacity-75">Total Modules</small>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="h2 mb-1">
                      {modules.filter(m => m.moduleType === 'discrete_trial').length}
                    </div>
                    <small className="opacity-75">Discrete Trials</small>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="h2 mb-1">
                      {modules.filter(m => m.moduleType === 'task_analysis').length}
                    </div>
                    <small className="opacity-75">Task Analysis</small>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="h2 mb-1">
                      {new Set(modules.map(m => m.category)).size}
                    </div>
                    <small className="opacity-75">Skill Categories</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .module-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
        }
        
        .empty-state {
          padding: 3rem 1rem;
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .module-icon {
          transition: transform 0.3s ease;
        }
        
        .module-card:hover .module-icon {
          transform: scale(1.1);
        }

        body[data-bs-theme='dark'] .module-card .card-title {
        color: #ffffff !important;
        }
        `
      }} />
    </div>
  );
}

export default SkillModuleManager;
