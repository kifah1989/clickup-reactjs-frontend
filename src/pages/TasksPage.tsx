import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckSquare,
  Plus,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { ClickUpApiService, type ClickUpTask } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const TasksPage: React.FC = () => {
  const { workspaceId, spaceId, listId } = useParams<{
    workspaceId: string;
    spaceId: string;
    listId: string;
  }>();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ClickUpTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canCreate = user?.role === "ADMIN" || user?.role === "EDITOR";
  const canDelete = user?.role === "ADMIN";

  useEffect(() => {
    if (listId) {
      loadTasks();
    }
  }, [listId]);

  const loadTasks = async () => {
    if (!listId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await ClickUpApiService.getTasksByList(listId);
      setTasks(response.tasks);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "to do":
      case "open":
        return "bg-gray-100 text-gray-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "complete":
      case "closed":
        return "bg-green-100 text-green-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-red-100 text-red-800";
      case 2:
        return "bg-orange-100 text-orange-800";
      case 3:
        return "bg-yellow-100 text-yellow-800";
      case 4:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return "Urgent";
      case 2:
        return "High";
      case 3:
        return "Normal";
      case 4:
        return "Low";
      default:
        return "None";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-clickup-primary" />
          <span className="text-gray-600">Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Tasks
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadTasks} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">
            {canCreate
              ? "Manage and track your tasks"
              : "View your tasks (read-only mode)"}
          </p>
        </div>
        {canCreate && (
          <button
            disabled
            className="btn btn-secondary flex items-center space-x-2 opacity-50 cursor-not-allowed"
            title="This feature is coming soon"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task (Coming Soon)</span>
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Tasks Found
          </h3>
          <p className="text-gray-600 mb-4">
            {canCreate
              ? "No tasks in this list yet."
              : "No tasks available in this list."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="card p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {task.name}
                      </h3>

                      {task.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {/* Status */}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            task.status.status
                          )}`}
                        >
                          {task.status.status}
                        </span>

                        {/* Priority */}
                        {task.priority && task.priority.priority && (
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                              parseInt(task.priority.priority)
                            )}`}
                          >
                            {getPriorityText(parseInt(task.priority.priority))}
                          </span>
                        )}

                        {/* Due Date */}
                        {task.due_date && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(
                                parseInt(task.due_date)
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Assignees */}
                      {task.assignees && task.assignees.length > 0 && (
                        <div className="flex items-center space-x-2 mb-3">
                          <User className="w-4 h-4 text-gray-400" />
                          <div className="flex space-x-1">
                            {task.assignees.map((assignee) => (
                              <div
                                key={assignee.id}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-semibold"
                                style={{ backgroundColor: assignee.color }}
                                title={assignee.username || "Unknown User"}
                              >
                                {(assignee.username || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/workspace/${workspaceId}/space/${spaceId}/list/${listId}/task/${task.id}`}
                          className="btn btn-primary text-sm flex items-center space-x-1"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        {task.url && (
                          <a
                            href={task.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary text-sm flex items-center space-x-1"
                          >
                            <span>Open in ClickUp</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {canDelete && (
                  <button
                    disabled
                    className="p-1 text-gray-300 cursor-not-allowed ml-4"
                    title="Delete function is coming soon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
