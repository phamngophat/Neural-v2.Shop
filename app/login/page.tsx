"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);

      // Verify credentials
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u: any) => u.email === formData.email && u.password === formData.password
      );

      setTimeout(() => {
        setIsSubmitting(false);
        if (user) {
          localStorage.setItem("isLoggedIn", "true"); // Set auth flag
          // Optional: Store current user info
          localStorage.setItem("currentUser", JSON.stringify(user));

          // Notify Navbar to update (Show Search & User Info immediately)
          window.dispatchEvent(new Event("authUpdated"));

          alert(`Welcome back, ${user.fullname}! Redirection to home...`);
          router.push("/");
        } else {
          alert("Invalid email or password"); // Simple alert for specific requirement, or use setErrors
          // Better UX: set state error, but alert is often requested in simple labs. 
          // Let's also set a form error for better UI if possible, or just the alert as per typical Lab instructions often asking for "Error message".
          // The strict requirement earlier was "Email trống -> message". For wrong credentials, standard is a general error.
          // Let's stick to the alert as it's clear for "Invalid credentials" in this context unless the user asked for inline error for credentials specifically.
          // Re-reading: "Error hiển thị rõ ràng gần input không?" -> Ideally inline.
          setErrors((prev) => ({ ...prev, password: "Invalid email or password" }));
        }
      }, 1000);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FD]">
      {/* Background blobs for color */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-pink-200/40 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-[450px] border-none shadow-2xl bg-white/80 backdrop-blur-xl relative z-10 rounded-3xl p-8 sm:p-12">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Welcome Back
            </h1>
            <p className="text-neutral-500">
              Enter your credentials to access your account
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50 hover:text-neutral-900 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-400 font-medium">
                Or login with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-700 font-medium ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.email ? "border-red-500 focus:ring-red-500/20" : ""}`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-700 font-medium ml-1">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.password ? "border-red-500 focus:ring-red-500/20" : ""}`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="#"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </Button>
          </form>

          <p className="text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign up
            </Link>
          </p>

          <p className="text-xs text-neutral-400 mt-6 px-4 leading-relaxed">
            By clicking &apos;Continue&apos;, you acknowledge that you have read and accept the <a href="#" className="underline hover:text-neutral-500">Terms of Service</a> and <a href="#" className="underline hover:text-neutral-500">Privacy Policy</a>.
          </p>
        </div>
      </Card>
    </main>
  );
}
