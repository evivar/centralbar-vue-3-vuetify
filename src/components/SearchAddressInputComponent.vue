<template>
  <div class="search-address">
    <div class="search-address--input">
      <v-combobox
        label="Dirección"
        variant="solo-filled"
        density="compact"
        no-data-text="Escribe la direccion"
        v-model="address"
        v-model:search="search"
        :loading="loading"
        :items="items"
        auto-select-first
        item-text="title"
        item-value="position"
        @change="onSelect"
        v-on:enter="searchAddress"
        v-on:update="onSelect"
      >
      </v-combobox>
    </div>
    <div class="search-address--button">
      <v-btn
        icon="$vuetify"
        stacked
        density="compact"
        rounded="0"
        class="mx-1"
        @click="searchAddress"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SearchAddressInput",
  data() {
    return {
      address: null,
      search: null,
      loading: false,
      items: [],
    };
  },
  watch: {
    // searchQuery: function () {
    //   this.searchAddresses();
    // },
    search(val) {
      //   val && val !== this.select && this.searchAddress();
    },
  },
  methods: {
    async searchAddress() {
      console.log("this.search :>> ", this.search);
      this.loading = true;
      try {
        const response = await axios.get(
          "https://geocode.search.hereapi.com/v1/geocode",
          {
            params: {
              q: this.search,
              apiKey: import.meta.env.VITE_API_KEY_HERE,
            },
          }
        );

        this.items = response.data.items.map((item) => ({
          title: item.title,
          coordinates: item.position,
        }));
      } catch (error) {
        console.error("Error al buscar direcciones:", error);
      } finally {
        this.loading = false;
      }
    },
    onSelect() {
      // Aquí puedes manejar la selección de una dirección
      // Por ejemplo, puedes emitir un evento o realizar alguna acción.
      // En este ejemplo, simplemente imprimimos la dirección seleccionada.
      if (this.selectedAddress) {
        console.log("Dirección seleccionada:", this.selectedAddress);
      }
    },
  },
};
</script>

<style lang="scss">
.search-address {
  display: flex;
  flex-direction: row;

  &--input {
    width: 100%;
  }
}
</style>
