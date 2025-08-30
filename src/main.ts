import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { useAuthStore } from "./store/auth";
import { useNotificationStore } from "./store/notification";
import echo from "./echo";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

const auth = useAuthStore();
const notificationStore = useNotificationStore();


(async () => {
    if (localStorage.getItem("token")) {
        try {
            await auth.fetchUser();

            if (auth.isAuth && auth.user) {
                await notificationStore.fetchNotifications();
                echo.channel(`user.${auth.user?.id}`)
                    .listen(".task-assigned", (event) => {
                        console.log("New notification:", event.notification);
                        notificationStore.addNotification(event.notification);
                    });
            }
        } catch (err) {
            console.error("Failed to initialize app:", err);
        }
    }

    app.mount("#app");
})();
