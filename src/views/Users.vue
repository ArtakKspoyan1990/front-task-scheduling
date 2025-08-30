<template>
    <div class="mt-4 container">
        <h2 class="h5 fw-bold mb-3">Users</h2>

        <div
                v-for="u in store.users"
                :key="u.id"
                class="d-flex align-items-center justify-content-between mb-2 p-2 border rounded"
        >
            <span>{{ u.name }} ({{ u.role }})</span>
            <button
                    @click="toggleUserAvailability(u.id)"
                    class="btn btn-sm text-white"
                    :class="u.is_available ? 'btn-success' : 'btn-danger'"
            >
                {{ u.is_available ? "Available" : "Unavailable" }}
            </button>
        </div>

        <p v-if="store.users.length === 0" class="text-muted text-center">No users found</p>

        <div class="text-center mt-3" v-if="store.pagination.current_page < store.pagination.last_page">
            <button class="btn btn-outline-primary" @click="loadMore">Load More</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from "vue";
    import { useTaskStore } from "../store/tasks";

    const store = useTaskStore();

    onMounted(async () => {
        await store.fetchUsers();
    });

    const toggleUserAvailability = async (id: number) => {
        try {
            await store.toggleAvailability(id);
        } catch (err) {
            console.error("Failed to toggle availability:", err);
        }
    };

    const loadMore = async () => {
        await store.fetchUsers(store.pagination.current_page + 1, store.pagination.per_page);
    };
</script>
