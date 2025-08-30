<script setup lang="ts">
    import { useAuthStore } from "./store/auth";
    import { useNotificationStore } from "./store/notification";

    const auth = useAuthStore();
    const notificationStore = useNotificationStore();
</script>

<template>
  <div class="min-vh-100 bg-light text-dark">
    <!-- Navbar -->
    <nav v-if="auth.isAuth" class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/">Task Scheduler</router-link>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto align-items-center">
            <li v-if="auth.user?.role === 'manager'" class="nav-item">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li v-if="auth.user?.role === 'manager'" class="nav-item">
              <router-link class="nav-link" to="/users">Users</router-link>
            </li>
            <li v-if="auth.user?.role === 'manager'" class="nav-item">
              <router-link class="nav-link" to="/tasks">Tasks</router-link>
            </li>
            <li v-if="auth.user?.role === 'customer'" class="nav-item">
              <router-link class="nav-link" to="/my-tasks">My Tasks</router-link>
            </li>

            <!-- Notification Bell -->
            <li class="nav-item position-relative ms-3">
              <router-link class="nav-link" to="/notifications">
                <i class="bi bi-bell"></i>
                <span
                        v-if="notificationStore.unreadCount > 0"
                        class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger"
                >
    {{ notificationStore.unreadCount }}
  </span>
              </router-link>
            </li>

            <li class="nav-item ms-3">
              <button @click="auth.logout" class="btn btn-outline-light">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <RouterView />
    </div>
  </div>
</template>
