<template>
  <Nav_Bar v-if="$route.path != '/'"></Nav_Bar>
  <router-view />
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import Nav_Bar from "@/components/Nav.vue";

export default {
  components: { Nav_Bar },
};
</script>

<style lang="scss">
// @import 'bootstrap/scss/bootstrap';
@use "@/assets/scss/abstract/_reset.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: #1b7c59;
  min-height: 100vh;
  padding: 0 2% 2%;
  display: flex;
  flex-direction: column;
}

main {
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  padding: 0;
  background: white;
  flex: 1;

  @include breakpoint.tablet {
    border-radius: 80px;
  }
}
</style>
