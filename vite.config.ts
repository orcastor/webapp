import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from "path";
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      // "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  build: {
    outDir: "dist",
    // minify: "esbuild",
    // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
    minify: "terser",
    terserOptions: {
      compress: {
     		drop_console: true,
     		drop_debugger: true
     	}
    },
    /*
    rollupOptions: {
      output: {
        // Static resource classification and packaging
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    }*/
  }
})
