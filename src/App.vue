<template>
  <div id="app">
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    window.addEventListener("unload", this.saveState);
  },
  methods: {
    saveState() {
      window.sessionStorage.setItem(
        "state",
        JSON.stringify(this.$store.state.user)
      );
      window.sessionStorage.setItem(
        "claim",
        JSON.stringify(this.$store.state.claim)
      );
      window.sessionStorage.setItem(
        "admin",
        JSON.stringify(this.$store.state.admin)
      );
      window.sessionStorage.setItem(
        "general",
        JSON.stringify(this.$store.state.general)
      );
    },
  },
};
</script>

<style lang="less" scope>
html,
body,
p {
  font-family: "Open Sans" !important;
  margin: 0;
  padding: 0;
}
main {
  min-height: 560px;
}
html,
body {
  height: 100%;
  width: 100%;
  min-width: 1200px;
  background-color: rgb(244, 244, 244);
}
#app {
  height: 100%;
  width: 100%;
}
.el-notification {
  width: 300px;
}
.v-modal {
  opacity: 0.5;
  z-index: 1;
}
</style>
