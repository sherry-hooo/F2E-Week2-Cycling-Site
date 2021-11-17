<template>
  <div id="nav">
    <router-link to="/">租借UBike</router-link>
    <router-link to="/routeMap">卡個路線</router-link>
    <router-link to="/nearSite">附近景點美食</router-link>
  </div>
  <router-view />
  <div id="map"></div>
</template>

<script>
import L from 'leaflet'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

export default {
  data() {
    return {
      openStreetMap: null,
      marker: null,
    }
  },
  mounted() {
    // target location
    this.openStreetMap = L.map('map', {
      center: [25.0408578889, 121.567904444],
      // 可以嘗試改變 zoom 的數值
      // 筆者嘗試後覺得 18 的縮放比例是較適當的查詢範圍
      zoom: 18,
    })

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1Ijoic2hlcnJ5aG8iLCJhIjoiY2t3Mzc4djhxZTFyZDJvczdmeXFpdDY1diJ9.wpSDjKWWn5Nm_f5Y1oeGaA',
      },
    ).addTo(this.openStreetMap),
      // 標記 icon
      (this.marker = L.marker([25.0408578889, 121.567904444])
        .addTo(this.openStreetMap)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup())
  },
}
</script>

<style lang="scss">
// @import 'bootstrap/scss/bootstrap';
// @use '@/assets/scss/abstract/color.scss';

#map {
  width: 100%;
  height: 500px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: #1B7C59;
  height: 100vh;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
