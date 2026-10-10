import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Login
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to access your dashboard
          </p>
        </div>
        <div className="flex justify-center">
          <SignIn
            routing="path"
            path="/admin/login"
            withSignUp
            forceRedirectUrl="/admin"
            fallbackRedirectUrl="/admin"
          />
        </div>
      </div>
    </div>
  );
}
