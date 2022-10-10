<template>
  <el-container>
    <el-aside 
      class="menu"
      :width="isCollapse ? '64px' : '200px'"
    >
      <div class="logo flx-center">
        <a href="https://github.com/orcastor/orcas" target="_blank">
          <img src="/logo.svg" alt="logo" />
        </a>
        <span v-show="!isCollapse"></span>
      </div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#1a1a1a"
        :default-active="bktIdx"
        text-color="#fff"
        :collapse="isCollapse"
      >
        <el-menu-item v-for="(b, i) in bkts" :index="i">
          <el-icon><Box /></el-icon>
          <template #title>
            <span>{{ b.name }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-lf flx-center">
          <el-icon class="collapse-icon" @click="menuStore.setCollapse()">
            <component :is="isCollapse ? 'expand' : 'fold'"></component>
          </el-icon>
          <Breadcrumb id="breadcrumb" />
        </div>
        <div class="header-ri flx-center">
          <!-- User name -->
          <span class="username">{{userInfo.name}}</span>
        </div>
      </el-header>
      <el-main class="main">
        <el-empty v-if="tableData.length==0" description="空目录" />
        <el-table v-else
        :data="tableData"
        style="width: 100%;"
        @row-click="onClick"
        >
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
import { ref, computed, watch, onMounted } from 'vue';
import { GlobalStore, MenuStore } from "@/store";
import { useRouter } from "vue-router";
import extension from "@/config/extension";
import Breadcrumb from "@/views/components/Breadcrumb.vue";
import { List } from "@/api/interface";
import { listApi } from "@/api/modules/list";

const router = useRouter();
const bktIdx = ref(0);
const tableData = ref([]);

const globalStore = GlobalStore();
const userInfo = computed(() => globalStore.userInfo);
const bkts = computed(() => globalStore.bkts);

const menuStore = MenuStore();
const isCollapse = computed((): boolean => menuStore.isCollapse);
const breadcrumbs = computed((): any[] => menuStore.breadcrumbs);

function toSize(scope:any):string {
  if(scope.row.type == 2) {
    let sz = scope.row.size||0;
    if(sz < 1e3) { return sz + '  B'; }
    if(sz < 1e6) { return (sz/1e3).toFixed(2) + ' KB'; }
    if(sz < 1e9) { return (sz/1e6).toFixed(2) + ' MB'; }
    return (sz/1e9).toFixed(2) + ' GB';
  }
  return '-';
}

function toIcon(scope:any):string {
  if(scope.row.type == 1) {return '/icons/dir.svg';}
  if(scope.row.type == 2) {
    let pos = scope.row.name.lastIndexOf('.');
    if(pos >= 0) { return '/icons/' + extension(scope.row.name.substr(pos+1)) + '.svg'; }
  }
  return '/icons/none.svg';
}

// aside 自适应
const screenWidth = ref<number>(0);
// 监听窗口大小变化，合并 aside
const listeningWindow = () => {
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
      if (isCollapse.value === false && screenWidth.value < 1200)
        menuStore.setCollapse();
      if (isCollapse.value === true && screenWidth.value > 1200)
        menuStore.setCollapse();
    })();
  };
};
listeningWindow();

const onClick = (row:any, _column:any, _event:any)=> {
  if(row.type == 1) {
    let path = '/index';
    let query = {bid: bkts.value[bktIdx.value].id, pid: row.id};
    breadcrumbs.value.push({ path, query, meta: {title: row.name}});
    router.push({ name: "home", query });
    loadData(bkts.value[bktIdx.value].id, row.id);
  }
};

const loadData = async (bid:number, pid:number) => {
  try {
    let o:List.ListOption = {
      c: 1000,
      b: 1,
    }
    let req:List.ReqList = {
      b: bid,
      p: pid,
      o: o,
    }
    const res = await listApi(req);
    tableData.value = res.data!.o as never || [];
  } finally {
  }
};

watch(() => router.currentRoute.value.query.pid, (_newValue,_oldValue) => {
  init();
})

onMounted(() => {
  menuStore.clearBreadcrumbs();
  init();
})

const init = () => {
  let pid = parseInt(router.currentRoute.value.query.pid+'');
  if(bkts.value.length > 0) {
    loadData(bkts.value[bktIdx.value].id, pid);
  }
}
</script>

<style scoped lang="scss">
.main {
  min-height: 100vh;
  overflow: auto;
  :deep(tr.el-table__row) {
    cursor: pointer;
  }
  :deep(td.el-table_1_column_3) {
    text-align: right;
  }
}
.header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 55px;
  padding: 0 15px;
  background-color: #ffffff;
  border-bottom: 1px solid #f6f6f6;
  .header-lf{
    .collapse-icon {
      margin-right: 20px;
      font-size: 22px;
      color: rgb(0 0 0 / 75%);
      cursor: pointer;
    }
  }
  .header-ri {
    margin: 0 30px;
    .header-icon {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 190px;
      margin-right: 22px;
      .icon-style {
        font-size: 20px;
        color: rgb(0 0 0 / 75%);
        cursor: pointer;
      }
    }
    .username {
      margin: 0 20px 0 0;
      font-size: 15px;
      color: rgb(0 0 0 / 75%);
    }
    .avatar {
      width: 40px;
      height: 40px;
      overflow: hidden;
      cursor: pointer;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.menu {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #191a20;
  transition: all 0.3s ease;
  .logo {
    box-sizing: border-box;
    height: 55px;
    border-bottom: 1px solid #282a35;
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
    span {
      font-size: 22px;
      font-weight: bold;
      color: #dadada;
      white-space: nowrap;
    }
    img {
      width: 30px;
      object-fit: contain;
    }
  }
  .el-menu {
    flex: 1;
    overflow: auto;
    overflow-x: hidden;
    border-right: none;
  }
}
.el-menu,
.el-menu--popup {
  .el-menu-item {
    &.is-active {
      background-color: #060708;
      &::before {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 4px;
        content: "";
        background: #00B8E8;
      }
    }
  }
}
</style>