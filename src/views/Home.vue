<template>
  <div class="d-flex justify-space-between">
    <v-text-field
      placeholder="请输入关键词"
      variant="outlined"
      density="compact"
      class="mr-2"
    ></v-text-field>
    <v-btn color="deep-purple-accent-2">搜索</v-btn>
  </div>
  <v-card class="mx-auto">
    <!-- <v-toolbar color="deep-purple-accent-2">
      <v-btn icon="mdi-close"></v-btn>

      <v-toolbar-title>过滤规则</v-toolbar-title>
    </v-toolbar> -->

    <v-card-text>
      <h2 class="text-h6 mb-2">选择分类</h2>

      <v-chip-group v-model="calories" column multiple>
        <v-chip
          v-for="category in store.cagetories"
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
  <v-card class="mt-5">
    <div class="d-flex justify-end ma-2">
      <v-btn
        @click="exportOpml"
        variant="outlined"
        color="deep-purple-accent-2"
        :disabled="store.loves.length === 0"
        >导出opml</v-btn
      >
    </div>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">名称</th>
          <th class="text-left">描述</th>
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
            {{ item.title }}
          </td>
          <td>{{ item.description }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.url }}</td>
          <td>{{ item.lastBuildDate }}</td>
          <td>{{ item.count }}</td>
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
import { ref, onMounted, computed } from "vue";
import { useAppStore } from "@/store/app";
import { jsonToOpml } from "@/utils/opmlUtils";

const store = useAppStore();
const calories = ref([]);

const fetchFeeds = async () => {
  await store.fetchFeeds();
};

const exportOpml = () => {
  const opml = jsonToOpml(store.loves);
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

onMounted(async () => {
  await fetchFeeds();
});

const feeds = computed(() => {
  const cagetories = calories.value;
  console.log(cagetories, store.feeds);
  return store.feeds.filter((item) => cagetories.includes(item.category));
});
</script>
