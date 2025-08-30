import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";

const Login = () => import("../views/Login.vue");
const Dashboard = () => import("../views/Dashboard.vue");
const Users = () => import("../views/Users.vue");
const Tasks = () => import("../views/Tasks.vue");
const MyTasks = () => import("../views/MyTasks.vue");
const Notifications = () => import("../views/Notifications.vue");

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "Login", component: Login },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { requiresAuth: true, roles: ["manager"] },
    },
    {
        path: "/users",
        name: "Users",
        component: Users,
        meta: { requiresAuth: true, roles: ["manager"] },
    },
    {
        path: "/tasks",
        name: "Tasks",
        component: Tasks,
        meta: { requiresAuth: true, roles: ["manager"] },
    },
    {
        path: "/my-tasks",
        name: "MyTasks",
        component: MyTasks,
        meta: { requiresAuth: true, roles: ["customer", "manager"] },
    },
    {
        path: "/notifications",
        name: "Notifications",
        component: Notifications,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Role-based guard
router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();

    // If we have a token but user is not loaded yet, fetch user first
    if (localStorage.getItem("token") && !auth.user) {
        try {
            await auth.fetchUser();
        } catch (err) {
            console.error("Failed to fetch user:", err);
            auth.logout();
            return next({ name: "Login" });
        }
    }

    const userRole = auth.user?.role;

    if (to.meta.requiresAuth && !auth.isAuth) {
        return next({ name: "Login" });
    }

    if (to.name === "Login" && auth.isAuth) {
        return userRole === "manager" ? next({ name: "Dashboard" }) : next({ name: "MyTasks" });
    }

    if (to.meta.roles && !to.meta.roles.includes(userRole)) {
        return userRole === "manager" ? next({ name: "Dashboard" }) : next({ name: "MyTasks" });
    }

    next();
});

export default router;
