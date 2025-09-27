import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { ClickUpApiService, type ClickUpWorkspace } from "../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

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
      setError(
        "Failed to load workspaces. Please check your API configuration."
      );
      console.error("Error loading workspaces:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">
              Loading workspaces
            </p>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-destructive">
              Error Loading Workspaces
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={loadWorkspaces} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Your Workspaces
        </h1>
        <p className="text-lg text-muted-foreground">
          Select a workspace to view its spaces and manage tasks
        </p>
      </div>

      {workspaces.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">No Workspaces Found</CardTitle>
            <CardDescription className="max-w-sm mx-auto">
              You don't have access to any workspaces. Please contact your
              administrator to get access.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
            >
              <Link to={`/workspace/${workspace.id}/spaces`} className="block">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {workspace.avatar ? (
                        <img
                          src={workspace.avatar}
                          alt={workspace.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                          style={{
                            backgroundColor: workspace.color || "#7B68EE",
                          }}
                        >
                          {workspace.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="truncate group-hover:text-primary transition-colors">
                          {workspace.name}
                        </CardTitle>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {workspace.members?.length || 0} member
                        {workspace.members?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspacesPage;
