import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FolderOpen, Plus, Loader2, AlertCircle, Archive, Trash2 } from 'lucide-react';
import { ClickUpApiService, type ClickUpSpace } from '../services/api';

const SpacesPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [spaces, setSpaces] = useState<ClickUpSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workspaceId) {
      loadSpaces();
    }
  }, [workspaceId]);

  const loadSpaces = async () => {
    if (!workspaceId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await ClickUpApiService.getSpaces(workspaceId, false);
      setSpaces(response.spaces);
    } catch (err) {
      setError('Failed to load spaces. Please try again.');
      console.error('Error loading spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-clickup-primary" />
          <span className="text-gray-600">Loading spaces...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Spaces</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadSpaces} className="btn btn-primary">
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
          <h1 className="text-3xl font-bold text-gray-900">Spaces</h1>
          <p className="text-gray-600 mt-2">Organize your projects into spaces (read-only mode)</p>
        </div>
        <button
          disabled
          className="btn btn-secondary flex items-center space-x-2 opacity-50 cursor-not-allowed"
          title="This feature is currently disabled"
        >
          <Plus className="w-4 h-4" />
          <span>Create Space (Disabled)</span>
        </button>
      </div>

      {/* All modification features are disabled */}

      {spaces.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Spaces Found</h3>
          <p className="text-gray-600 mb-4">Create your first space to get started. (Note: Creation is currently disabled)</p>
          <button
            disabled
            className="btn btn-secondary opacity-50 cursor-not-allowed"
            title="This feature is currently disabled"
          >
            Create Space (Disabled)
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <div key={space.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: space.color || '#7B68EE' }}
                  >
                    {space.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {space.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      {space.private && (
                        <span className="flex items-center space-x-1">
                          <span>Private</span>
                        </span>
                      )}
                      {space.archived && (
                        <span className="flex items-center space-x-1">
                          <Archive className="w-3 h-3" />
                          <span>Archived</span>
                        </span>
                      )}
                    </div>
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
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {space.multiple_assignees ? 'Multiple assignees enabled' : 'Single assignee only'}
                </p>
                <Link
                  to={`/workspace/${workspaceId}/space/${space.id}/lists`}
                  className="block w-full btn btn-primary text-center"
                >
                  View Lists
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpacesPage;