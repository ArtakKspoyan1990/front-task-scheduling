<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth";

const auth = useAuthStore();
const email = ref("");
const password = ref("");

const login = async () => {
  try {
    await auth.login(email.value, password.value);
  } catch (err) {
    alert("Invalid credentials");
  }
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-lg p-4 p-md-5 rounded-4" style="max-width: 400px; width: 100%;">
      <h1 class="text-center mb-4 fw-bold">Login</h1>
      <form @submit.prevent="login" class="mb-3">
        <div class="mb-3">
          <input
              type="email"
              v-model="email"
              class="form-control form-control-lg rounded-3"
              placeholder="Email"
          />
        </div>
        <div class="mb-3">
          <input
              type="password"
              v-model="password"
              class="form-control form-control-lg rounded-3"
              placeholder="Password"
          />
        </div>
        <button
            type="submit"
            class="btn btn-primary btn-lg w-100 rounded-3 shadow-sm"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>
