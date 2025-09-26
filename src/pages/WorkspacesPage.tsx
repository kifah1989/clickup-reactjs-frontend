import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Loader2, AlertCircle } from 'lucide-react';
import { ClickUpApiService, type ClickUpWorkspace } from '../services/api';

const WorkspacesPage: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<ClickUpWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ClickUpApiService.getWorkspaces();
      setWorkspaces(response.teams);
    } catch (err) {
      setError('Failed to load workspaces. Please check your API configuration.');
      console.error('Error loading workspaces:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-clickup-primary" />
          <span className="text-gray-600">Loading workspaces...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Workspaces</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadWorkspaces}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Workspaces</h1>
        <p className="text-gray-600 mt-2">Select a workspace to view its spaces and manage tasks</p>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Workspaces Found</h3>
          <p className="text-gray-600">You don't have access to any workspaces.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              to={`/workspace/${workspace.id}/spaces`}
              className="card p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start space-x-4">
                {workspace.avatar ? (
                  <img
                    src={workspace.avatar}
                    alt={workspace.name}
                    className="w-12 h-12 rounded-lg"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: workspace.color || '#7B68EE' }}
                  >
                    {workspace.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {workspace.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mt-2">
                    <Users className="w-4 h-4" />
                    <span>{workspace.members?.length || 0} members</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspacesPage;