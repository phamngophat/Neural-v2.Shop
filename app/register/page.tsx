"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        let isValid = true;
        const newErrors = { fullname: "", email: "", password: "", confirmPassword: "" };

        if (!formData.fullname) {
            newErrors.fullname = "Full name is required";
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

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required";
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);

            // Check for existing users
            const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
            const userExists = existingUsers.some((u: any) => u.email === formData.email);

            if (userExists) {
                setErrors((prev) => ({ ...prev, email: "This email is already registered" }));
                setIsSubmitting(false);
                return;
            }

            // Save new user
            const newUser = {
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password, // In a real app, hash this!
            };
            existingUsers.push(newUser);
            localStorage.setItem("users", JSON.stringify(existingUsers));

            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                alert("Account created successfully! Please login.");
                router.push("/login");
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

            <Card className="w-full max-w-[500px] border-none shadow-2xl bg-white/80 backdrop-blur-xl relative z-10 rounded-3xl p-8 sm:p-12">
                <div className="space-y-6 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                            Create Account
                        </h1>
                        <p className="text-neutral-500">
                            Join us and unlock new opportunities
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div className="space-y-2">
                            <Label htmlFor="fullname" className="text-neutral-700 font-medium ml-1">Full Name</Label>
                            <Input
                                id="fullname"
                                type="text"
                                placeholder="John Doe"
                                className={`h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.fullname ? "border-red-500 focus:ring-red-500/20" : ""}`}
                                value={formData.fullname}
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                            />
                            {errors.fullname && <p className="text-xs text-red-500 ml-1">{errors.fullname}</p>}
                        </div>

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

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-neutral-700 font-medium ml-1">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                className={`h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.confirmPassword ? "border-red-500 focus:ring-red-500/20" : ""}`}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 ml-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account..." : "Continue"}
                        </Button>
                    </form>

                    <p className="text-sm text-neutral-500">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                            Sign in
                        </Link>
                    </p>

                    <p className="text-xs text-neutral-400 mt-6 px-4 leading-relaxed">
                        By continuing, you acknowledge that you have read and accept the <a href="#" className="underline hover:text-neutral-500">Terms of Service</a> and <a href="#" className="underline hover:text-neutral-500">Privacy Policy</a>.
                    </p>
                </div>
            </Card>
        </main>
    );
}
