import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { List, Plus, Loader2, AlertCircle, Archive, Trash2 } from 'lucide-react';
import { ClickUpApiService, type ClickUpList } from '../services/api';

const ListsPage: React.FC = () => {
  const { workspaceId, spaceId } = useParams<{ workspaceId: string; spaceId: string }>();
  const [lists, setLists] = useState<ClickUpList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (spaceId) {
      loadLists();
    }
  }, [spaceId]);

  const loadLists = async () => {
    if (!spaceId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await ClickUpApiService.getListsBySpace(spaceId, false);
      setLists(response.lists);
    } catch (err) {
      setError('Failed to load lists. Please try again.');
      console.error('Error loading lists:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-clickup-primary" />
          <span className="text-gray-600">Loading lists...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Lists</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadLists} className="btn btn-primary">
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
          <h1 className="text-3xl font-bold text-gray-900">Lists</h1>
          <p className="text-gray-600 mt-2">Organize your tasks into lists (read-only mode)</p>
        </div>
        <button
          disabled
          className="btn btn-secondary flex items-center space-x-2 opacity-50 cursor-not-allowed"
          title="This feature is currently disabled"
        >
          <Plus className="w-4 h-4" />
          <span>Create List (Disabled)</span>
        </button>
      </div>

      {/* All modification features are disabled */}

      {lists.length === 0 ? (
        <div className="text-center py-12">
          <List className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Lists Found</h3>
          <p className="text-gray-600 mb-4">No lists available in this space. (Note: Creation is currently disabled)</p>
          <button
            disabled
            className="btn btn-secondary opacity-50 cursor-not-allowed"
            title="This feature is currently disabled"
          >
            Create List (Disabled)
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <div key={list.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {list.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    {list.task_count !== undefined && (
                      <span>{list.task_count} tasks</span>
                    )}
                    {list.archived && (
                      <span className="flex items-center space-x-1">
                        <Archive className="w-3 h-3" />
                        <span>Archived</span>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  disabled
                  className="p-1 text-gray-300 cursor-not-allowed"
                  title="Delete function is currently disabled"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {list.assignee && (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-semibold"
                      style={{ backgroundColor: list.assignee.color }}
                    >
                      {(list.assignee.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-600">{list.assignee.username || 'Unknown User'}</span>
                  </div>
                )}
                
                {list.due_date && (
                  <div className="text-sm text-gray-600">
                    Due: {new Date(parseInt(list.due_date)).toLocaleDateString()}
                  </div>
                )}
                
                <Link
                  to={`/workspace/${workspaceId}/space/${spaceId}/list/${list.id}/tasks`}
                  className="block w-full btn btn-primary text-center"
                >
                  View Tasks
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListsPage;