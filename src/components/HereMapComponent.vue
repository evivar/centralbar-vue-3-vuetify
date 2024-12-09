
<template>
  <!--In the following div the HERE Map will render-->
  <div id="mapContainer" style="height: 100%; width: 100vw" ref="hereMap"></div>
  <place-dialog-component
    :place="selectedMarker"
    v-if="showMarkerDialog"
    @close="showMarkerDialog = false"
  />
</template>

<script>
import PlaceDialogComponent from "./PlaceDialogComponent.vue";

export default {
  name: "HereMap",
  components: {
    PlaceDialogComponent,
  },
  props: {
    center: Object,
    // center object { lat: 40.730610, lng: -73.935242 }
  },
  data() {
    return {
      platform: null,
      defaultLayers: null,
      map: null,
      ui: null,
      apikey: import.meta.env.VITE_API_KEY_HERE,
      markerInit: null,
      markerDest: null,
      resultsMarkers: [],
      resultsGroup: null,
      selectedMarker: null,
      showMarkerDialog: false,
    };
  },
  async mounted() {
    // Initialize the platform object:
    const platform = new window.H.service.Platform({
      apikey: this.apikey,
    });
    this.platform = platform;
    this.defaultLayers = this.platform.createDefaultLayers();
    this.initializeHereMap();
  },
  methods: {
    initializeHereMap() {
      // rendering map

      const mapContainer = this.$refs.hereMap;
      const H = window.H;
      // Obtain the default map types from the platform object
      var maptypes = this.platform.createDefaultLayers();

      // Instantiate (and display) a map object:
      var map = new H.Map(mapContainer, maptypes.vector.normal.map, {
        zoom: 10,
        center: this.center,
        // center object { lat: 40.730610, lng: -73.935242 }
      });
      this.map = map;
      addEventListener("resize", () => map.getViewPort().resize());

      // add behavior control
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      // add UI
      this.ui = H.ui.UI.createDefault(map, maptypes);
      // End rendering the initial map
    },
    setMarkerInit(coordinates) {
      if (this.markerInit) {
        this.map.removeObject(this.markerInit);
      }
      this.markerInit = new H.map.Marker(coordinates);
      this.map.addObject(this.markerInit);
    },
    setMarkerDest(coordinates) {
      if (this.markerDest) {
        this.map.removeObject(this.markerDest);
      }
      this.markerDest = new H.map.Marker(coordinates);
      this.map.addObject(this.markerDest);
    },
    setCenterAndZoom(middlePoint, zoom = 16) {
      this.map
        .getViewModel()
        .setLookAtData({ position: middlePoint, zoom: zoom });
    },
    onTapMarker(data) {
      this.selectedMarker = data;
      this.showMarkerDialog = true;
    },
    addResultMarkers(results) {
      var itemSet = new Set();
      for (var item of results) {
        var itemCoordinates = {
          lat: item.position.lat,
          lng: item.position.lng,
        };
        if (itemSet.has(itemCoordinates)) {
          itemCoordinates.lat += 0.0001;
          itemCoordinates.lng += 0.0001;
        }
        itemSet.add(itemCoordinates);
        let marker = new H.map.Marker({
          lat: itemCoordinates.lat,
          lng: itemCoordinates.lng,
        });
        let data = item;
        marker.setData(data);
        var uiErnes = this.ui;
        // var uiErnes = new H.ui.UI.createDefault(this.map, this.defaultLayers);
        var self = this;
        marker.addEventListener(
          "tap",
          function (event) {
            self.onTapMarker(event.target.getData());
          },
          false
        );
        this.map.addObject(marker);
      }
    },
  },
};
</script>

<style lang="scss">
.H_ui {
  display: none;
}
</style>
