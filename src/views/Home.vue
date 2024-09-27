<template>
  <v-card flat class="mx-auto">
    <v-card-title class="mt-5"
      ><v-text-field
        placeholder="请输入关键词 可以是网址或网站名称"
        variant="outlined"
        v-model="keyword"
      ></v-text-field
    ></v-card-title>

    <v-card-text>
      <h2 class="text-h6 mb-2">选择分类</h2>

      <v-chip-group v-model="calories" column multiple>
        <v-chip
          v-for="category in store.cagetories"
          :key="category"
          :value="category"
          variant="outlined"
          filter
          >{{ category }}</v-chip
        >
      </v-chip-group>
    </v-card-text>
  </v-card>
  <v-card flat v-if="feeds.length > 0" class="mt-5">
    <div class="d-flex justify-end ma-2">
      <v-btn
        @click="exportOpml"
        variant="outlined"
        color="primary"
        :disabled="store.loves.length === 0"
        :title="'导出opml:' + store.loves.map((a) => a.title).join(',')"
        >导出opml ({{ store.loves.length }})</v-btn
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
      <tbody class="relative">
        <tr v-for="item in feeds.slice(0, 100)" :key="item.name">
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
          <td>{{ item.lastBuildDate }}</td>
          <td>{{ item.qty }}</td>

          <td style="position: absolute; right: 0">
            <v-btn size="small" @click="toggleLove(item)">
              {{ isLoved(item) ? "已收藏" : "收藏" }}
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
  <v-card flat class="mt-5" v-else>
    <v-card-text class="mx-auto my-3">
      <p>没有找到你想要的？</p>
      <br />
      <a href="https://web2rss.cc"> 试试在 “web2rss”搜索 </a>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAppStore } from "@/store/app";
import { jsonToOpml } from "@/utils/opmlUtils";

const store = useAppStore();
const calories = ref([]);
const keyword = ref("");
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
  const cagetories = new Set(calories.value);
  function f(item) {
    return (
      (item.title && item.title.includes(keyword.value)) ||
      (item.description && item.description.includes(keyword.value)) ||
      (item.url && item.url.includes(keyword.value))
    );
  }
  return store.feeds.filter((item) =>
    cagetories.size == 0
      ? keyword.value == "" || f(item)
      : cagetories.has(item.category) && f(item)
  );
});
</script>
