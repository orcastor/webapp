<template>
  <router-view v-slot="{ Component, route }">
    <transition appear name="fade-transform" mode="out-in">
      <component :is="Component" :key="route.path"></component>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
