import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FolderOpen,
  Plus,
  Loader2,
  AlertCircle,
  Archive,
  ArrowRight,
  Lock,
  Users,
} from "lucide-react";
import { ClickUpApiService, type ClickUpSpace } from "../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const SpacesPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [spaces, setSpaces] = useState<ClickUpSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workspaceId) {
      loadSpaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const loadSpaces = async () => {
    if (!workspaceId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await ClickUpApiService.getSpaces(workspaceId, false);
      setSpaces(response.spaces);
    } catch (err) {
      setError("Failed to load spaces. Please try again.");
      console.error("Error loading spaces:", err);
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
              Loading spaces
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
              Error Loading Spaces
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={loadSpaces} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Spaces
          </h1>
          <p className="text-lg text-muted-foreground">
            Organize your projects into spaces
          </p>
        </div>
        <Button
          disabled
          variant="outline"
          className="opacity-50"
          title="This feature is currently disabled"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Space
        </Button>
      </div>

      {/* All modification features are disabled */}

      {spaces.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">No Spaces Found</CardTitle>
            <CardDescription className="max-w-sm mx-auto mb-6">
              Create your first space to get started organizing your projects.
            </CardDescription>
            <Button disabled variant="outline" className="opacity-50">
              <Plus className="w-4 h-4 mr-2" />
              Create Space
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {spaces.map((space, index) => (
            <Card
              key={space.id}
              className="hover:shadow-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer group border-0 shadow-soft"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link
                to={`/workspace/${workspaceId}/space/${space.id}/lists`}
                className="block"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                        style={{ backgroundColor: space.color || "#7B68EE" }}
                      >
                        {space.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="truncate group-hover:text-primary transition-colors">
                          {space.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {space.private && (
                            <Badge variant="secondary" className="text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              Private
                            </Badge>
                          )}
                          {space.archived && (
                            <Badge variant="outline" className="text-xs">
                              <Archive className="w-3 h-3 mr-1" />
                              Archived
                            </Badge>
                          )}
                        </div>
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
                        {space.multiple_assignees
                          ? "Multiple assignees"
                          : "Single assignee"}
                      </span>
                    </div>
                    <Badge variant="default" className="text-xs">
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

export default SpacesPage;
