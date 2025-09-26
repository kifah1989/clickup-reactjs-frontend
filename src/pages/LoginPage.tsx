import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Loader2, AlertCircle, Info } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTestCredentials, setShowTestCredentials] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/workspaces");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const useTestCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-clickup-primary rounded-lg flex items-center justify-center">
            <LogIn className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/register"
            className="font-medium text-clickup-primary hover:text-clickup-hover"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-clickup-primary focus:border-clickup-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-clickup-primary focus:border-clickup-primary sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-clickup-primary hover:bg-clickup-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clickup-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setShowTestCredentials(!showTestCredentials)}
              className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Info className="w-4 h-4" />
              <span>Show test credentials</span>
            </button>

            {showTestCredentials && (
              <div className="mt-4 space-y-2 p-4 bg-gray-50 rounded-md">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Test Credentials:
                </p>
                <button
                  type="button"
                  onClick={() =>
                    useTestCredentials("admin@clickup-api.com", "Admin123!")
                  }
                  className="w-full text-left px-3 py-2 text-xs bg-white rounded border border-gray-200 hover:bg-gray-50"
                >
                  <strong>Admin:</strong> admin@clickup-api.com / Admin123!
                </button>
                <button
                  type="button"
                  onClick={() =>
                    useTestCredentials("editor@clickup-api.com", "Editor123!")
                  }
                  className="w-full text-left px-3 py-2 text-xs bg-white rounded border border-gray-200 hover:bg-gray-50"
                >
                  <strong>Editor:</strong> editor@clickup-api.com / Editor123!
                </button>
                <button
                  type="button"
                  onClick={() =>
                    useTestCredentials("viewer@clickup-api.com", "Viewer123!")
                  }
                  className="w-full text-left px-3 py-2 text-xs bg-white rounded border border-gray-200 hover:bg-gray-50"
                >
                  <strong>Viewer:</strong> viewer@clickup-api.com / Viewer123!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
