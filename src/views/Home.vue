<template>
  <el-container>
    <el-aside 
      class="menu"
      :width="isMob ? (isCollapse ? '0px' : '200px'): (isCollapse ? '64px' : '200px')"
    >
      <div class="logo flx-center">
        <a href="https://github.com/orcastor" target="_blank">
          <img src="/logo.svg" alt="logo" />
        </a>
        <span v-show="!isCollapse"></span>
      </div>
      <el-menu
        active-text-color="#EF7C00"
        background-color="#F8F8F8"
        :default-active="bktIdx"
        text-color="#004482"
        :collapse="isCollapse"
      >
        <el-menu-item v-for="(b, i) in bkts" :index="i" @click="onMenuClick">
          <el-icon><Box /></el-icon>
          <template #title>
            <span>{{ b.n }}</span>
          </template>
        </el-menu-item>
      </el-menu>
      <el-dropdown trigger="click" class="avatar flx-center">
        <div>
            <el-avatar :size="30" src="/avatar.png" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>{{userInfo.n}}</el-dropdown-item>
            <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-lf flx-center">
          <el-icon class="collapse-icon" @click="setCollapse">
            <Expand v-if="isCollapse" /><Fold v-else />
          </el-icon>
          <el-icon v-if="previewing" class="collapse-icon" @click="exitPreview">
            <Back />
          </el-icon>
          <el-icon v-else class="collapse-icon" @click="onRootDir">
            <HomeFilled />
          </el-icon>
          <span v-if="previewing" >{{preview_title}}</span>
          <el-breadcrumb v-else >
            <transition-group name="breadcrumb" mode="out-in">
              <el-breadcrumb-item
                v-for="item in bcs as any"
                :key="item.path"
                :to="{ path: item.path, query: item.query }"
              >
                {{ item.meta.title }}
              </el-breadcrumb-item>
            </transition-group>
          </el-breadcrumb>
        </div>
      </el-header>
      <el-main class="main" :style=mainStyle()>
        <iframe v-if="previewing"
          v-loading="loading" 
          :src="preview_link"
          :style=iframeStyle()
          :onload="loading = false"
        />
        <el-empty v-else-if="data?.lenth == 0" description="空目录" />
        <el-table v-else
          :data="data"
          style="width: 100%;"
          @row-click="onRowClick"
          v-loading="loading"
        >
          <el-table-column width="56">
            <template #default="scope">
              <el-image v-if="scope.row.icon" :src="scope.row.icon" style="width: {{ ico_size }}px;"/>
            </template>
          </el-table-column>
          <el-table-column label="文件名" min-width="180" show-overflow-tooltip sortable prop="n">
            <template #default="scope">
              <div><strong>{{ scope.row.n }}</strong></div>
              <span>{{ new Date(scope.row.m*1000).toLocaleString() }}</span>
              <!-- new Date((scope.row.i/Math.pow(2,22)+1662688799)*1000).toLocaleString() -->
            </template>
          </el-table-column>
          <el-table-column label="大小" width="120" sortable prop="s">
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

import { store } from "@/store";
import { Back, HomeFilled, Expand, Fold, Box } from '@element-plus/icons-vue';
import { toDefaultIcon, toIcon, getExt, isZip } from "@/config/icons";

import { Cache } from "@/store/cache";

import { Object } from "@/api/interface";
import { listApi, getApi } from "@/api/modules/object";
import { prvwListApi } from "@/api/modules/prvw";

import 'element-plus/es/components/message-box/style/css';
import { ElMessage, ElMessageBox } from 'element-plus';

const bktIdx = ref(0);
const loading = ref(true);
const data = ref([]);
const bcs = ref([]);
const previewing = ref(false);
const preview_title = ref('');
const preview_link = ref('');
const ico_size = ref(32);
const is_zip = ref(false);

const userInfo = computed(() => store.userInfo);
const bkts = computed(() => store.bkts);
const isCollapse = ref(store.isCollapse);

const isMob = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);

const iframeStyle = () => {
  return 'border: 0; width:100%; height:'+(100-5500/document.body.clientHeight).toFixed(2)+'vh;';
}

const mainStyle = () => {
  return 'min-height:'+(100-5500/document.body.clientHeight).toFixed(2)+'vh;';
}

const cache = new Cache(100, null);

function toSize(scope:any):string {
  if (scope.row.t == 2) {
    const sz = scope.row.s||0;
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
        setCollapse();
    })();
  };
};
listeningWindow();

const onRowClick = (row:any, _column:any, _event:any) => {
  const q = router.currentRoute.value.query;
  const isZipFile = isZip(row.n);
  const hasRouteParam = !!q.r;

  // 设置路由参数 query.r
  let newRouteParam = '';
  if (isZipFile && !hasRouteParam) {
    newRouteParam = '.';
  } else if (hasRouteParam) {
    newRouteParam = q.r + '/' + row.n;
  }
  
  // 构建新的 query 对象
  const query = {
    b: bkts.value[bktIdx.value].i,
    i: (!row.i || (row.t !== 1 && !isZipFile)) ? q.i : row.i,
    r: newRouteParam || q.r
  };

  // 如果不是目录且不是zip文件，则添加 v 参数
  if (row.t !== 1 && !isZipFile) {
    query.v = row.i ? row.i : q.i;
  }

  // 只在首次点击 zip 文件时向 bcs.value 添加项
  if (row.t === 1 || (isZipFile && !hasRouteParam)) {
    bcs.value.push({ path: '/', query, meta: { title: row.n } });
  }

  router.push({ name: "home", query });
};

const onMenuClick = (item:any) => {
  bktIdx.value = item.index;
  onRootDir();
  if (isMob) {
    setCollapse();
  }
};

const setCollapse = () => {
  isCollapse.value = !isCollapse.value;
  store.setCollapse();
};

const onRootDir = () => {
  const b = bkts.value[bktIdx.value].i;
  bcs.value = [];
  router.push({ name: "home", query: { b } });
};

const get = async(b:number, i:number):Promise<any> => {
  let cached = cache.get(b + '-' + i);
  if (!cached) {
    let req:Object.ReqGet = { b, i };
    const res = await getApi(req);
    cached = res.data!.o;
    if (!cached) return;
    cache.put(b + '-' + i, cached);
  }
  return cached;
}

const loadData = async (b:number, p:number) => {
  previewing.value = false;
  loading.value = true;

  let i = p;
  let bc:any[] = [];
  while(i) {
    try {
      const obj = await get(b, i);
      i = obj.p || 0;
      let query = { b, i: obj.i };
      if (isZip(obj.n)) query.r = '.';
      bc.unshift({ path: '/', query, meta: {title: obj.n}});
    } finally {
    }
  }

  bcs.value = bc as never[];
  is_zip.value = isZip(bc[bc.length - 1]?.meta?.title);
  let q = router.currentRoute.value.query;
  try {
    const req:Object.ReqList = { b, p, e: 1, r: q?.r };
    const res = is_zip.value ? await prvwListApi(req) : await listApi(req);
    data.value = res.data!.o as never;
    // 设置到缓存
    if (data.value) {
      for (let x = 0; x < data.value.length; x++) {
        const f = data.value[x] as any;
        // 只要目录
        if (f.t == 1) cache.put(b + '-' + f.i, {...f, p: p} );
        f.icon = toDefaultIcon(f);
      }
    }
  } finally {
    loading.value = false;
  }

  // 最后延迟显示icon
  try {
    if (data.value) {
      let start = 0;
      const count = 10;
      while (start < data.value.length) {
        let icons = [];
        for (let i = start; i < start + count && i < data.value.length; i++) {
          const f = data.value[i] as any;
          if (q?.r != '') {
            icons.push(toIcon(q.b, f, q.i, q.r, ico_size.value));
          } else {
            icons.push(toIcon(q.b, f, f.i, '', ico_size.value));
          }
        }
        const res = await Promise.all(icons);
        for (let i = start; i < start + count && i < data.value.length; i++) {
          const f = data.value[i] as any;
          f.icon = res[i-start];
        }
        start += count;
      }
    }
  } finally {
  }
};

watch(() => router.currentRoute.value.query, (_newValue:any, _oldValue:any) => {
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
  let query = router.currentRoute.value.query;
  const i = parseInt(query.i+'');
  const v = parseInt(query.v+'');
  if (bkts.value.length > 0) {
    const b = bkts.value[bktIdx.value].i as number;
    if (v) preview(b, v, query?.r || '');
    else loadData(b, i);
  }
};

// 退出登录
const logout = () => {
  ElMessageBox.confirm("您是否确认退出登录?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    store.setToken("");
    ElMessage({
      type: "success",
      message: "退出登录成功",
    });
    router.push({ name: "login", query: router.currentRoute.value.query });
  });
};

const preview = async (b:number, v:number, r:string) => {
  if (!v) return;

  previewing.value = true;

  const obj = await get(b, v);
  if (!obj) {
    previewing.value = false;
    return;
  }

  let q = router.currentRoute.value.query;
  let name = q.r ? (q.r.match(/\/([^\/]+)$/) ?? [])[1] as string : obj.n;
  preview_title.value = name;

  let ext = getExt(name);
  preview_link.value = `//${location.host}/prvw/?b=${bkts.value[bktIdx.value].i}&i=${v}&t=${ext}` + (!!r ? `&r=${r}` : '');
};

const exitPreview = () => {
  previewing.value = false;
  let q = router.currentRoute.value.query;
  let query = { b: q.b, i: q.i};
  if (q.r) query.r = (q.r.match(/(.*)\/[^\/]+$/) ?? [])[1];
  router.push({ name: "home", query });
};

</script>

<style scoped lang="scss">
.main {
  min-height: 100vh;
  overflow: auto;
  padding: 0;
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
  .header-lf {
    .collapse-icon {
      margin-right: 20px;
      font-size: 22px;
      color: rgb(0 0 0 / 75%);
      cursor: pointer;
    }
  }
}

.menu {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #F8F8F8;
  transition: all 0.3s ease;
  .logo {
    box-sizing: border-box;
    height: 55px;
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

.avatar {
  height: 55px;
  cursor: pointer;
}

.el-menu,
.el-menu--popup {
  .el-menu-item {
    &.is-active {
      background-color: #fff;
      &::before {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 4px;
        content: "";
      }
    }
  }
}
</style>
