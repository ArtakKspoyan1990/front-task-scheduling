// store/tasks.ts
import { defineStore } from "pinia";
import api from "../api/axios";

export const useTaskStore = defineStore("tasks", {
    state: () => ({
        tasks: [] as any[],
        users: [] as any[],
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
        },
        loading: false,
        filters: {
            q: "",
            status: "",
            assignee: "",
        },
    }),

    actions: {
        async fetchTasks(page = 1, append = false) {
            this.loading = true;
            try {
                const res = await api.get("/tasks", {
                    params: {
                        page,
                        per_page: this.pagination.per_page,
                        q: this.filters.q,
                        status: this.filters.status,
                        assignee: this.filters.assignee,
                    },
                });

                if (append) {
                    this.tasks.push(...res.data.data);
                } else {
                    this.tasks = res.data.data;
                }

                this.pagination.current_page = res.data.current_page;
                this.pagination.last_page = res.data.last_page;
            } finally {
                this.loading = false;
            }
        },

        async fetchMyTasks(page = 1, append = false) {
            this.loading = true;
            try {
                const res = await api.get("/my-tasks", {
                    params: {
                        page,
                        per_page: this.pagination.per_page,
                    },
                });

                if (append) {
                    this.tasks.push(...res.data.data);
                } else {
                    this.tasks = res.data.data;
                }

                this.pagination.current_page = res.data.current_page;
                this.pagination.last_page = res.data.last_page;
            } finally {
                this.loading = false;
            }
        },

        async createTask(data: any) {
            await api.post("/tasks", data);
            await this.fetchTasks(1); // refresh first page
        },

        async updateTask(id: number, data: any) {
            await api.put(`/tasks/${id}`, data);
            await this.fetchTasks(this.pagination.current_page);
        },

        async deleteTask(id: number) {
            await api.delete(`/tasks/${id}`);
            await this.fetchTasks(this.pagination.current_page);
        },

        async fetchUsers(page = 1, perPage = 10) {
            const res = await api.get("/users", {
                params: { page, per_page: perPage }
            });

            this.users = res.data.data; // pagination data
            this.pagination = {
                current_page: res.data.current_page,
                last_page: res.data.last_page,
                per_page: res.data.per_page,
            };
        },

        async toggleAvailability(id: number) {
            await api.put(`/users/${id}/toggle-availability`);
            await this.fetchUsers();
        },

        resetFilters() {
            this.filters = { q: "", status: "", assignee: "" };
        },

        resetTasks() {
            this.tasks = [];
            this.pagination = { current_page: 1, last_page: 1, per_page: 10 };
        },
    },
});
