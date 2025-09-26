import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Calendar, 
  ExternalLink, 
  Edit3,
  CheckSquare,
  Clock,
  Target
} from 'lucide-react';
import { ClickUpApiService, type ClickUpTask } from '../services/api';

const TaskDetailPage: React.FC = () => {
  const { workspaceId, spaceId, listId, taskId } = useParams<{ 
    workspaceId: string; 
    spaceId: string; 
    listId: string; 
    taskId: string;
  }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<ClickUpTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  const loadTask = async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      setError(null);
      const taskData = await ClickUpApiService.getTaskById(taskId);
      setTask(taskData);
    } catch (err) {
      setError('Failed to load task. Please try again.');
      console.error('Error loading task:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'to do':
      case 'open':
        return 'bg-gray-100 text-gray-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'complete':
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-red-100 text-red-800';
      case 2:
        return 'bg-orange-100 text-orange-800';
      case 3:
        return 'bg-yellow-100 text-yellow-800';
      case 4:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return 'Urgent';
      case 2:
        return 'High';
      case 3:
        return 'Normal';
      case 4:
        return 'Low';
      default:
        return 'None';
    }
  };

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-clickup-primary" />
          <span className="text-gray-600">Loading task...</span>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Task</h3>
          <p className="text-gray-600 mb-4">{error || 'Task not found'}</p>
          <div className="space-x-3">
            <button onClick={loadTask} className="btn btn-primary">
              Try Again
            </button>
            <button 
              onClick={() => navigate(`/workspace/${workspaceId}/space/${spaceId}/list/${listId}/tasks`)}
              className="btn btn-secondary"
            >
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/workspace/${workspaceId}/space/${spaceId}/list/${listId}/tasks`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to tasks"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
            <p className="text-gray-600 mt-1">View task information (read-only mode)</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {task.url && (
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary flex items-center space-x-2"
            >
              <span>Open in ClickUp</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          
          <button
            disabled
            className="btn btn-secondary flex items-center space-x-2 opacity-50 cursor-not-allowed"
            title="Edit functionality is currently disabled"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Task (Disabled)</span>
          </button>
        </div>
      </div>

      {/* Task Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Name */}
          <div className="card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name
            </label>
            <h2 className="text-2xl font-semibold text-gray-900">{task.name}</h2>
          </div>

          {/* Description */}
          <div className="card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="prose max-w-none">
              {task.description ? (
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
              ) : (
                <p className="text-gray-500 italic">No description provided</p>
              )}
            </div>
          </div>

          {/* Custom Fields */}
          {task.custom_fields && task.custom_fields.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Fields</h3>
              <div className="space-y-3">
                {task.custom_fields.map((field, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">{field.name}</span>
                    <span className="text-gray-900 font-medium">{field.value || 'Not set'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Priority</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(task.status.status)}`}>
                  {task.status.status}
                </span>
              </div>
              
              {task.priority && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(parseInt(task.priority.priority))}`}>
                    {getPriorityText(parseInt(task.priority.priority))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Created: {new Date(parseInt(task.date_created)).toLocaleDateString()}</span>
              </div>
              
              {task.start_date && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <CheckSquare className="w-4 h-4" />
                  <span className="text-sm">Start: {new Date(parseInt(task.start_date)).toLocaleDateString()}</span>
                </div>
              )}
              
              {task.due_date && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Due: {new Date(parseInt(task.due_date)).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Updated: {new Date(parseInt(task.date_updated)).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Assignees */}
          {task.assignees && task.assignees.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignees</h3>
              <div className="space-y-3">
                {task.assignees.map((assignee) => (
                  <div key={assignee.id} className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-semibold"
                      style={{ backgroundColor: assignee.color }}
                    >
                      {(assignee.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{assignee.username || 'Unknown User'}</div>
                      {assignee.email && (
                        <div className="text-xs text-gray-500">{assignee.email}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Tracking */}
          {(task.time_estimate || task.time_spent) && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
              <div className="space-y-3">
                {task.time_estimate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimated:</span>
                    <span className="text-gray-900 font-medium">{formatTime(task.time_estimate)}</span>
                  </div>
                )}
                {task.time_spent && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Spent:</span>
                    <span className="text-gray-900 font-medium">{formatTime(task.time_spent)}</span>
                  </div>
                )}
                {task.points && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Points:</span>
                    <span className="text-gray-900 font-medium">{task.points}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium rounded"
                    style={{ 
                      backgroundColor: tag.tag_bg,
                      color: tag.tag_fg 
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>List: <span className="text-gray-900 font-medium">{task.list.name}</span></div>
              <div>Project: <span className="text-gray-900 font-medium">{task.project.name}</span></div>
              <div>Folder: <span className="text-gray-900 font-medium">{task.folder.name}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;