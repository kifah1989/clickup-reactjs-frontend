import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  Settings,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

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

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "EDITOR":
        return "bg-blue-100 text-blue-800";
      case "VIEWER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <Link to="/workspaces" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-clickup-primary rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  ClickUp Manager
                </span>
              </Link>

              {/* Back Button */}
              {canGoBack && (
                <Link
                  to={previousPath}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Link>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.email}
                        </p>
                        <span
                          className={`inline-flex mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(
                            user?.role
                          )}`}
                        >
                          {user?.role}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-3 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && <span className="text-gray-400">/</span>}
                  <Link
                    to={crumb.path}
                    className={`${
                      index === breadcrumbs.length - 1
                        ? "text-gray-900 font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    } transition-colors`}
                  >
                    {crumb.name}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
