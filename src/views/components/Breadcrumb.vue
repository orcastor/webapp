<template>
  <el-breadcrumb>
    <transition-group name="breadcrumb" mode="out-in">
      <el-breadcrumb-item
        v-for="item in breadcrumbs"
        :key="item.path"
        :to="{ path: item.path, query: item.query }"
      >
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MenuStore } from "@/store";

const menuStore = MenuStore();
const breadcrumbs = computed((): any[] => menuStore.breadcrumbs);
</script>
