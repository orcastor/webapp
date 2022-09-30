<template>
  <router-view v-slot="{ Component, route }">
    <transition appear name="fade-transform" mode="out-in">
      <component :is="Component" :key="route.path"></component>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(async () => {
});
</script>

<style scoped>
</style>
