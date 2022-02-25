<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const cachedViews = computed(() => store.getters.cachedViews);

const router = useRoute();
const key = router.path;

</script>

<template>
  <section class="app-main">
    <router-view v-slot="{ Component }" :key="key">
      <keep-alive :include="cachedViews">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" />
        </transition>
      </keep-alive>
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>