<template>
  <div>
    <h2 class="h4 fw-bold mb-3">{{ task ? "Edit Task" : "Create Task" }}</h2>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <input
                v-model="title"
                type="text"
                placeholder="Title"
                class="form-control form-control-lg"
        />
      </div>
      <div class="mb-3">
        <textarea
                v-model="description"
                placeholder="Description"
                class="form-control form-control-lg"
                rows="3"
        ></textarea>
      </div>
      <div class="mb-3">
        <input
                type="date"
                v-model="due_at"
                class="form-control form-control-lg"
        />
      </div>
      <div class="mb-3">
        <select v-model="assigned_user_id" class="form-select form-select-lg">
          <option value="">Select User</option>
          <option v-for="u in store.users" :key="u.id" :value="u.id">
            {{ u.name }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <select v-model="status" class="form-select form-select-lg">
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div v-if="errorMessage" class="alert alert-danger mb-3">
        {{ errorMessage }}
      </div>
      <button type="submit" class="btn btn-success btn-lg w-100">
        {{ task ? "Update Task" : "Add Task" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
    import { ref, watch } from "vue";
    import { useTaskStore } from "../store/tasks.ts";

    const props = defineProps<{ task?: any }>();
    const emit = defineEmits(["close"]);
    const store = useTaskStore();

    const title = ref("");
    const description = ref("");
    const due_at = ref("");
    const assigned_user_id = ref("");
    const status = ref("todo");

    // New: error state
    const errorMessage = ref("");

    function resetForm() {
        title.value = "";
        description.value = "";
        due_at.value = "";
        assigned_user_id.value = "";
        status.value = "todo";
        errorMessage.value = "";
    }

    // Prefill when editing
    watch(
        () => props.task,
        (newTask) => {
            if (newTask) {
                title.value = newTask.title;
                description.value = newTask.description;
                due_at.value = newTask.due_at;
                assigned_user_id.value = newTask.assigned_user_id;
                status.value = newTask.status;
            } else {
                resetForm();
            }
        },
        { immediate: true }
    );

    async function submit() {
        try {
            errorMessage.value = ""; // clear previous errors
            if (props.task) {
                await store.updateTask(props.task.id, {
                    title: title.value,
                    description: description.value,
                    due_at: due_at.value,
                    assigned_user_id: assigned_user_id.value,
                    status: status.value,
                });
            } else {
                await store.createTask({
                    title: title.value,
                    description: description.value,
                    due_at: due_at.value,
                    assigned_user_id: assigned_user_id.value,
                    status: status.value,
                });
            }
            emit("close"); // close modal on success
        } catch (err: any) {
            // Display backend errors
            if (err.response?.data?.message) {
                errorMessage.value = err.response.data.message;
            } else {
                errorMessage.value = "Something went wrong. Please try again.";
            }
            console.error("Task submission error:", err);
        }
    }
</script>
