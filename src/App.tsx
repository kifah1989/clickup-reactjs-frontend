import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WorkspacesPage from "./pages/WorkspacesPage";
import SpacesPage from "./pages/SpacesPage";
import ListsPage from "./pages/ListsPage";
import TasksPage from "./pages/TasksPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/workspaces" replace />}
                    />
                    <Route path="/workspaces" element={<WorkspacesPage />} />
                    <Route
                      path="/workspace/:workspaceId/spaces"
                      element={<SpacesPage />}
                    />
                    <Route
                      path="/workspace/:workspaceId/space/:spaceId/lists"
                      element={<ListsPage />}
                    />
                    <Route
                      path="/workspace/:workspaceId/space/:spaceId/list/:listId/tasks"
                      element={<TasksPage />}
                    />
                    <Route
                      path="/workspace/:workspaceId/space/:spaceId/list/:listId/task/:taskId"
                      element={<TaskDetailPage />}
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
