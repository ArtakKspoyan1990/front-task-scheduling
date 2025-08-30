<template>
    <div class="container mt-4">
        <h2 class="h4 fw-bold mb-3">
            Notifications
            <span class="badge bg-primary ms-2">{{ store.unreadCount }}</span>
        </h2>
        <ul class="list-group">
            <li
                    v-for="n in store.notifications"
                    :key="n.id"
                    class="list-group-item d-flex justify-content-between align-items-center"
                    :class="{ 'list-group-item-secondary': n.read }"
            >
                <div>
                    <strong>{{ n.title }}</strong>
                    <p class="mb-0">{{ n.message }}</p>
                </div>
                <button
                        v-if="!n.read"
                        @click="store.markAsRead(n.id)"
                        class="btn btn-sm btn-outline-success"
                >
                    Mark Read
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from "vue";
    import { useNotificationStore } from "../store/notification";

    const store = useNotificationStore();

    onMounted(() => {
        store.fetchNotifications();
    });
</script>
