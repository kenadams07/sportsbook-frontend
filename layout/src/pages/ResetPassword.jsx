import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import API from "../utils/api";

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState("");

    // Extract token from URL query parameters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenParam = searchParams.get("token");
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            toast.error("Invalid reset link. Token is missing.");
            navigate("/login");
        }
    }, [location, navigate]);

    const validateForm = () => {
        if (!password) {
            toast.error("Please enter a new password");
            return false;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await API.post("/users/reset-password", {
                token,
                newPassword: password
            });

            if (response.data.code === 200) {
                toast.success("Password reset successfully!");
             
                setTimeout(() => {
                    navigate("/?login=true");
                }, 2000);
            } else {
                toast.error(response.data.message || "Failed to reset password");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error(error.response?.data?.message || "Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-[#2a2a2a] rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-black font-bold text-lg">S</span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Reset Your Password</h1>
                        <p className="text-gray-400 text-sm">
                            Enter your new password below to reset your account password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>

                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="bg-[#404040] border-gray-600 text-white placeholder-gray-400"
                            />
                        </div>

                        <div>

                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                className="bg-[#404040] border-gray-600 text-white placeholder-gray-400"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-base disabled:opacity-50"
                        >
                            {isLoading ? "Resetting Password..." : "Reset Password"}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-600 text-center">
                        <Button
                            onClick={() => navigate("/login")}
                            variant="ghost"
                            className="text-gray-400 hover:text-white text-sm font-medium hover:bg-[#404040]"
                        >
                            Back to Login
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
