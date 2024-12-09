<template>
  <v-app id="inspire">
    <div class="search-box">
      <div>
        <CustomSearchComponent @on-address-change="onAddressChangeInit" />
      </div>
      <div>
        <CustomSearchComponent @on-address-change="onAddressChangeDest" />
        <button class="search-box__button" @click="onCentralBar">
          CentralBar
        </button>
      </div>
    </div>
    <div id="main" class="pa-0">
      <HereMapComponent ref="hereMapComponent" :center="center" />
    </div>
    <div v-if="results.length > 0" class="ma-1 result-box">
      <ResultCardComponent
        v-for="(result, idx) in results"
        :key="idx"
        :result="result"
        @click="onResultCardClick(result)"
      />
    </div>
  </v-app>
</template>

<script>
import HereMapComponent from "./components/HereMapComponent.vue";
import SearchAddressInputComponent from "./components/SearchAddressInputComponent.vue";
import ResultCardComponent from "./components/ResultCardComponent.vue";
import CustomSearchComponent from "./components/CustomSearchComponent.vue";

import axios from "axios";

export default {
  components: {
    CustomSearchComponent,
    HereMapComponent,
    SearchAddressInputComponent,
    ResultCardComponent,
  },
  name: "App",
  data() {
    return {
      center: {
        lat: 40.4165,
        lng: -3.70256,
      },
      middle: {},
      address1: null,
      address2: null,
      results: [],
      selectedPlace: null,
    };
  },
  methods: {
    async onCentralBar() {
      this.calculateMiddlePoint();
      this.$refs.hereMapComponent.setCenterAndZoom(this.middle, 16);
      await this.getPlacesAroundCenter();
      this.$refs.hereMapComponent.addResultMarkers(this.results);
    },
    toRad(x) {
      return (x * Math.PI) / 180;
    },
    toDeg(x) {
      return x * (180 / Math.PI);
    },
    calculateMiddlePoint() {
      //-- Initialize variables
      var lat1 = this.address1.lat;
      var lng1 = this.address1.lng;
      var lat2 = this.address2.lat;
      var lng2 = this.address2.lng;
      //-- Longitude difference
      var dLng = this.toRad(lng2 - lng1);

      //-- Convert to radians
      lat1 = this.toRad(lat1);
      lat2 = this.toRad(lat2);
      lng1 = this.toRad(lng1);

      var bX = Math.cos(lat2) * Math.cos(dLng);
      var bY = Math.cos(lat2) * Math.sin(dLng);
      var lat3 = Math.atan2(
        Math.sin(lat1) + Math.sin(lat2),
        Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY)
      );
      var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);
      this.middle = {
        lat: this.toDeg(lat3),
        lng: this.toDeg(lng3),
      };
    },
    async getPlacesAroundCenter() {
      this.results = [];
      try {
        const response = await axios.get(
          `https://browse.search.hereapi.com/v1/browse?at=${this.middle.lat},${this.middle.lng}&in=circle:${this.middle.lat},${this.middle.lng};r=500&categories=100-1000,100-1100,200-2000`,
          {
            params: {
              apiKey: import.meta.env.VITE_API_KEY_HERE,
            },
          }
        );
        if (response.data.items.length > 0) {
          this.results = response.data.items;
        } else {
          console.log("No hay resultados");
        }
      } catch (error) {
        console.error("Error al buscar direcciones:", error);
      }
    },
    onAddressChangeInit(coordinates) {
      this.address1 = coordinates;
      this.$refs.hereMapComponent.setMarkerInit(coordinates);
    },
    onAddressChangeDest(coordinates) {
      this.address2 = coordinates;
      this.$refs.hereMapComponent.setMarkerDest(coordinates);
    },
    onResultCardClick(result) {
      this.$refs.hereMapComponent.setCenterAndZoom(result.position, 20);
      this.$refs.hereMapComponent.onTapMarker(result);
    },
  },
};
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  height: 100dvh !important; // Ocupa toda la altura de la ventana
  margin: 0; // Eliminar cualquier margen para evitar el scroll
}

#main {
  flex: 1; // Este div ocupará todo el espacio disponible entre el search-box y result-box
  overflow: hidden; // Para asegurar que el contenido no provoque scroll
}

.result-box {
  background: transparent;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  overflow-x: scroll;
  @media (max-width: 400px) {
    display: none;
  }
}

.search-box {
  width: 20rem;
  position: absolute;
  z-index: 1;
  margin-top: 1rem;
  margin-left: 1rem;
  &__button {
    width: 100%;
    background: white;
    padding: 0.5rem;
    border-radius: 4px;
    font-weight: 500;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    text-transform: uppercase;
    &--invisible {
      height: 0rem;
      width: 0rem;
      display: contents;
    }
    &:hover {
      background-color: whitesmoke;
    }
  }
  @media (max-width: 340px) {
    width: 80%;
    border: 1px solid red;
  }
}
</style>
