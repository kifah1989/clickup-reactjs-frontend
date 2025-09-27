import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Settings,
  User,
  LogOut,
  ChevronDown,
  CheckSquare,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./theme-toggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment);
    const breadcrumbs = [];

    // Always start with workspaces
    breadcrumbs.push({ name: "Workspaces", path: "/workspaces" });

    if (pathSegments.length >= 2 && pathSegments[0] === "workspace") {
      breadcrumbs.push({
        name: "Spaces",
        path: `/${pathSegments.slice(0, 3).join("/")}`,
      });
    }

    if (pathSegments.length >= 4 && pathSegments[2] === "space") {
      breadcrumbs.push({
        name: "Lists",
        path: `/${pathSegments.slice(0, 5).join("/")}`,
      });
    }

    if (pathSegments.length >= 6 && pathSegments[4] === "list") {
      breadcrumbs.push({
        name: "Tasks",
        path: `/${pathSegments.slice(0, 7).join("/")}`,
      });
    }

    if (pathSegments.length >= 8 && pathSegments[6] === "task") {
      breadcrumbs.push({ name: "Task Detail", path: location.pathname });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const canGoBack = breadcrumbs.length > 1;
  const previousPath = canGoBack
    ? breadcrumbs[breadcrumbs.length - 2].path
    : "/workspaces";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <Link
                to="/workspaces"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                  <CheckSquare className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">
                    ClickUp Manager
                  </span>
                  <span className="text-xs text-muted-foreground -mt-1">
                    Task Management
                  </span>
                </div>
              </Link>

              {/* Back Button */}
              {canGoBack && (
                <div className="hidden sm:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Link to={previousPath} className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-4 h-4" />
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3"
                >
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium">{user?.email}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-card rounded-lg shadow-lg ring-1 ring-border z-50">
                    <div className="p-4 border-b border-border">
                      <p className="text-sm font-medium text-card-foreground">
                        {user?.email}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {user?.role}
                      </Badge>
                    </div>
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <div className="border-b bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-3">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && (
                    <span className="text-muted-foreground text-sm">/</span>
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-sm font-medium text-foreground">
                      {crumb.name}
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-auto p-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Link to={crumb.path}>{crumb.name}</Link>
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
