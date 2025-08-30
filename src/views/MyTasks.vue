<script setup lang="ts">
    import { onMounted } from "vue";
    import { useTaskStore } from "../store/tasks";

    const store = useTaskStore();

    async function fetchPage(page = 1) {
        await store.fetchMyTasks(page);
    }

    onMounted(() => {
        fetchPage();
    });
</script>

<template>
    <div class="container mt-4">
        <h2 class="fw-bold mb-3">My Tasks</h2>

        <div v-if="store.tasks.length > 0" class="list-group">
            <div v-for="task in store.tasks" :key="task.id" class="list-group-item">
                <h6 class="mb-1">{{ task.title }}</h6>
                <p class="mb-1 text-muted small">{{ task.description }}</p>
                <p class="badge bg-success me-1">Due: {{ task.due_at }}</p>
                <p class="badge bg-secondary">{{ task.status }}</p>
            </div>
        </div>

        <p v-else class="text-muted">You don’t have any tasks assigned.</p>

        <!-- Pagination -->
        <nav v-if="store.pagination.last_page > 1" class="mt-3">
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: store.pagination.current_page === 1 }">
                    <button class="page-link" @click="fetchPage(store.pagination.current_page - 1)">Prev</button>
                </li>
                <li
                        v-for="page in store.pagination.last_page"
                        :key="page"
                        class="page-item"
                        :class="{ active: store.pagination.current_page === page }"
                >
                    <button class="page-link" @click="fetchPage(page)">{{ page }}</button>
                </li>
                <li
                        class="page-item"
                        :class="{ disabled: store.pagination.current_page === store.pagination.last_page }"
                >
                    <button class="page-link" @click="fetchPage(store.pagination.current_page + 1)">Next</button>
                </li>
            </ul>
        </nav>
    </div>
</template>
