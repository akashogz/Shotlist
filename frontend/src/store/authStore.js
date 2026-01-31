import { create } from "zustand";
import api from "../lib/api/api.js";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    isLoggedIn: false,

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

    // 📝 signup
    signup: async (data) => {
        const res = await api.post("/auth/signup", data);
        set({ user: res.data.user });
    },

    handleSignUp: async (data) => {
        try {
            const res = await api.post("/auth/signup", data);

            set({
                user: res.data.user,
                isLoggedIn: true,
            });

            toast.success("Account created!");
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Signup failed";

            console.error(message);
            toast.error(message);
        }
    },


    // 🚪 logout
    logout: async () => {
        await api.post("/auth/logout");
        set({ user: null });
    },
}));
