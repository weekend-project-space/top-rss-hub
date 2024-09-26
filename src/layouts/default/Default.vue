<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar scroll-behavior="elevate" class="border-b" height="60">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="rail = !rail"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>
          <div class="d-flex align-center">
            <img
              width="30"
              src="https://webfollow.cc/logo.svg"
              alt="Top RSS Hub"
              class="mr-2"
            />
            Top RSS Hub
          </div>
        </v-app-bar-title>
      </v-app-bar>
      <v-navigation-drawer :rail="rail" class="border-r">
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-home-city"
            title="首页"
            value="home"
            to="/"
            :active="route.path === '/'"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-account"
            title="我的"
            value="account"
            to="/account"
            :active="route.path === '/account'"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const rail = ref(false);
</script>
