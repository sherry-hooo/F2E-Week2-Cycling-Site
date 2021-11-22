<template>
  <main>
    <Search_Bar v-on:submitSearch="submitSearch"></Search_Bar>
    <figure>
      <Card_Group
        v-for="route in allRouteData"
        :key="route.id"
        :route="route"
      ></Card_Group>

      <!-- <div id="map"></div> -->
    </figure>
    <Pagination
      v-on:changePage="changePage"
      :isLast="isLast"
      :page="page"
    ></Pagination>
  </main>
</template>

<script>
// import L from 'leaflet'
import Search_Bar from "@/components/SearchBar.vue";
import Card_Group from "@/components/CardGroup.vue";
import Pagination from "@/components/Pagination.vue";
import getApi from "@/services/getApi.js";

export default {
  name: "RouteMap",
  components: { Search_Bar, Card_Group, Pagination },
  data() {
    return {
      openStreetMap: null,
      chosedCityLink: "",
      chosedCity: "",
      allRouteData: [],
      top: 8,
      page: 1,
      isLast: false,
    };
  },
  computed: {
    skipApi() {
      if (this.page === 1) {
        return 0;
      } else {
        return (this.page - 1) * 8;
      }
    },
  },
  methods: {
    getCyclingRoute(city, top, skip) {
      return getApi.getCyclingRoute(city, top, skip).then((res) => {
        if (res.data.length === 0) {
          this.isLast = true;
          return;
        } else if (res.data.length < 8) {
          console.log("最後一頁");
          this.isLast = true;
          this.allRouteData = res.data;
        } else {
          this.isLast = false;
          this.allRouteData = res.data;
        }
      });
    },
    async submitSearch(data) {
      this.page = 1;
      this.chosedCityLink = data.chosedCityLink;
      this.chosedCity = data.chosedCity;
      console.log(this.top, this.skipApi);
      this.getCyclingRoute(this.chosedCityLink, this.top, this.skipApi);
    },
    changePage(pageAction) {
      if (pageAction === "next") {
        this.page++;
      } else {
        this.page--;
      }
      this.getCyclingRoute(this.chosedCityLink, this.top, this.skipApi);
    },
    // changePage(page) {
    //   this.page = page;
    //   this.getCyclingRoute(this.chosedCityLink, this.top, this.skipApi);
    // },
  },
  // mounted() {
  //   // target location
  //   this.openStreetMap = L.map('map', {
  //     center: [25.0408578889, 121.567904444],
  //     // 可以嘗試改變 zoom 的數值
  //     // 筆者嘗試後覺得 18 的縮放比例是較適當的查詢範圍
  //     zoom: 18,
  //   })

  //   L.tileLayer(
  //     'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  //     {
  //       attribution:
  //         'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //       maxZoom: 18,
  //       id: 'mapbox/streets-v11',
  //       tileSize: 512,
  //       zoomOffset: -1,
  //       accessToken:
  //         'pk.eyJ1Ijoic2hlcnJ5aG8iLCJhIjoiY2t3Mzc4djhxZTFyZDJvczdmeXFpdDY1diJ9.wpSDjKWWn5Nm_f5Y1oeGaA',
  //     },
  //   ).addTo(this.openStreetMap),
  //     // 標記 icon
  //     (this.marker = L.marker([25.0408578889, 121.567904444])
  //       .addTo(this.openStreetMap)
  //       .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
  //       .openPopup())
  // },
};
</script>

<style lang="scss" scoped>
main {
  padding: 20px;
  @include breakpoint.tablet {
    padding: 30px 40px;
  }
  figure {
    flex: 1;
    position: relative;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    justify-items: center;
    justify-content: center;
    align-content: center;
    margin: 30px 0;
    row-gap: 20px;
    @include breakpoint.mobile {
      grid-template-columns: repeat(2, 1fr);
    }
    @include breakpoint.desktop {
      grid-template-columns: repeat(4, 0.2fr);
      column-gap: 20px;
      row-gap: 30px;
    }
  }
}

::v-deep .search_bar {
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0;
  align-items: center;
  justify-content: space-between;
  box-shadow: none;
  gap: 10px;
  @include breakpoint.mobile {
    gap: 5px;
    justify-content: center;
  }
  @include breakpoint.desktop {
    gap: 20px;
  }
  .title {
    min-width: 100px;
    order: 1;
    text-align: start;
  }
  .dropdown_box {
    gap: 5px;
    order: 3;
    flex: 1 1 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @include breakpoint.tablet {
      .dropdown + .dropdown {
        justify-content: flex-start;
      }
    }
    .dropdown {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      p {
        margin-right: 10px;
      }
      button {
        flex: 1;
        max-width: 250px;
      }
    }
  }
  .search_button {
    width: 100px;
    order: 2;
  }

  @include breakpoint.mobile {
    .title {
      order: 1;
    }
    .dropdown_box {
      order: 2;
      flex: 0 1 50%;
      width: 50%;
      gap: 10px;
      justify-content: space-evenly;
      div {
        flex: 1;
      }
    }
    .search_button {
      order: 3;
      width: 130px;
    }
  }
}

#position {
  width: 50px;
  height: 50px;
  img {
    width: 100%;
    height: 100%;
  }
}
#map {
  width: 100%;
  height: 100%;
  border-radius: 100px;
  border: 10px solid white;
  z-index: 1;
}
</style>
