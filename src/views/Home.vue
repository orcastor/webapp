<template>
  <el-container>
    <el-aside 
      :width="isCollapse ? '65px' : '200px'"
    >
      <el-menu
        active-text-color="#ffd04b"
        background-color="#1a1a1a"
        class="el-menu-vertical-demo"
        default-active=0
        text-color="#fff"
        :collapse="isCollapse"
      >
        <el-icon v-if="isCollapse"><Fold /></el-icon>
        <el-icon v-else><Expand /></el-icon>
        <el-menu-item v-for="(b, i) in bkts" :index="i">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>{{ b.name }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">test</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/">test1</a></el-breadcrumb-item
          >
        </el-breadcrumb>
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column width="56">
            <template #default="scope">
              <el-image :src=toIcon(scope) style="width: 32px;"/>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="文件名" width="180" />
          <el-table-column label="大小" width="120">
            <template #default="scope">
              {{ toSize(scope) }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="180">
            <template #default="scope">
              {{ new Date((scope.row.id/Math.pow(2,22)+1662688799)*1000).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间" width="180">
            <template #default="scope">
              {{ new Date(scope.row.mtime*1000).toLocaleString() }}
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { GlobalStore } from "@/store";
import extension from "@/config/extension";
const num = ref(window.innerWidth/200);
const tableData = ref([
  {
    id: 10623110873088,
    name: "test",
    mtime: 1665219348,
    size: 0,
    type: 1,
  },
  {
    id: 10623110873089,
    name: "test1",
    mtime: 1665219388,
    size: 0,
    type: 1,
  },
  {
    id: 10623110873089,
    name: "test1",
    mtime: 1665219388,
    size: 0,
    type: 1,
  },
  {
    id: 10623110873089,
    name: "test1",
    mtime: 1665219388,
    size: 0,
    type: 1,
  },
  {
    id: 10623110873089,
    name: "test1",
    mtime: 1665219388,
    size: 0,
    type: 1,
  },
  {
    id: 10623110873090,
    name: "test3.Doc",
    mtime: 1665219388,
    size: 1203,
    type: 2,
  },
  {
    id: 10623110873091,
    name: "test4.bmp",
    mtime: 1665219388,
    size: 234,
    type: 2,
  },
  {
    id: 10623110873092,
    name: "test5.zip",
    mtime: 1665219388,
    size: 10318742815,
    type: 2,
  },
  {
    id: 10623110873093,
    name: "test6.pdf",
    mtime: 1665219388,
    size: 123123,
    type: 2,
  },
  {
    id: 10623110873094,
    name: "test7.wav",
    mtime: 1665219388,
    size: 1231231,
    type: 2,
  },
  {
    id: 10623110873095,
    name: "test8.ppt",
    mtime: 1665219388,
    size: 0,
    type: 2,
  },
  {
    id: 10623110873096,
    name: "test9.xls",
    mtime: 1665219388,
    size: 1000,
    type: 2,
  },
  {
    id: 10623110873097,
    name: "test10.lnk",
    mtime: 1665219388,
    size: 1048576,
    type: 2,
  },
  {
    id: 10623110873098,
    name: "test11.txt",
    mtime: 1665219388,
    size: 104857600,
    type: 2,
  },
  {
    id: 10623110873099,
    name: "test12",
    mtime: 1665219388,
    size: 1000000,
    type: 2,
  }
]);
const isCollapse = ref(false);
const globalStore = GlobalStore();
const userInfo = computed(() => globalStore.userInfo);
const bkts = computed(() => globalStore.bkts);
function toSize(scope:any):string {
  if(scope.row.type == 2) {
    let sz = scope.row.size||0;
    if(sz < 1e3) {
      return sz + '  B';
    }
    if(sz < 1e6) {
      return (sz/1024.).toFixed(2) + ' KB';
    }
    if(sz < 1e9) {
      return (sz/1048576.).toFixed(2) + ' MB';
    }
    return (sz/1073741824.).toFixed(2) + ' GB';
  }
  return '-';
}

function toIcon(scope:any):string {
  if(scope.row.type == 1) {return '/assets/icons/dir.svg';}
  if(scope.row.type == 2) {
    let pos = scope.row.name.lastIndexOf('.');
    if(pos >= 0) {
      return '/assets/icons/' + extension(scope.row.name.substr(pos+1)) + '.svg';
    }
  }
  return '/assets/icons/none.svg';
}
</script>

<style>
.el-main {
  min-height: 100vh;
  overflow: auto;
}

.el-menu {
  height: 100%;
}

tr.el-table__row {
  cursor: pointer;
}

td.el-table_1_column_3.el-table__cell {
  text-align: right;
}

.el-table__inner-wrapper {
  display: inline-block;
}
</style>
