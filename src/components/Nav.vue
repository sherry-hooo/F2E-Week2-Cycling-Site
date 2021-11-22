<template>
  <nav>
    <router-link to="/rent">租借UBike</router-link>
    <router-link to="/routeMap">卡個路線</router-link>
    <router-link to="/nearSite">附近景點美食</router-link>
  </nav>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<style scoped lang="scss">
nav {
  display: flex;
  justify-content: center;
  font-size: 1rem;

  @include breakpoint.tablet {
    font-size: 1.5rem;
  }

  a {
    font-weight: 700;
    color: white;
    padding: 20px 20px;

    @include breakpoint.tablet {
      padding: 20px 30px;
    }

    &:hover {
      background: white;
      color: black;
      border-radius: 1px 1px 10px 10px;
      box-shadow: 5px 0 10px #1b1919a8;
    }
    &.router-link-exact-active {
      background: white;
      color: black;
      border-radius: 1px 1px 10px 10px;
      box-shadow: 5px 0 10px #1b1919a8;
    }
  }
}
</style>
