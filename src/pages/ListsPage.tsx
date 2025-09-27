import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  List,
  Plus,
  Loader2,
  AlertCircle,
  Archive,
  ArrowRight,
  CheckSquare,
  Calendar,
  User,
} from "lucide-react";
import { ClickUpApiService, type ClickUpList } from "../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const ListsPage: React.FC = () => {
  const { workspaceId, spaceId } = useParams<{
    workspaceId: string;
    spaceId: string;
  }>();
  const [lists, setLists] = useState<ClickUpList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (spaceId) {
      loadLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceId]);

  const loadLists = async () => {
    if (!spaceId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await ClickUpApiService.getListsBySpace(spaceId, false);
      setLists(response.lists);
    } catch (err) {
      setError("Failed to load lists. Please try again.");
      console.error("Error loading lists:", err);
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
            <p className="text-lg font-medium text-foreground">Loading lists</p>
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
              Error Loading Lists
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={loadLists} className="w-full">
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
            Lists
          </h1>
          <p className="text-lg text-muted-foreground">
            Organize your tasks into lists
          </p>
        </div>
        <Button
          disabled
          variant="outline"
          className="opacity-50"
          title="This feature is currently disabled"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create List
        </Button>
      </div>

      {/* All modification features are disabled */}

      {lists.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <List className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">No Lists Found</CardTitle>
            <CardDescription className="max-w-sm mx-auto mb-6">
              No lists available in this space. Create your first list to start
              organizing tasks.
            </CardDescription>
            <Button disabled variant="outline" className="opacity-50">
              <Plus className="w-4 h-4 mr-2" />
              Create List
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Card
              key={list.id}
              className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
            >
              <Link
                to={`/workspace/${workspaceId}/space/${spaceId}/list/${list.id}/tasks`}
                className="block"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate group-hover:text-primary transition-colors flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-primary" />
                        {list.name}
                      </CardTitle>
                      <div className="flex items-center gap-3 mt-2">
                        {list.task_count !== undefined && (
                          <Badge variant="secondary" className="text-xs">
                            {list.task_count} task
                            {list.task_count !== 1 ? "s" : ""}
                          </Badge>
                        )}
                        {list.archived && (
                          <Badge variant="outline" className="text-xs">
                            <Archive className="w-3 h-3 mr-1" />
                            Archived
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {list.assignee && (
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-sm"
                        style={{
                          backgroundColor: list.assignee.color || "#6B7280",
                        }}
                      >
                        {(list.assignee.username || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{list.assignee.username || "Unknown User"}</span>
                      </div>
                    </div>
                  )}

                  {list.due_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-muted/30">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Due:{" "}
                        {new Date(parseInt(list.due_date)).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListsPage;
