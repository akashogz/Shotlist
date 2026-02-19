import { create } from "zustand";
import api from "../lib/api/api.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    user: null,
    profile: null,
    loading: true,
    isLoggedIn: false,
    setUser: (user) => set({
        user, 
        isLoggedIn: !!user
    }),

    fetchMe: async () => {
        try {
            const res = await api.get("auth/me");
            set({ user: res.data });
        } catch {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },
    
    fetchProfile: async (username) => {
        try {
            set({ loading: true });
            const res = await api.get(`/auth/profile/${username}`);
            set({ profile: res.data });
        } catch (error) {
            console.error("Fetch profile error:", error);
            set({ profile: null });
        } finally {
            set({ loading: false });
        }
    },

    handleSignUp: async (data) => {
        try {
            set({ loading: true });
            const res = await api.post("/auth/signup", data);
            set({ 
                user: res.data.user, 
                isLoggedIn: true 
            });
            toast.success("Account created!");
        } catch (err) {
            const message = err.response?.data?.message || "Signup failed";
            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },

    handleLogin: async (data) => {
        try {
            set({ loading: true });
            console.log(data)
            const res = await api.post("/auth/login", data);
            set({ user: res.data.user, isLoggedIn: true });
            toast.success("Welcome back!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            set({ loading: false });
        }
    },
    
    logout: async () => {
        try {
            await api.get("/auth/logout");
            set({ user: null, isLoggedIn: false, profile: null });
            toast.success("Logged out");
        } catch (error) {
            console.error("Logout error", error);
        }
    },
}));