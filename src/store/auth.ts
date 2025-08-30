import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/axios";
import router from "../router";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(localStorage.getItem("token") || "");
    const isAuth = ref(!!token.value);
    const user = ref<any>(null);

    const login = async (email: string, password: string) => {
        try {
            const res = await api.post("/login", { email, password });
            token.value = res.data.access_token;
            localStorage.setItem("token", token.value);
            isAuth.value = true;

            await fetchUser();
            router.push("/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        }
    };

    const logout = () => {
        token.value = "";
        isAuth.value = false;
        user.value = null;
        localStorage.removeItem("token");
        router.push("/login");
    };

    const fetchUser = async () => {
        if (!token.value) return;
        try {
            const res = await api.get("/me");
            user.value = res.data;
        } catch (err) {
            console.error("Fetch user failed:", err);
            logout();
        }
    };

    return { token, isAuth, user, login, logout, fetchUser };
});
