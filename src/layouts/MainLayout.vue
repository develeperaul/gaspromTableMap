<template>
  <q-layout view="lhh Lpr lFf">
    <q-header elevated class="bg-white text-black q-py-md q-px-lg">
      <q-toolbar class="flex justify-between">
        <q-img
          src="~/assets/logo.svg"
          spinner-color="primary"
          spinner-size="82px"
          class="logo"
        />
        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title> -->

        <a href="/?logout=yes">Выйти</a>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
<style scoped lang="scss">
a {
  text-decoration: none;
  color: #000;
}
.logo {
  width: 135px;
  @media (max-width: 780px) {
    width: 75px;
  }
}
</style>
