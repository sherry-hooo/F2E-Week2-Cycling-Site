<template>
  <div class="search_bar">
    <p class="title">站名搜尋</p>
    <div v-if="$route.path === '/rent'" @click="zoomSearch" class="zoom_button">
      -
    </div>
    <div class="dropdown_box">
      <div class="dropdown">
        <p>縣市</p>
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ chosedCity }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li
            class="dropdown-item"
            v-for="city of citiesList"
            :key="city.id"
            :chosedCityLink="city.cityLink"
            @click="getChosedCity"
          >
            {{ city.cityName }}
          </li>
        </ul>
      </div>
      <div class="dropdown">
        <p>{{ dropBoxTitle }}</p>
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ chosedSubOption }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li
            class="dropdown-item"
            v-for="subOption in subOptions"
            :key="subOption"
            @click="getChosedSubOption"
          >
            {{ subOption }}
          </li>
        </ul>
      </div>
    </div>
    <button
      class="search_button"
      @click="submitSearch(this.chosedCityLink, this.chosedSubOption)"
    >
      搜尋
    </button>
  </div>
</template>

<script>
import getApi from "@/services/getApi.js";
import citiesList from "@/assets/data/citiesList.json";

export default {
  props: ["allRouteData"],
  data() {
    return {
      chosedCity: "請選擇",
      chosedSubOption: "請選擇",
      stationsList: [],
      ifZoom: false,
    };
  },
  computed: {
    citiesList() {
      if (this.$route.path === "/rent") {
        let ubikeCities = citiesList.filter((city) => city.Ubike);
        return ubikeCities;
      } else {
        let routeCities = citiesList.filter((city) => city.bikeRoute);
        return routeCities;
      }
    },
    subOptions() {
      let optionsList = ["---"];
      console.log("suboptionsssssss");
      if (this.$route.path === "/rent") {
        this.stationsList.map((station) =>
          optionsList.push(station.StationName.Zh_tw)
        );
        return optionsList;
      } else if (this.$route.path === "/routeMap") {
        this.stationsList.map((station) => optionsList.push(station.RouteName));
        return optionsList;
      } else {
        return this.stationsList;
      }
    },
    dropBoxTitle() {
      if (this.$route.path === "/rent") {
        return "站名";
      } else {
        return "路線";
      }
    },
    chosedCityLink() {
      let arr = this.citiesList.filter(
        (city) => city.cityName === this.chosedCity
      );
      return arr[0].cityLink;
    },
  },
  methods: {
    getChosedCity(event) {
      this.chosedCity = event.target.innerHTML;
    },
    getChosedSubOption(event) {
      this.chosedSubOption = event.target.innerHTML;
    },
    getCityStationApi(city) {
      getApi.getCityStation(city).then((res) => (this.stationsList = res.data));
    },
    getCyclingRoute(city) {
      getApi
        .getCyclingRoute(city)
        .then((res) => (this.stationsList = res.data));
    },
    submitSearch(chosedCityLink, chosedSubOption) {
      this.$emit("submitSearch", { chosedCityLink, chosedSubOption });
    },
    zoomSearch() {
      this.ifZoom = true;
      this.$emit("zoomSearch", this.ifZoom);
    },
  },
  watch: {
    chosedCity() {
      if (this.$route.path === "/rent") {
        this.getCityStationApi(this.chosedCityLink);
      } else if (this.$route.path === "/routeMap") {
        this.getCyclingRoute(this.chosedCityLink);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use "~@/assets/scss/abstract/_color.scss";
@use "~@/assets/scss/base/bootstrap.scss";

.search_bar {
  background: white;
  border-radius: 5px;
  padding: 20px;
  gap: 20px;
  box-shadow: 1px 1px 3px #403e3ee8;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  .title {
    font-size: 1.5rem;
    font-weight: 700;
  }
  .zoom_button {
    position: absolute;
    top: 20px;
    right: 20px;
    border: 1px solid #494848;
    width: 20px;
    height: 20px;
    line-height: 1;
    color: #494848;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
  }
  input {
    border: 1px solid black;
    border-radius: 10px;
    padding: 0 10px;
    width: 100%;
    height: 2.5rem;
    font-size: 1rem;
  }

  .dropdown_box {
    gap: 5px;
    display: flex;
    text-align: start;
  }

  .search_button {
    background: color.$color-yellow;
    width: 100%;
    border-radius: 10px;
    padding: 10px;
  }

  p {
    font-size: 1.1rem;
    @include breakpoint.tablet {
      font-style: 1.5rem;
    }
  }
}

.dropdown {
  .dropdown-menu {
    height: 250px;
    overflow: scroll;
  }
}
</style>
