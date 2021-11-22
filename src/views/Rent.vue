<template>
  <main>
    <figure>
      <Search_Bar
        v-on:submitSearch="submitSearch"
        v-on:zoomSearch="zoomSearch"
        v-if="!ifZoom"
      ></Search_Bar>
      <img
        v-if="ifZoom"
        id="SearchIcon"
        src="@/assets/icon_bike.svg"
        alt="搜尋視窗"
        @click="zoomSearch"
      />
      <img
        id="PositionIcon"
        src="@/assets/position_shadow.svg"
        alt="定位"
        @click="getCurrentPosition"
      />
      <div id="map"></div>
    </figure>
  </main>
</template>

<script>
import L from "leaflet";
import Search_Bar from "@/components/SearchBar.vue";
import getApi from "@/services/getApi.js";
import accessToken from "@/assets/data/mapboxToken.js";

export default {
  name: "Rent",
  components: { Search_Bar },
  data() {
    return {
      openStreetMap: {},
      marker: null,
      allStation: [],
      allStationPosition: [],
      chosedCityLink: "",
      chosedStation: "",
      centerPosition: [23.481634, 120.453745],
      ifZoom: false,
      currentPosition: ["lat", "lon"],
      markersGroup: [],
      markers: [],
      filteredData: [],
    };
  },
  computed: {
    greenMarker() {
      // 換icon
      return L.icon({
        iconUrl: require("@/assets/icon_green.svg"),
        iconSize: [70, 70], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
      });
    },
    yellowMarker() {
      return L.icon({
        iconUrl: require("@/assets/icon_yellow.svg"),
        iconSize: [70, 70], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAncho
      });
    },
  },
  methods: {
    // 取城市bike api
    getCityStationApi(city) {
      console.log(city, "-> check 取 api 的 city");
      return getApi.getCityStation(city).then((res) => {
        // console.log(res.data); // check only
        let allStationData = res.data;
        let allStationPosition = res.data.map(
          (station) => station.StationPosition
        );
        this.allStationPosition = allStationPosition;
        // return allStationPosition;
        return allStationData;
      });
    },
    // 取站點 availability api
    getAvailableBikesApi(city) {
      return getApi.getAvailableBikes(city).then((res) => res.data);
    },
    // 取300m內站點 api
    getNearAvailabilityApi(lat, lon) {
      return getApi
        .getNearStationAvailability(lat, lon)
        .then((res) => res.data);
    },
    // 取300m內站點 api
    getNearStationApi(lat, lon) {
      return getApi.getNearStation(lat, lon).then((res) => res.data);
    },
    // 搜尋送出後 action
    async submitSearch(data) {
      console.log(data, "check 送出的 cityLink & station"); // check only
      // 送出一樣的 city 資料不重新取 api
      if (data.chosedCityLink === this.chosedCityLink) {
        this.chosedStation = data.chosedStation;
        console.log("一樣的城市", this.chosedStation);
        let centerPosition = this.getCenterPosition(this.filteredData); // 取新站的position
        this.setCenter(centerPosition.StationLat, centerPosition.StationLon); // 新站設置中心
        this.openPopup(this.markers, centerPosition); // 開啟 popup
        return;
      }

      // chosedCityLink 與 station 存 data
      this.chosedCityLink = data.chosedCityLink;
      this.chosedStation = data.chosedStation;
      console.log(this.chosedCityLink, data.chosedCityLink);

      // // 發出該 city 所有站點的 api
      // let allStationData = await this.getCityStationApi(this.chosedCityLink);

      // // 發所有站點的即時 bike availability
      // let stationAvailability = await this.getAvailableBikesApi(
      //   this.chosedCityLink
      // );

      // // 篩選兩個api資料
      // let filteredData = await this.filterData(
      //   allStationData,
      //   stationAvailability
      // );

      let filteredData = await this.filterData();

      // 刪除原 marker 圖資
      this.deletMarker();

      // 設置 marker 圖資
      let markers = this.setMarker(filteredData);

      // 設置中心位置
      let centerPosition = this.getCenterPosition(filteredData);
      this.setCenter(centerPosition.StationLat, centerPosition.StationLon);

      // 打開 popup
      this.openPopup(markers, centerPosition);
    },
    // 篩選 api 所需資訊
    async filterData(status) {
      let stationApi = null;
      let availableApi = null;
      if (status === "nearBy") {
        console.log("nearby");
        console.log(this.currentPosition);
        stationApi = await this.getNearStationApi(
          this.currentPosition[0],
          this.currentPosition[1]
        );
        availableApi = await this.getNearAvailabilityApi(
          this.currentPosition[0],
          this.currentPosition[1]
        );
        console.log(stationApi);
        console.log(availableApi);
      } else {
        console.log("一般");
        stationApi = await this.getCityStationApi(this.chosedCityLink);
        availableApi = await this.getAvailableBikesApi(this.chosedCityLink);
        console.log(availableApi);
        console.log(stationApi);
      }

      let filteredData = availableApi.reduce((allData, availability) => {
        stationApi.reduce((eachData, station) => {
          if (station.StationUID === availability.StationUID) {
            eachData.StationUID = station.StationUID;
            eachData.StationName = station.StationName;
            eachData.StationAddress = station.StationAddress;
            eachData.StationPosition = station.StationPosition;
            eachData.UpdateTime = availability.UpdateTime.slice(11, 19);
            eachData.ServiceStatus = availability.ServiceStatus;
            eachData.AvailableRentBikes = availability.AvailableRentBikes;
            eachData.AvailableReturnBikes = availability.AvailableReturnBikes;
            allData.push(eachData);
          }
          return eachData;
        }, {});
        return allData;
      }, []);
      console.log(filteredData, "篩選過後的資料"); //check only
      this.filteredData = filteredData;
      return filteredData;
    },

    popUp(station) {
      return `
      <div class='popUp'>
      <div class='popUp_header'>
      <span class="stationName">${station.StationName.Zh_tw}</span>
      <span class='time text-secondary'>${station.UpdateTime}</span></div>

      <div class='popUp_body'>
      <div class='location'><div class="stop_icon"></div>${
        this.chosedCityLink
      }</div>
      <p class='address'>${station.StationAddress.Zh_tw}</p></div>

      <div class='popUp_footer'>
      <div class=${
        station.AvailableRentBikes === 0 ? "notAvailable" : "rental"
      }> 可借車輛<p class='count'>${station.AvailableRentBikes}</p></div>
      <div class=${
        station.AvailableReturnBikes === 0 ? "notAvailable" : "parking"
      }> 可停車位<p class='count'>${station.AvailableReturnBikes}</p></div>
      </div>
      </div>`;
    },
    // 設置 marker
    setMarker(list) {
      let greenMarker = this.greenMarker;
      let yellowMarker = this.yellowMarker;
      let markers = [];

      list.forEach((stop) => {
        let marker = L.marker(
          [stop.StationPosition.PositionLat, stop.StationPosition.PositionLon],
          {
            icon: this.yellowMarker,
          }
        ).bindPopup(this.popUp(stop), { className: "myPopup" });
        markers.push(marker);
      });
      this.markers = markers;
      let markerGroup = L.featureGroup(markers)
        .addTo(this.openStreetMap)
        .on("popupopen", function (e) {
          e.layer.setIcon(greenMarker);
        })
        .on("popupclose", function (e) {
          e.layer.setIcon(yellowMarker);
        });
      console.log(markerGroup);
      this.markersGroup = markerGroup;
      return markers;
      // this.openPopup(markers, centerPosition);
    },
    // 取得 centerposition
    getCenterPosition(filteredData) {
      // 設置中心
      let centerPosition = filteredData.reduce((position, stop) => {
        if (stop.StationName.Zh_tw === this.chosedStation) {
          position.StationLat = stop.StationPosition.PositionLat;
          position.StationLon = stop.StationPosition.PositionLon;
        } else {
          // 沒有 stop 的情況
        }
        return position;
      }, {});
      this.centerPosition = centerPosition;
      console.log(this.centerPosition);
      // this.setCenter(centerPosition.StationLat, centerPosition.StationLon);
      return centerPosition;
    },
    // 打開 popup
    openPopup(markers, centerPosition) {
      console.log(markers);
      markers.forEach((marker, index) => {
        if (
          marker._latlng.lat === centerPosition.StationLat &&
          marker._latlng.lng === centerPosition.StationLon
        ) {
          console.log("取到了");
          markers[index].openPopup();
          return;
        }
      });
    },

    // 刪除 marker
    deletMarker() {
      console.log("刪除marker");
      // this.openStreetMap.removeLayer(this.markers);
      // console.log(this.markersGroup);
      // this.openStreetMap.removeLayer(this.markersGroup);
      console.log(this.openStreetMap);
      this.openStreetMap.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.openStreetMap.removeLayer(layer);
        }
      });
    },

    // 設置鄰近地標
    async setNearStation() {
      let filteredData = await this.filterData("nearBy");

      // 刪除原 marker 圖資
      this.deletMarker();

      // 設置 marker 圖資
      this.setMarker(filteredData);
    },

    // 取定位
    getCurrentPosition() {
      console.log("getPosition");
      alert("記得開啟定位才能夠使用「附近」服務唷~");
      // console.log(this); // check only
      let obj = this;
      function success(position) {
        // 取經緯度
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        obj.setCenter(lat, lon, 15);
        // 設置 marker
        L.marker([lat, lon], {
          icon: obj.yellowMarker,
        })
          .addTo(obj.openStreetMap)
          .bindPopup("現在在這裡~")
          .openPopup();
        obj.currentPosition = [lat, lon];
        console.log(obj.currentPosition[0], obj.currentPosition[1]);
        //開始設定鄰近地標
        obj.setNearStation();

        // console.log(obj.markers);
        console.log(obj.markers.length == 0);
      }

      function error(e) {
        console.log(e); // check only
        alert("咦 不想玩看看定位功能嗎");
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      }
    },

    // 取得 openmap 圖資
    getMap(lat, lon, zoom = 15) {
      console.log("getMap"); // check only
      let myToken = accessToken.accessToken;
      console.log(myToken);
      // 綁定現在位置
      this.openStreetMap = L.map("map", {
        center: [lat, lon],
        zoom: zoom,
      });

      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 20,
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken: myToken,
        }
      ).addTo(this.openStreetMap);
      console.log(this.openStreetMap);
    },

    // 設置中心視野
    async setCenter(lat, lon, zoom = 18) {
      console.log("換中心");
      console.log(lat, lon);
      this.openStreetMap.panTo(new L.LatLng(lat, lon));
      this.openStreetMap.setZoom(zoom);
    },

    // 縮小搜尋window
    zoomSearch() {
      if (this.ifZoom === true) {
        this.ifZoom = false;
      } else {
        this.ifZoom = true;
      }
    },
  },
  watch: {
    chosedStation() {
      console.log("watch");
    },
  },
  mounted() {
    this.getMap(22.9996426, 120.2106908);
  },
};
</script>

<style lang="scss" scoped>
@use "@/assets/scss/base/leaflet.scss";

main {
  figure {
    flex: 1;
    position: relative;
    .search_bar {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      @include breakpoint.tablet {
        transform: none;
        top: 50%;
        left: 50px;
      }
      @include breakpoint.desktop {
      }
    }
    #SearchIcon {
      position: absolute;
      bottom: 50px;
      left: 30px;
      z-index: 2;
      width: 80px;
      height: 80px;
      cursor: pointer;
      filter: drop-shadow(0 0 3px rgb(51, 50, 50));
      @include breakpoint.mobile {
        bottom: 20px;
      }
      @include breakpoint.tablet {
        width: 80px;
        height: 80px;
        bottom: 50px;
        left: 50px;
      }
      @include breakpoint.desktop {
        width: 120px;
        height: 120px;
      }
    }
    #PositionIcon {
      position: absolute;
      bottom: 50px;
      right: 30px;
      z-index: 2;
      width: 80px;
      height: 80px;
      cursor: pointer;
      @include breakpoint.mobile {
        bottom: 20px;
      }
      @include breakpoint.tablet {
        width: 80px;
        height: 80px;
        bottom: 50px;
        right: 50px;
      }
      @include breakpoint.desktop {
        width: 120px;
        height: 120px;
      }
    }
  }
}

#map {
  width: 100%;
  height: 600px;
  border-radius: 30px;
  border: 5px solid white;
  z-index: 1;
  @include breakpoint.tablet {
    border-radius: 80px;
    border: 10px solid white;
  }
}
</style>
