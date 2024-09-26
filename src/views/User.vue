<template>
  <v-card class="mx-auto">
    <v-toolbar>
      <v-btn icon="mdi-account"></v-btn>
      <v-toolbar-title>我的收藏</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <h2 class="text-h6 mb-2">选择分类</h2>
      <v-chip-group v-model="calories" column multiple>
        <v-chip
          v-for="category in new Set(store.loves.map((item) => item.category))"
          :key="category"
          :value="category"
          text="Elevator"
          variant="outlined"
          filter
          >{{ category }}</v-chip
        >
      </v-chip-group>
    </v-card-text>
  </v-card>
  <v-card flat class="mt-5">
    <div class="d-flex justify-end ma-2">
      <v-btn
        @click="exportOpml"
        variant="outlined"
        color="primary"
        :disabled="feeds.length === 0"
        :title="'导出opml:' + feeds.map((a) => a.title).join(',')"
        >导出opml ({{ feeds.length }})</v-btn
      >
    </div>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">名称</th>
          <th class="text-left">分类</th>
          <th class="text-left">链接</th>
          <th class="text-left">更新时间</th>
          <th class="text-left">订阅数量</th>
          <th class="text-left">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in feeds" :key="item.name">
          <td class="d-flex align-center">
            <img width="20" :src="item.icon" alt="" class="mr-2" />
            <div>
              <a
                class="text-decoration-none"
                :href="item.htmlUrl"
                target="_blank"
                v-text="item.title"
              >
              </a>
              <small
                class="text-truncate"
                style="max-width: 300px; display: block"
                v-text="item.description"
                :title="item.description"
              ></small>
            </div>
          </td>
          <td class="text-truncate" style="max-width: 100px">
            {{ item.category }}
          </td>
          <td :title="item.url">
            {{ item.url }}
          </td>
          <td style="width: 200px">{{ item.lastBuildDate }}</td>
          <td>{{ item.qty }}</td>
          <td>
            <v-btn variant="outlined" size="small" @click="toggleLove(item)">
              {{ isLoved(item) ? "已收藏" : "收藏" }}
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAppStore } from "@/store/app";
import { jsonToOpml } from "@/utils/opmlUtils";

const store = useAppStore();
const calories = ref([]);
const keyword = ref("");

const exportOpml = () => {
  const opml = jsonToOpml(feeds.value);
  const blob = new Blob([opml], { type: "text/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "feeds.opml";
  a.click();
};

const isLoved = (item) => {
  return store.loves.some((love) => love.url === item.url);
};

const toggleLove = (item) => {
  if (isLoved(item)) {
    store.removeLove(item);
  } else {
    store.addLove(item);
  }
};

const feeds = computed(() => {
  const cagetories = new Set(calories.value);
  function f(item) {
    return (
      (item.title && item.title.includes(keyword.value)) ||
      (item.description && item.description.includes(keyword.value)) ||
      (item.url && item.url.includes(keyword.value))
    );
  }
  return store.loves.filter((item) =>
    cagetories.size == 0
      ? keyword.value == "" || f(item)
      : cagetories.has(item.category) && f(item)
  );
});
</script>
