<template>
  <div class="card_group">
    <div class="card_group_img">
      <img src="@/assets/replacedImg.svg" alt="假圖" />
      <p>{{ route.RouteName }}</p>
    </div>
    <div class="card_group_information">
      <p>車道資訊</p>
      <p class="distance">
        <img src="@/assets/icon_yellow.svg" alt="黃色地標icon" />
        約{{ routeDistance }}km
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["route"],
  data() {
    return {};
  },
  computed: {
    routeDistance() {
      let km = this.route.CyclingLength / 1000;
      return km;
    },
  },
};
</script>

<style lang="scss" scoped>
@use "~@/assets/scss/abstract/_color.scss";

.card_group {
  width: 230px;
  &_img {
    width: 100%;
    height: 150px;
    border-radius: 5px;
    box-shadow: 1px 4px 4px #c9c3c3;
    margin-bottom: 20px;
    color: white;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }

    p {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 80%;
      height: fit-content;
      margin: auto;
      font-size: 1.2rem;
      font-weight: 700;
    }
  }
  &_information {
    box-shadow: 4px 5px 5px #1b7c59ab;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    img {
      height: 40px;
    }
    .distance {
      color: color.$color-green;
    }
  }
}

.card_group_img {
  &:hover {
    background: linear-gradient(180deg, #66a267cb 0%, #eec2309f 100%);
    img {
      mix-blend-mode: overlay;
    }
    p {
      z-index: 10;
      text-shadow: 1px 1px 5px #000000c2;
    }
  }
}
</style>
