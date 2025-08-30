<template>
    <div class="container mt-4">
        <!-- Top bar with Create button and filters -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 class="fw-bold">Task Board</h2>
            <div class="d-flex gap-2 flex-wrap">
                <input
                        type="text"
                        v-model="store.filters.q"
                        placeholder="Search by title or description"
                        class="form-control"
                        @input="applyFilters"
                />
                <select v-model="store.filters.status" class="form-select" @change="applyFilters">
                    <option value="">All Statuses</option>
                    <option v-for="status in statuses" :key="status" :value="status">
                        {{ status.replace('_', ' ') }}
                    </option>
                </select>
                <select v-model="store.filters.assignee" class="form-select" @change="applyFilters">
                    <option value="">All Assignees</option>
                    <option v-for="u in store.users" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
                <button class="btn btn-secondary" @click="clearFilters">Clear Filters</button>
                <button class="btn btn-success" @click="openCreateModal">+ Create Task</button>
            </div>
        </div>

        <!-- Task columns -->
        <div class="row g-4">
            <div class="col-md-4" v-for="status in statuses" :key="status">
                <div class="card h-100 border-0 shadow-sm">
                    <div
                            class="card-header text-white fw-bold text-capitalize"
                            :class="{
              'bg-secondary': status === 'todo',
              'bg-primary': status === 'in_progress',
              'bg-success': status === 'done',
            }"
                    >
                        {{ status.replace('_', ' ') }}
                    </div>
                    <div class="card-body">
                        <div
                                v-for="task in tasksByStatus(status)"
                                :key="task.id"
                                class="card mb-3 border-light shadow-sm"
                        >
                            <div class="card-body p-3">
                                <h6 class="fw-semibold mb-1">{{ task.title }}</h6>
                                <p class="text-muted mb-1 small">{{ task.description }}</p>
                                <p class="text-muted mb-0 small">
                                    Assigned: {{ task.assignee?.name || "Unassigned" }}
                                </p>
                                <p class="text-muted mb-0 small">Due Date: {{ task.due_at }}</p>
                                <div class="mt-2 d-flex gap-2">
                                    <button class="btn btn-sm btn-outline-primary" @click="openEditModal(task)">
                                        Edit
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="deleteTask(task.id)">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p v-if="tasksByStatus(status).length === 0" class="text-muted small text-center">
                            No tasks
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loader -->
        <div v-if="store.loading" class="text-center my-3">
            <div class="spinner-border text-primary"></div>
        </div>

        <!-- Modal wrapper -->
        <div class="modal fade" id="taskModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content p-3">
                    <TaskModal :task="selectedTask" @close="closeModal" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue";
    import { useTaskStore } from "../store/tasks.ts";
    import TaskModal from "../components/TaskModal.vue";
    import { Modal } from "bootstrap";

    const store = useTaskStore();
    const statuses = ["todo", "in_progress", "done"];
    const selectedTask = ref<any | null>(null);

    onMounted(async () => {
        await store.fetchUsers();
        await store.fetchTasks(); // first load
        window.addEventListener("scroll", handleScroll);
    });

    onBeforeUnmount(() => {
        window.removeEventListener("scroll", handleScroll);
    });

    // helpers
    const tasksByStatus = (status: string) =>
        store.tasks.filter((t) => t.status === status);

    // modal control
    function getModalInstance() {
        const el = document.getElementById("taskModal");
        return el ? Modal.getOrCreateInstance(el) : null;
    }

    function openCreateModal() {
        selectedTask.value = null;
        getModalInstance()?.show();
    }

    function openEditModal(task: any) {
        selectedTask.value = task;
        getModalInstance()?.show();
    }

    function closeModal() {
        getModalInstance()?.hide();
        selectedTask.value = null;
    }

    // actions
    async function deleteTask(id: number) {
        if (confirm("Are you sure you want to delete this task?")) {
            await store.deleteTask(id);
        }
    }

    function clearFilters() {
        store.resetFilters();
        store.fetchTasks(1);
    }

    function applyFilters() {
        store.resetTasks();
        store.fetchTasks(1);
    }

    // infinite scroll
    async function handleScroll() {
        if (store.loading) return;

        const scrollBottom = window.innerHeight + window.scrollY;
        if (scrollBottom >= document.body.offsetHeight - 50) {
            if (store.pagination.current_page < store.pagination.last_page) {
                await store.fetchTasks(store.pagination.current_page + 1, true);
            }
        }
    }
</script>
