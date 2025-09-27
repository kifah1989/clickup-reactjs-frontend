import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckSquare,
  Plus,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  ExternalLink,
  Flag,
} from "lucide-react";
import { ClickUpApiService, type ClickUpTask } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

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

  useEffect(() => {
    if (listId) {
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "to do":
      case "open":
        return "outline";
      case "in progress":
        return "default";
      case "complete":
      case "closed":
        return "secondary";
      case "review":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityVariant = (
    priority: number
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case 1:
        return "destructive";
      case 2:
        return "default";
      case 3:
        return "secondary";
      case 4:
        return "outline";
      default:
        return "secondary";
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
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">Loading tasks</p>
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
              Error Loading Tasks
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={loadTasks} className="w-full">
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
            Tasks
          </h1>
          <p className="text-lg text-muted-foreground">
            {canCreate
              ? "Manage and track your tasks"
              : "View your tasks (read-only mode)"}
          </p>
        </div>
        {canCreate && (
          <Button
            disabled
            variant="outline"
            className="opacity-50"
            title="This feature is coming soon"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        )}
      </div>

      {tasks.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <CheckSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">No Tasks Found</CardTitle>
            <CardDescription className="max-w-sm mx-auto mb-6">
              {canCreate
                ? "No tasks in this list yet. Create your first task to get started."
                : "No tasks available in this list."}
            </CardDescription>
            {canCreate && (
              <Button disabled variant="outline" className="opacity-50">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl mb-2 leading-tight">
                      {task.name}
                    </CardTitle>
                    {task.description && (
                      <CardDescription className="text-base line-clamp-2 mb-4">
                        {task.description}
                      </CardDescription>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status */}
                      <Badge variant={getStatusVariant(task.status.status)}>
                        {task.status.status}
                      </Badge>

                      {/* Priority */}
                      {task.priority && task.priority.priority && (
                        <Badge
                          variant={getPriorityVariant(
                            parseInt(task.priority.priority)
                          )}
                        >
                          <Flag className="w-3 h-3 mr-1" />
                          {getPriorityText(parseInt(task.priority.priority))}
                        </Badge>
                      )}

                      {/* Due Date */}
                      {task.due_date && (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(
                            parseInt(task.due_date)
                          ).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Assignees */}
                    {task.assignees && task.assignees.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div className="flex -space-x-1">
                          {task.assignees.slice(0, 3).map((assignee) => (
                            <div
                              key={assignee.id}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-bold border-2 border-background"
                              style={{
                                backgroundColor: assignee.color || "#6B7280",
                              }}
                              title={assignee.username || "Unknown User"}
                            >
                              {(assignee.username || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          ))}
                          {task.assignees.length > 3 && (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-muted-foreground bg-muted border-2 border-background">
                              +{task.assignees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button asChild size="sm">
                      <Link
                        to={`/workspace/${workspaceId}/space/${spaceId}/list/${listId}/task/${task.id}`}
                      >
                        View Details
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>

                    {task.url && (
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={task.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ClickUp
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
