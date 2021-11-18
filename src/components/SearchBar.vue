<template>
  <div class="search_bar">
    <p class="title">站名搜尋</p>
    <input type="text" placeholder="請輸入關鍵字站名" value="" />
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
        <p>站點</p>
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
    <button class="search_button">搜尋</button>
  </div>
</template>

<script>
import getApi from '@/services/getApi.js'
import citiesList from '@/assets/data/citiesList.json'

export default {
  props: [],
  data() {
    return {
      chosedCity: '請選擇',
      chosedStation: '請選擇站點',
      stationsList: [],
    }
  },
  computed: {
    citiesList() {
      return citiesList
    },
    stationsName() {
      let stationsList = ['---']
      this.stationsList.map((station) =>
        stationsList.push(station.StationName.Zh_tw),
      )
      return stationsList
    },
  },
  methods: {
    getChosedCity(event) {
      this.chosedCity = event.target.innerHTML
    },
    getChosedStation(event) {
      this.chosedStation = event.target.innerHTML
    },
    getCityStationApi(city) {
      getApi.getCityStation(city).then((res) => (this.stationsList = res.data))
    },
    getchosedCityLink() {
      let arr = this.citiesList.filter(
        (city) => city.cityName === this.chosedCity,
      )
      return arr[0].cityLink
    },
  },
  watch: {
    chosedCity() {
      let city = this.getchosedCityLink()
      this.getCityStationApi(city)
    },
  },
}
</script>

<style lang="scss" scoped>
.search_bar {
  background: white;
  border-radius: 5px;
  padding: 2% 4%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  box-shadow: 1px 1px 3px #403e3ee8;
  .title {
    font-size: 1.5rem;
    font-weight: 700;
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
    text-align: start;
    display: flex;
    gap: 5px;
  }

  .search_button {
    background: color.$color-yellow;
    border-radius: 10px;
    width: 100%;
    padding: 10px;
  }
}

.dropdown {
  .dropdown-menu {
    height: 250px;
    overflow: scroll;
  }
}
</style>
