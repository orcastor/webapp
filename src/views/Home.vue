<template>
  <el-container>
    <el-aside 
      class="menu"
      :width="isCollapse ? '64px' : '200px'"
    >
      <div class="logo flx-center">
        <a href="https://github.com/orcastor" target="_blank">
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
        <el-menu-item v-for="(b, i) in bkts" :index="i" @click="onMenuClick">
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
            <Expand v-if="isCollapse" /><Fold v-else />
          </el-icon>
          <el-icon class="collapse-icon" @click="onRootDir">
            <HomeFilled />
          </el-icon>
          <el-breadcrumb>
            <transition-group name="breadcrumb" mode="out-in">
              <el-breadcrumb-item
                v-for="item in breadcrumbs as any"
                :key="item.path"
                :to="{ path: item.path, query: item.query }"
              >
                {{ item.meta.title }}
              </el-breadcrumb-item>
            </transition-group>
          </el-breadcrumb>
        </div>
        <el-dropdown trigger="click">
          <div class="header-ri flx-center">
              <el-avatar :size="30" src="/avatar.png" />
          <span class="username">{{userInfo.name}}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main class="main" v-loading="loading">
        <el-empty v-if="!tableData" description="空目录" />
        <el-table v-else
        :data="tableData"
        style="width: 100%;"
        @row-click="onRowClick"
        >
          <el-table-column width="56">
            <template #default="scope">
              <el-image :src=toIcon(scope.row) style="width: 32px;"/>
            </template>
          </el-table-column>
          <el-table-column label="文件名" min-width="180" show-overflow-tooltip>
            <template #default="scope">
              <div><strong>{{ scope.row.n }}</strong></div>
              <span>{{ new Date(scope.row.m*1000).toLocaleString() }}</span>
              <!-- new Date((scope.row.i/Math.pow(2,22)+1662688799)*1000).toLocaleString() -->
            </template>
          </el-table-column>
          <el-table-column label="大小" width="120">
            <template #default="scope">
              {{ toSize(scope) }}
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import router from "@/routers";

import { GlobalStore, MenuStore } from "@/store";
import { HomeFilled, Expand, Fold, Box } from '@element-plus/icons-vue'
import { toIcon } from "@/config/icons";

import { Cache } from "@/store/cache";

import { Object } from "@/api/interface";
import { listApi, getApi } from "@/api/modules/object";

import 'element-plus/es/components/message-box/style/css';
import { ElMessage, ElMessageBox } from 'element-plus';

const bktIdx = ref(0);
const loading = ref(true);
const tableData = ref([]);
const breadcrumbs = ref([]);

const globalStore = GlobalStore();
const userInfo = computed(() => globalStore.userInfo);
const bkts = computed(() => globalStore.bkts);

const menuStore = MenuStore();
const isCollapse = computed((): boolean => menuStore.isCollapse);

const cache = new Cache(100, null);

function toSize(scope:any):string {
  if (scope.row.t == 2) {
    const sz = scope.row.size||0;
    if (sz < 1e3) { return sz + '  B'; }
    if (sz < 1e6) { return (sz/1e3).toFixed(2) + ' KB'; }
    if (sz < 1e9) { return (sz/1e6).toFixed(2) + ' MB'; }
    return (sz/1e9).toFixed(2) + ' GB';
  }
  return '-';
}

// aside 自适应
const screenWidth = ref<number>(0);
// 监听窗口大小变化，合并 aside
const listeningWindow = () => {
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
      if ((isCollapse.value === false && screenWidth.value < 1200)
        || (isCollapse.value === true && screenWidth.value > 1200))
        menuStore.setCollapse();
    })();
  };
};
listeningWindow();

const onRowClick = (row:any, _column:any, _event:any)=> {
  if (row.t == 1) {
    const query = {b: bkts.value[bktIdx.value].i, p: row.i};
    breadcrumbs.value.push({ path: '/', query, meta: {title: row.n} } as never);
    router.push({ name: "home", query });
  }
};

const onMenuClick = (item:any) => {
  bktIdx.value = item.index;
  onRootDir();
};

const onRootDir = () => {
  const b = bkts.value[bktIdx.value].i;
  breadcrumbs.value = [];
  router.push({ name: "home", query: { b } });
};

const loadData = async (b:number, p:number) => {
  loading.value = true;
  try {
    const o:Object.ListOption = { c: 1000, b: 1 };
    const req:Object.ReqList = { b, p, o };
    const res = await listApi(req);
    tableData.value = res.data!.o as never;
    // 设置到缓存
    if (tableData.value) {
      for (let i = 0; i < tableData.value.length; i++) {
        const f = tableData.value[i] as any;
        // 只要目录
        if (f.t == 1) cache.put(b+'-'+f.i, f);
      }
    }
  } finally {
    loading.value = false;
  }

  let i = p;
  let bc:any[] = [];
  while(i) {
    try {
      let cached = cache.get(b+'-'+i);
      if (!cached) {
        let req:Object.ReqGet = { b, i };
        const res = await getApi(req);
        cached = res.data!.o;
        if (!cached) break;
        cache.put(b+'-'+i, cached);
      }
      i = cached.p || 0;
      bc.unshift({ path: '/', query: { b, p: cached.i }, meta: {title: cached.n}});
    } finally {
    }
  }
  breadcrumbs.value = bc as never[];
};

watch(() => router.currentRoute.value.query, (_newValue, _oldValue) => {
  if (router.currentRoute.value.path == '/') {
    init();
  }
});

const findBktIdx = () => {
  const b = router.currentRoute.value.query.b;
  if (b) {
    for (let i = 0; i < bkts.value.length; i++) {
      if (bkts.value[i].i == b) {
        bktIdx.value = i;
        return;
      }
    }
  }
  onRootDir();
};

onMounted(() => {
  init();
});

const init = () => {
  findBktIdx();
  const p = parseInt(router.currentRoute.value.query.p+'');
  if (bkts.value.length > 0) {
    const b = bkts.value[bktIdx.value].i as number;
    loadData(b, p);
  }
};

// 退出登录
const logout = () => {
  ElMessageBox.confirm("您是否确认退出登录?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    globalStore.setToken("");
    ElMessage({
      type: "success",
      message: "退出登录成功",
    });
    router.push({ name: "login", query: router.currentRoute.value.query });
  });
};

</script>

<style scoped lang="scss">
.main {
  min-height: 100vh;
  overflow: auto;
  :deep(tr.el-table__row) {
    cursor: pointer;
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
    margin: 0 20px;
    cursor: pointer;
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
      margin: 0 0 0 5px;
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
