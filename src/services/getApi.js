import axios from "axios";
import jsSHA from "jssha";

const apiClient = axios.create({
  baseURL: "https://ptx.transportdata.tw/MOTC/v2/Bike/",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...getAuthorizationHeader(),
  },
});

export default {
  getCityStation(city) {
    return apiClient.get(`/Station/${city}?$format=JSON`);
  },
  getAvailableBikes(city) {
    return apiClient.get(`/Availability/${city}`, {
      params: {
        // $filter: `StationUID eq '${id}'`,
        $format: "JSON",
      },
    });
  },
  getNearStation(lat, lon) {
    return apiClient.get(`/Station/NearBy`, {
      params: {
        $spatialFilter: `nearby(${lat} ,${lon}, 300)`,
        $format: "JSON",
      },
    });
  },
  getNearStationAvailability(lat, lon) {
    return apiClient.get(`/Availability/NearBy`, {
      params: {
        $spatialFilter: `nearby(${lat} ,${lon}, 500)`,
        $format: "JSON",
      },
    });
  },
  getCyclingRoute(city, top, skip) {
    return apiClient.get(
      `https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${city}`,
      {
        params: {
          $top: top,
          $skip: skip,
          $format: "JSON",
        },
      }
    );
  },
};

function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  let AppID = "00889de6156c405baaaa9c20918d88a3";
  let AppKey = "i8WOUOLfmnnAoctsSdU4yp2dEpI";
  //  填入自己 ID、KEY 結束
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  let HMAC = ShaObj.getHMAC("B64");
  let Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';
  return { Authorization: Authorization, "X-Date": GMTString };
}
