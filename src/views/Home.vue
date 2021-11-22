<template>
  <main>
    <h1>
      <img src="@/assets/logo.svg" alt="logo" />
    </h1>
    <h2>
      <img src="@/assets/logo2.svg" alt="台語" />
    </h2>
    <p>是你租借UBike的好幫手！</p>
    <router-link to="/rent" class="bike_logo">
      <img src="@/assets/icon_bike.svg" alt="腳踏車圖" />
    </router-link>
  </main>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
main {
  background: white;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  margin: 20px 0;
  gap: 30px;
  h1 {
    height: 80px;
    img {
      height: 100%;
    }
    @include breakpoint.tablet {
      height: 120px;
    }
    @include breakpoint.desktop {
      height: 150px;
    }
  }
  h2 {
    height: 25px;
    img {
      height: 100%;
    }
    @include breakpoint.tablet {
      height: 40px;
    }
  }
  p {
    font-size: 1rem;
    @include breakpoint.tablet {
      font-size: 1.5rem;
    }
  }
  .bike_logo {
    width: 80px;
    &:hover {
      animation: shaking 1s linear alternate;
      animation-iteration-count: 1;
      &::after {
        content: "";
        color: black;
        font-size: 2rem;
        animation: going 1s 1s infinite;
      }
    }
    img {
      width: 100%;
      margin-bottom: 30px;
    }
    @include breakpoint.tablet {
      width: 130px;
    }
  }
}

@keyframes shaking {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg) scale(1.1);
  }
}

@keyframes going {
  0% {
    content: "點擊粗花";
  }
  100% {
    content: "點擊粗花";
  }
}
</style>
