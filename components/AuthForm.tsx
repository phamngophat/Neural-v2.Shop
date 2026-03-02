"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

interface AuthFormProps {
    type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
            <AuthFormInner type={type} />
        </Suspense>
    );
}

function AuthFormInner({ type }: AuthFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const validate = () => {
        let isValid = true;
        const newErrors = { fullName: "", email: "", password: "", confirmPassword: "" };
        setServerError("");

        if (type === "register" && !formData.fullName) {
            newErrors.fullName = "Full name is required";
            isValid = false;
        }

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

        if (type === "register" && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            const supabase = createClient();

            if (type === "register") {
                const { data, error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.fullName,
                        }
                    }
                });

                setIsSubmitting(false);

                if (error) {
                    setServerError(error.message);
                } else if (data.user) {
                    alert("Account created successfully! You can now sign in.");
                    router.push("/login");
                }
            } else {
                // Login logic
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                setIsSubmitting(false);

                if (error) {
                    setServerError("Invalid email or password");
                } else if (data.user) {
                    window.dispatchEvent(new Event("authUpdated"));
                    const fullName = data.user.user_metadata?.full_name || "User";
                    alert(`Welcome back, ${fullName}!`);
                    router.push(redirectTo);
                    router.refresh();
                }
            }
        }
    };

    return (
        <div className="space-y-6 text-center">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                    {type === "login" ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-neutral-500">
                    {type === "login"
                        ? "Enter your credentials to access your account"
                        : "Join us and unlock new opportunities"}
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
                {type === "login" ? "Sign in with Google" : "Sign up with Google"}
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-neutral-400 font-medium">
                        Or {type === "login" ? "login with email" : "continue with email"}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {serverError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 text-center">
                        {serverError}
                    </div>
                )}

                {type === "register" && (
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-neutral-700 font-medium ml-1">Full Name</Label>
                        <Input
                            id="fullName"
                            placeholder="John Doe"
                            className={`h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${errors.fullName ? "border-red-500 focus:ring-red-500/20" : ""}`}
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                        {errors.fullName && <p className="text-xs text-red-500 ml-1">{errors.fullName}</p>}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-neutral-700 font-medium ml-1">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className={`h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-${type === "login" ? "indigo" : "violet"}-500/20 focus:border-${type === "login" ? "indigo" : "violet"}-500 transition-all ${errors.email ? "border-red-500 focus:ring-red-500/20" : ""}`}
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
                        className={`h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-${type === "login" ? "indigo" : "violet"}-500/20 focus:border-${type === "login" ? "indigo" : "violet"}-500 transition-all ${errors.password ? "border-red-500 focus:ring-red-500/20" : ""}`}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
                </div>

                {type === "register" && (
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-neutral-700 font-medium ml-1">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className={`h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${errors.confirmPassword ? "border-red-500 focus:ring-red-500/20" : ""}`}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                        {errors.confirmPassword && <p className="text-xs text-red-500 ml-1">{errors.confirmPassword}</p>}
                    </div>
                )}

                {type === "login" && (
                    <div className="flex items-center justify-end">
                        <Link
                            href="#"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Forgot password?
                        </Link>
                    </div>
                )}

                <Button
                    type="submit"
                    className={`w-full h-12 rounded-xl bg-gradient-to-r text-white font-semibold shadow-lg transition-all transform active:scale-95 ${type === "login"
                        ? "from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/30"
                        : "from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-violet-500/30"
                        }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? (type === "login" ? "Signing in..." : "Creating account...")
                        : "Continue"}
                </Button>
            </form>

            <p className="text-sm text-neutral-500">
                {type === "login" ? (
                    <>
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                            Sign up
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-500 transition-colors">
                            Sign In
                        </Link>
                    </>
                )}
            </p>

            <p className="text-xs text-neutral-400 mt-6 px-4 leading-relaxed">
                By continuing, you acknowledge that you have read and accept the <a href="#" className="underline hover:text-neutral-500">Terms of Service</a> and <a href="#" className="underline hover:text-neutral-500">Privacy Policy</a>.
            </p>
        </div>
    );
}
