// vite.config.ts
import vue from "file:///D:/University/%E7%A0%94%E4%B8%80%E4%B8%8B/project/gf_ui/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import { defineConfig, loadEnv } from "file:///D:/University/%E7%A0%94%E4%B8%80%E4%B8%8B/project/gf_ui/node_modules/vite/dist/node/index.js";
import viteCompression from "file:///D:/University/%E7%A0%94%E4%B8%80%E4%B8%8B/project/gf_ui/node_modules/vite-plugin-compression/dist/index.mjs";

// src/utils/build.ts
import importToCDN from "file:///D:/University/%E7%A0%94%E4%B8%80%E4%B8%8B/project/gf_ui/node_modules/vite-plugin-cdn-import/dist/index.js";
var buildConfig = {
  cdn() {
    return importToCDN({
      prodUrl: "https://unpkg.com/{name}@{version}/{path}",
      modules: [
        // autoComplete('vue'),
        // autoComplete('axios'),
        {
          name: "vue",
          var: "Vue",
          path: "dist/vue.global.js"
        },
        {
          name: "vue-demi",
          var: "VueDemi",
          path: "lib/index.iife.js"
        },
        {
          name: "vue-router",
          var: "VueRouter",
          path: "dist/vue-router.global.js"
        },
        {
          name: "element-plus",
          var: "ElementPlus",
          path: "dist/index.full.js"
        }
        // {
        // 	name: '@element-plus/icons-vue',
        // 	var: 'ElementPlusIconsVue',
        // 	path: 'dist/index.iife.min.js',
        // },
        // {
        // 	name: 'echarts',
        // 	var: 'echarts',
        // 	path: 'dist/echarts.min.js',
        // },
        // {
        // 	name: 'echarts-gl',
        // 	var: 'echarts-gl',
        // 	path: 'dist/echarts-gl.min.js',
        // },
        // {
        // 	name: 'echarts-wordcloud',
        // 	var: 'echarts-wordcloud',
        // 	path: 'dist/echarts-wordcloud.min.js',
        // },
        // {
        // 	name: 'vue-i18n',
        // 	var: 'VueI18n',
        // 	path: 'dist/vue-i18n.global.min.js',
        // },
        // {
        // 	name: 'jsplumb',
        // 	var: 'jsPlumb',
        // 	path: 'dist/js/jsplumb.min.js',
        // },
        // {
        // 	name: 'cropperjs',
        // 	var: 'Cropper',
        // 	path: 'dist/cropper.min.js',
        // },
        // {
        // 	name: 'sortablejs',
        // 	var: 'Sortable',
        // 	path: 'Sortable.min.js',
        // },
        // {
        // 	name: 'qrcodejs2-fixes',
        // 	var: 'QRCode',
        // 	path: 'qrcode.min.js',
        // },
        // {
        // 	name: 'print-js',
        // 	var: 'printJS',
        // 	path: 'dist/print.min.js',
        // },
        // {
        // 	name: '@wangeditor/editor',
        // 	var: 'wangEditor',
        // 	path: 'dist/index.min.js',
        // },
        // {
        // 	name: '@wangeditor/editor-for-vue',
        // 	var: 'WangEditorForVue',
        // 	path: 'dist/index.min.js',
        // },
        // {
        // 	name: 'vue-grid-layout',
        // 	var: 'VueGridLayout',
        // 	path: 'https://cdn.jsdelivr.net/npm/vue-grid-layout@3.0.0-beta1/dist/vue-grid-layout.umd.min.js',
        // },
      ]
    });
  },
  external: [
    "vue",
    // 'axios',
    "vue-router",
    "element-plus"
    // '@element-plus/icons-vue',
    // 'echarts',
    // 'echarts-gl',
    // 'echarts-wordcloud',
    // 'vue-i18n',
    // 'jsplumb',
    // 'cropperjs',
    // 'sortablejs',
    // 'qrcodejs2-fixes',
    // 'print-js',
    // '@wangeditor/editor',
    // '@wangeditor/editor-for-vue',
    // 'vue-grid-layout',
  ]
};

// vite.config.ts
var __vite_injected_original_dirname = "D:\\University\\\u7814\u4E00\u4E0B\\project\\gf_ui";
var pathResolve = (dir) => {
  return resolve(__vite_injected_original_dirname, ".", dir);
};
var alias = {
  "/@": pathResolve("./src/"),
  "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
};
var viteConfig = defineConfig((mode) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    plugins: [vue(), viteCompression({ disable: true })],
    root: process.cwd(),
    resolve: { alias },
    base: mode.command === "serve" ? "./" : env.VITE_PUBLIC_PATH,
    optimizeDeps: { exclude: ["vue-demi"] },
    server: {
      host: "0.0.0.0",
      port: env.VITE_PORT,
      open: JSON.parse(env.VITE_OPEN),
      hmr: true,
      proxy: {
        "/gitee": {
          target: "https://gitee.com",
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gitee/, "")
        }
      }
    },
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//)?.groups.moduleName ?? "vender";
            }
          }
        },
        ...JSON.parse(env.VITE_OPEN_CDN) ? { external: buildConfig.external } : {}
      }
    },
    css: { preprocessorOptions: { css: { charset: false } } },
    define: {
      __VUE_I18N_LEGACY_API__: JSON.stringify(false),
      __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
      __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
      __NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
      __NEXT_NAME__: JSON.stringify(process.env.npm_package_name)
    }
  };
});
var vite_config_default = viteConfig;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL3V0aWxzL2J1aWxkLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcVW5pdmVyc2l0eVxcXFxcdTc4MTRcdTRFMDBcdTRFMEJcXFxccHJvamVjdFxcXFxnZl91aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVW5pdmVyc2l0eVxcXFxcdTc4MTRcdTRFMDBcdTRFMEJcXFxccHJvamVjdFxcXFxnZl91aVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVW5pdmVyc2l0eS8lRTclQTAlOTQlRTQlQjglODAlRTQlQjglOEIvcHJvamVjdC9nZl91aS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYsIENvbmZpZ0VudiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcclxuaW1wb3J0IHsgYnVpbGRDb25maWcgfSBmcm9tICcuL3NyYy91dGlscy9idWlsZCc7XHJcblxyXG5jb25zdCBwYXRoUmVzb2x2ZSA9IChkaXI6IHN0cmluZykgPT4ge1xyXG5cdHJldHVybiByZXNvbHZlKF9fZGlybmFtZSwgJy4nLCBkaXIpO1xyXG59O1xyXG5cclxuY29uc3QgYWxpYXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XHJcblx0Jy9AJzogcGF0aFJlc29sdmUoJy4vc3JjLycpLFxyXG5cdCd2dWUtaTE4bic6ICd2dWUtaTE4bi9kaXN0L3Z1ZS1pMThuLmNqcy5qcycsXHJcbn07XHJcblxyXG5jb25zdCB2aXRlQ29uZmlnID0gZGVmaW5lQ29uZmlnKChtb2RlOiBDb25maWdFbnYpID0+IHtcclxuXHRjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUubW9kZSwgcHJvY2Vzcy5jd2QoKSk7XHJcblx0cmV0dXJuIHtcclxuXHRcdHBsdWdpbnM6IFt2dWUoKSwgdml0ZUNvbXByZXNzaW9uKHtkaXNhYmxlOnRydWV9KV0sXHJcblx0XHRyb290OiBwcm9jZXNzLmN3ZCgpLFxyXG5cdFx0cmVzb2x2ZTogeyBhbGlhcyB9LFxyXG5cdFx0YmFzZTogbW9kZS5jb21tYW5kID09PSAnc2VydmUnID8gJy4vJyA6IGVudi5WSVRFX1BVQkxJQ19QQVRILFxyXG5cdFx0b3B0aW1pemVEZXBzOiB7IGV4Y2x1ZGU6IFsndnVlLWRlbWknXSB9LFxyXG5cdFx0c2VydmVyOiB7XHJcblx0XHRcdGhvc3Q6ICcwLjAuMC4wJyxcclxuXHRcdFx0cG9ydDogZW52LlZJVEVfUE9SVCBhcyB1bmtub3duIGFzIG51bWJlcixcclxuXHRcdFx0b3BlbjogSlNPTi5wYXJzZShlbnYuVklURV9PUEVOKSxcclxuXHRcdFx0aG1yOiB0cnVlLFxyXG5cdFx0XHRwcm94eToge1xyXG5cdFx0XHRcdCcvZ2l0ZWUnOiB7XHJcblx0XHRcdFx0XHR0YXJnZXQ6ICdodHRwczovL2dpdGVlLmNvbScsXHJcblx0XHRcdFx0XHR3czogdHJ1ZSxcclxuXHRcdFx0XHRcdGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuXHRcdFx0XHRcdHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9naXRlZS8sICcnKSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHRcdGJ1aWxkOiB7XHJcblx0XHRcdG91dERpcjogJ2Rpc3QnLFxyXG5cdFx0XHRjaHVua1NpemVXYXJuaW5nTGltaXQ6IDE1MDAsXHJcblx0XHRcdHJvbGx1cE9wdGlvbnM6IHtcclxuXHRcdFx0XHRvdXRwdXQ6IHtcclxuXHRcdFx0XHRcdGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG5cdFx0XHRcdFx0ZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXHJcblx0XHRcdFx0XHRhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJyxcclxuXHRcdFx0XHRcdG1hbnVhbENodW5rcyhpZCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlkLnRvU3RyaW5nKCkubWF0Y2goL1xcL25vZGVfbW9kdWxlc1xcLyg/IS5wbnBtKSg/PG1vZHVsZU5hbWU+W15cXC9dKilcXC8vKT8uZ3JvdXBzIS5tb2R1bGVOYW1lID8/ICd2ZW5kZXInO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Li4uKEpTT04ucGFyc2UoZW52LlZJVEVfT1BFTl9DRE4pID8geyBleHRlcm5hbDogYnVpbGRDb25maWcuZXh0ZXJuYWwgfSA6IHt9KSxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRjc3M6IHsgcHJlcHJvY2Vzc29yT3B0aW9uczogeyBjc3M6IHsgY2hhcnNldDogZmFsc2UgfSB9IH0sXHJcblx0XHRkZWZpbmU6IHtcclxuXHRcdFx0X19WVUVfSTE4Tl9MRUdBQ1lfQVBJX186IEpTT04uc3RyaW5naWZ5KGZhbHNlKSxcclxuXHRcdFx0X19WVUVfSTE4Tl9GVUxMX0lOU1RBTExfXzogSlNPTi5zdHJpbmdpZnkoZmFsc2UpLFxyXG5cdFx0XHRfX0lOVExJRllfUFJPRF9ERVZUT09MU19fOiBKU09OLnN0cmluZ2lmeShmYWxzZSksXHJcblx0XHRcdF9fTkVYVF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lm5wbV9wYWNrYWdlX3ZlcnNpb24pLFxyXG5cdFx0XHRfX05FWFRfTkFNRV9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5ucG1fcGFja2FnZV9uYW1lKSxcclxuXHRcdH0sXHJcblx0fTtcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IHZpdGVDb25maWc7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcVW5pdmVyc2l0eVxcXFxcdTc4MTRcdTRFMDBcdTRFMEJcXFxccHJvamVjdFxcXFxnZl91aVxcXFxzcmNcXFxcdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVuaXZlcnNpdHlcXFxcXHU3ODE0XHU0RTAwXHU0RTBCXFxcXHByb2plY3RcXFxcZ2ZfdWlcXFxcc3JjXFxcXHV0aWxzXFxcXGJ1aWxkLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Vbml2ZXJzaXR5LyVFNyVBMCU5NCVFNCVCOCU4MCVFNCVCOCU4Qi9wcm9qZWN0L2dmX3VpL3NyYy91dGlscy9idWlsZC50c1wiO2ltcG9ydCBpbXBvcnRUb0NETiBmcm9tICd2aXRlLXBsdWdpbi1jZG4taW1wb3J0JztcclxuXHJcbi8qKlxyXG4gKiBcdTYyNTNcdTUzMDVcdTc2RjhcdTUxNzNcclxuICogXHU2Q0U4XHU2MTBGIHByb2RVcmxcdUZGMUFcdTRGN0ZcdTc1MjhcdTc2ODRcdTY2MkYganNkZWxpdnIgXHU4RkQ4XHU2NjJGIHVucGtnXHUzMDAyXHU1QjgzXHU0RUVDXHU3Njg0IHBhdGggXHU1M0VGXHU4MEZEXHU0RTBEXHU0RTAwXHU4MUY0XHJcbiAqIFx1NjU4N1x1N0FFMFx1OTRGRVx1NjNBNVx1RkYxQWh0dHBzOi8vYmxvZy5jc2RuLm5ldC9xcV8zNDQ1MDc0MS9hcnRpY2xlL2RldGFpbHMvMTI5NzY2Njc2XHVGRjBDXHU0RjdGXHU3NTI4XHU3Njg0XHU2NjJGIGpzZGVsaXZyXHJcbiAqIEBkZXNjcmlwdGlvbiBpbXBvcnRUb0NETiBodHRwczovL2dpdGh1Yi5jb20vbW1mLWZlL3ZpdGUtcGx1Z2luLWNkbi1pbXBvcnRcclxuICogQGRlc2NyaXB0aW9uIGNkbiBcdTU3MjhcdTdFQkZcdTVGMTVcdTUxNjVcdTc2ODQgY2RuIFx1NTczMFx1NTc0MFx1OTE0RFx1N0Y2RVx1MzAwMnBhdGhcdUZGMUFodHRwczovL3d3dy5qc2RlbGl2ci5jb20vIHx8IGh0dHBzOi8vdW5wa2cuY29tL1xyXG4gKiBAZGVzY3JpcHRpb24gZXh0ZXJuYWwgXHU2MjUzXHU1MzA1XHU2NUY2XHVGRjBDXHU4RkM3XHU2RUU0XHU1MzA1XHU1QkZDXHU1MTY1XHUzMDAyXHU1M0MyXHU4MDAzXHVGRjFBaHR0cHM6Ly9yb2xsdXBqcy5vcmcvY29uZmlndXJhdGlvbi1vcHRpb25zLyNleHRlcm5hbFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGJ1aWxkQ29uZmlnID0ge1xyXG4gICAgY2RuKCkge1xyXG4gICAgICAgIHJldHVybiBpbXBvcnRUb0NETih7XHJcbiAgICAgICAgICAgIHByb2RVcmw6ICdodHRwczovL3VucGtnLmNvbS97bmFtZX1Ae3ZlcnNpb259L3twYXRofScsXHJcbiAgICAgICAgICAgIG1vZHVsZXM6IFtcclxuICAgICAgICAgICAgICAgIC8vIGF1dG9Db21wbGV0ZSgndnVlJyksXHJcbiAgICAgICAgICAgICAgICAvLyBhdXRvQ29tcGxldGUoJ2F4aW9zJyksXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Z1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyOiAnVnVlJyxcclxuICAgICAgICAgICAgICAgICAgICBwYXRoOiAnZGlzdC92dWUuZ2xvYmFsLmpzJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Z1ZS1kZW1pJyxcclxuICAgICAgICAgICAgICAgICAgICB2YXI6ICdWdWVEZW1pJyxcclxuICAgICAgICAgICAgICAgICAgICBwYXRoOiAnbGliL2luZGV4LmlpZmUuanMnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyOiAnVnVlUm91dGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBwYXRoOiAnZGlzdC92dWUtcm91dGVyLmdsb2JhbC5qcycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdlbGVtZW50LXBsdXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhcjogJ0VsZW1lbnRQbHVzJyxcclxuICAgICAgICAgICAgICAgICAgICBwYXRoOiAnZGlzdC9pbmRleC5mdWxsLmpzJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgICAgICAvLyBcdG5hbWU6ICdAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHZhcjogJ0VsZW1lbnRQbHVzSWNvbnNWdWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHRwYXRoOiAnZGlzdC9pbmRleC5paWZlLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAnZWNoYXJ0cycsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHZhcjogJ2VjaGFydHMnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHRwYXRoOiAnZGlzdC9lY2hhcnRzLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAnZWNoYXJ0cy1nbCcsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHZhcjogJ2VjaGFydHMtZ2wnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHRwYXRoOiAnZGlzdC9lY2hhcnRzLWdsLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAnZWNoYXJ0cy13b3JkY2xvdWQnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHR2YXI6ICdlY2hhcnRzLXdvcmRjbG91ZCcsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHBhdGg6ICdkaXN0L2VjaGFydHMtd29yZGNsb3VkLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAndnVlLWkxOG4nLFxyXG4gICAgICAgICAgICAgICAgLy8gXHR2YXI6ICdWdWVJMThuJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0cGF0aDogJ2Rpc3QvdnVlLWkxOG4uZ2xvYmFsLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAnanNwbHVtYicsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHZhcjogJ2pzUGx1bWInLFxyXG4gICAgICAgICAgICAgICAgLy8gXHRwYXRoOiAnZGlzdC9qcy9qc3BsdW1iLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAnY3JvcHBlcmpzJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0dmFyOiAnQ3JvcHBlcicsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHBhdGg6ICdkaXN0L2Nyb3BwZXIubWluLmpzJyxcclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgICAgICAvLyBcdG5hbWU6ICdzb3J0YWJsZWpzJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0dmFyOiAnU29ydGFibGUnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHRwYXRoOiAnU29ydGFibGUubWluLmpzJyxcclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgICAgICAvLyBcdG5hbWU6ICdxcmNvZGVqczItZml4ZXMnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHR2YXI6ICdRUkNvZGUnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHRwYXRoOiAncXJjb2RlLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAncHJpbnQtanMnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHR2YXI6ICdwcmludEpTJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0cGF0aDogJ2Rpc3QvcHJpbnQubWluLmpzJyxcclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgICAgICAvLyBcdG5hbWU6ICdAd2FuZ2VkaXRvci9lZGl0b3InLFxyXG4gICAgICAgICAgICAgICAgLy8gXHR2YXI6ICd3YW5nRWRpdG9yJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0cGF0aDogJ2Rpc3QvaW5kZXgubWluLmpzJyxcclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgICAgICAvLyBcdG5hbWU6ICdAd2FuZ2VkaXRvci9lZGl0b3ItZm9yLXZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHZhcjogJ1dhbmdFZGl0b3JGb3JWdWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHRwYXRoOiAnZGlzdC9pbmRleC5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0bmFtZTogJ3Z1ZS1ncmlkLWxheW91dCcsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHZhcjogJ1Z1ZUdyaWRMYXlvdXQnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHRwYXRoOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS92dWUtZ3JpZC1sYXlvdXRAMy4wLjAtYmV0YTEvZGlzdC92dWUtZ3JpZC1sYXlvdXQudW1kLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGV4dGVybmFsOiBbXHJcbiAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgLy8gJ2F4aW9zJyxcclxuICAgICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgJ2VsZW1lbnQtcGx1cycsXHJcbiAgICAgICAgLy8gJ0BlbGVtZW50LXBsdXMvaWNvbnMtdnVlJyxcclxuICAgICAgICAvLyAnZWNoYXJ0cycsXHJcbiAgICAgICAgLy8gJ2VjaGFydHMtZ2wnLFxyXG4gICAgICAgIC8vICdlY2hhcnRzLXdvcmRjbG91ZCcsXHJcbiAgICAgICAgLy8gJ3Z1ZS1pMThuJyxcclxuICAgICAgICAvLyAnanNwbHVtYicsXHJcbiAgICAgICAgLy8gJ2Nyb3BwZXJqcycsXHJcbiAgICAgICAgLy8gJ3NvcnRhYmxlanMnLFxyXG4gICAgICAgIC8vICdxcmNvZGVqczItZml4ZXMnLFxyXG4gICAgICAgIC8vICdwcmludC1qcycsXHJcbiAgICAgICAgLy8gJ0B3YW5nZWRpdG9yL2VkaXRvcicsXHJcbiAgICAgICAgLy8gJ0B3YW5nZWRpdG9yL2VkaXRvci1mb3ItdnVlJyxcclxuICAgICAgICAvLyAndnVlLWdyaWQtbGF5b3V0JyxcclxuICAg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
