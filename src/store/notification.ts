import { defineStore } from "pinia";
import api from "../api/axios";

export const useNotificationStore = defineStore("notifications", {
    state: () => ({
        notifications: [] as any[],
        loading: false,
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
        },
    }),

    getters: {
        unreadCount(state) {
            return state.notifications.filter(n => !n.read).length;
        },
    },

    actions: {
        async fetchNotifications(page = 1, append = false) {
            this.loading = true;
            try {
                const res = await api.get("/notifications", {
                    params: {
                        page,
                        per_page: this.pagination.per_page,
                    },
                });

                if (append) {
                    this.notifications.push(...res.data.data);
                } else {
                    this.notifications = res.data.data;
                }

                this.pagination.current_page = res.data.current_page;
                this.pagination.last_page = res.data.last_page;
            } finally {
                this.loading = false;
            }
        },

        async markAsRead(id: number) {
            await api.post(`/notifications/${id}/read`);
            const index = this.notifications.findIndex(n => n.id === id);
            if (index !== -1) this.notifications[index].read = true;
        },

        addNotification(notification: any) {
            this.notifications.unshift(notification);
        },

        resetNotifications() {
            this.notifications = [];
            this.pagination = { current_page: 1, last_page: 1, per_page: 10 };
        },
    },
});
