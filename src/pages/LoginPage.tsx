import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Info, CheckSquare } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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
    } catch (err: unknown) {
      const errorMessage = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      setError(errorMessage || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-large">
            <CheckSquare className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>
        <div className="mt-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Sign in to your ClickUp Manager account
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <Card className="py-10 px-8 shadow-large border-0 bg-card/50 backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-11"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div className="text-sm font-medium text-destructive">
                    {error}
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowTestCredentials(!showTestCredentials)}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <Info className="w-4 h-4 mr-2" />
              {showTestCredentials ? "Hide" : "Show"} test credentials
            </Button>

            {showTestCredentials && (
              <div className="mt-4 space-y-3 p-4 bg-muted/30 rounded-lg border">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Test Credentials:
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    fillTestCredentials("admin@clickup-api.com", "Admin123!")
                  }
                  className="w-full justify-start h-auto p-3 text-left"
                >
                  <div>
                    <div className="font-medium text-sm">Admin Account</div>
                    <div className="text-xs text-muted-foreground">
                      admin@clickup-api.com / Admin123!
                    </div>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    fillTestCredentials("editor@clickup-api.com", "Editor123!")
                  }
                  className="w-full justify-start h-auto p-3 text-left"
                >
                  <div>
                    <div className="font-medium text-sm">Editor Account</div>
                    <div className="text-xs text-muted-foreground">
                      editor@clickup-api.com / Editor123!
                    </div>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    fillTestCredentials("viewer@clickup-api.com", "Viewer123!")
                  }
                  className="w-full justify-start h-auto p-3 text-left"
                >
                  <div>
                    <div className="font-medium text-sm">Viewer Account</div>
                    <div className="text-xs text-muted-foreground">
                      viewer@clickup-api.com / Viewer123!
                    </div>
                  </div>
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
