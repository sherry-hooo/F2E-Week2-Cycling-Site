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
          {{ chosedStation }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li
            class="dropdown-item"
            v-for="station in stationsName"
            :key="station"
            @click="getChosedStation"
          >
            {{ station }}
          </li>
        </ul>
      </div>
    </div>
    <button
      class="search_button"
      @click="submitSearch(this.chosedCityLink, this.chosedStation)"
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
      chosedStation: "請選擇站點",
      stationsList: [],
      chosedCityLink: "",
      ifZoom: false,
    };
  },
  computed: {
    citiesList() {
      return citiesList;
    },
    stationsName() {
      let stationsList = ["---"];
      if (this.$route.path === "/rent") {
        this.stationsList.map((station) =>
          stationsList.push(station.StationName.Zh_tw)
        );
        return stationsList;
      } else {
        stationsList = [];
        return stationsList;
      }
    },
    dropBoxTitle() {
      if (this.$route.path === "/rent") {
        return "站名";
      } else {
        return "路線";
      }
    },
  },
  methods: {
    getChosedCity(event) {
      this.chosedCity = event.target.innerHTML;
    },
    getChosedStation(event) {
      this.chosedStation = event.target.innerHTML;
    },
    getCityStationApi(city) {
      getApi.getCityStation(city).then((res) => (this.stationsList = res.data));
    },
    getCyclingRoute(city, top, skip) {
      return getApi
        .getCyclingRoute(city, top, skip)
        .then((res) => (this.stationList = res.data));
    },
    getchosedCityLink() {
      let arr = this.citiesList.filter(
        (city) => city.cityName === this.chosedCity
      );
      return arr[0].cityLink;
    },
    submitSearch(chosedCityLink, chosedStation) {
      this.$emit("submitSearch", { chosedCityLink, chosedStation });
    },
    zoomSearch() {
      this.ifZoom = true;
      this.$emit("zoomSearch", this.ifZoom);
    },
  },
  watch: {
    chosedCity() {
      let city = this.getchosedCityLink();
      this.chosedCityLink = city;

      if (this.$route.path === "/rent") {
        this.getCityStationApi(city);
      } else {
        this.getCyclingRoute(city);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use "~@/assets/scss/abstract/_color.scss";

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
