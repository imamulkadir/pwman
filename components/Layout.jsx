import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { LogOut, Settings, Shield } from "lucide-react";

export function Header({ user, onSignOut, onSettings }) {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Password Manager
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="text-sm text-gray-600 hidden sm:block">
                  <p className="font-medium text-gray-900">
                    {user.displayName}
                  </p>
                  <p>{user.email}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onSettings}
                  title="Settings"
                  className="hover:bg-gray-100/50"
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onSignOut}
                  title="Sign Out"
                  className="hover:bg-gray-100/50"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function EmptyState({ title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <span className="text-4xl">🔐</span>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      {action && (
        <Button onClick={action} className="btn-apple">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">
          Loading your secure vault...
        </p>
      </div>
    </div>
  );
}

export function ErrorState({ title, description, onRetry }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="card-apple w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} className="w-full btn-apple">
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
