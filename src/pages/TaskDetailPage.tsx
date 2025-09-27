import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  ExternalLink,
  Edit3,
  Flag,
  Users,
  Tag,
  MapPin,
  Timer,
} from "lucide-react";
import { ClickUpApiService, type ClickUpTask } from "../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const loadTask = async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);
      const taskData = await ClickUpApiService.getTaskById(taskId);
      setTask(taskData);
    } catch (err) {
      setError("Failed to load task. Please try again.");
      console.error("Error loading task:", err);
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
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">Loading task</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch the details
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-destructive">
              Error Loading Task
            </CardTitle>
            <CardDescription>{error || "Task not found"}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <Button onClick={loadTask} className="w-full">
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  `/workspace/${workspaceId}/space/${spaceId}/list/${listId}/tasks`
                )
              }
              className="w-full"
            >
              Back to Tasks
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              navigate(
                `/workspace/${workspaceId}/space/${spaceId}/list/${listId}/tasks`
              )
            }
            title="Back to tasks"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Task Details
            </h1>
            <p className="text-lg text-muted-foreground">
              View detailed task information
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {task.url && (
            <Button variant="outline" asChild>
              <a href={task.url} target="_blank" rel="noopener noreferrer">
                Open in ClickUp
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          )}

          <Button
            disabled
            variant="outline"
            className="opacity-50"
            title="Edit functionality is currently disabled"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Task
          </Button>
        </div>
      </div>

      {/* Task Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Name & Status */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-3">{task.name}</CardTitle>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusVariant(task.status.status)}>
                      {task.status.status}
                    </Badge>
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
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {task.description ? (
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No description provided
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Custom Fields */}
          {task.custom_fields && task.custom_fields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {task.custom_fields.map((field, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-border last:border-b-0"
                    >
                      <span className="text-muted-foreground font-medium">
                        {field.name}
                      </span>
                      <span className="text-foreground">
                        {field.value || "Not set"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground text-sm">Created</span>
                <span className="text-sm font-medium">
                  {new Date(parseInt(task.date_created)).toLocaleDateString()}
                </span>
              </div>

              {task.start_date && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground text-sm">
                    Start Date
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(parseInt(task.start_date)).toLocaleDateString()}
                  </span>
                </div>
              )}

              {task.due_date && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground text-sm">
                    Due Date
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(parseInt(task.due_date)).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground text-sm">
                  Last Updated
                </span>
                <span className="text-sm font-medium">
                  {new Date(parseInt(task.date_updated)).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Assignees */}
          {task.assignees && task.assignees.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Assignees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {task.assignees.map((assignee) => (
                  <div
                    key={assignee.id}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm text-white font-bold shadow-sm"
                      style={{ backgroundColor: assignee.color || "#6B7280" }}
                    >
                      {(assignee.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {assignee.username || "Unknown User"}
                      </div>
                      {assignee.email && (
                        <div className="text-xs text-muted-foreground">
                          {assignee.email}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Time Tracking */}
          {(task.time_estimate || task.time_spent || task.points) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Time & Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {task.time_estimate && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground text-sm">
                      Estimated
                    </span>
                    <span className="text-sm font-medium">
                      {formatTime(task.time_estimate)}
                    </span>
                  </div>
                )}
                {task.time_spent && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground text-sm">
                      Time Spent
                    </span>
                    <span className="text-sm font-medium">
                      {formatTime(task.time_spent)}
                    </span>
                  </div>
                )}
                {task.points && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground text-sm">
                      Story Points
                    </span>
                    <Badge variant="outline">{task.points}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs"
                      style={{
                        backgroundColor: tag.tag_bg + "20",
                        color: tag.tag_fg,
                        borderColor: tag.tag_bg,
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground text-sm">List</span>
                <span className="text-sm font-medium">{task.list.name}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground text-sm">Project</span>
                <span className="text-sm font-medium">{task.project.name}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground text-sm">Folder</span>
                <span className="text-sm font-medium">{task.folder.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
