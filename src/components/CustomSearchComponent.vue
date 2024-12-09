<template>
  <div class="custom-search-component">
    <input
      name="input"
      class="custom-search-component__input"
      v-model="inputValue"
      placeholder="Dirección"
      @input="filterResults"
      @focus="filterResults"
      @keydown.down="selectNext"
      @keydown.up="selectPrevious"
      @keydown.enter="searchAddress"
      @keyup.enter="searchAddress"
      @keydown.enter.prevent="searchAddress"
      @keypress.enter="searchAddress"
    />
    <ul
      v-if="showSuggestions && suggestions.length > 0"
      class="custom-search-component__results"
      @click.stop
    >
      <li
        v-for="(item, index) in suggestions"
        :key="index"
        @click="selectItem(item)"
        class="custom-search-component__results--result"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CustomSearchComponent",
  data() {
    return {
      inputValue: "",
      suggestions: [],
      showSuggestions: false,
      selectedSuggestionIndex: -1,
    };
  },
  computed: {
    filteredItems() {
      return this.suggestions.filter((item) =>
        item.text.toLowerCase().includes(this.inputValue.toLowerCase())
      );
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      // Verifica si el clic ocurrió fuera del componente
      if (!this.$el.contains(event.target)) {
        this.showSuggestions = false;
      }
    },
    async searchAddress() {
      console.log("searchAddress");
      this.loading = true;
      try {
        const response = await axios.get(
          "https://geocode.search.hereapi.com/v1/geocode",
          {
            params: {
              q: this.inputValue,
              apiKey: import.meta.env.VITE_API_KEY_HERE,
            },
          }
        );

        this.suggestions = response.data.items.map((item) => ({
          title: item.title,
          coordinates: item.position,
        }));
      } catch (error) {
        console.error("Error al buscar direcciones:", error);
      } finally {
        this.loading = false;
      }
    },
    filterResults() {
      this.showSuggestions = true;
      this.selectedSuggestionIndex = -1;
    },
    selectItem(item) {
      this.inputValue = item.title;
      this.showSuggestions = false;
      this.$emit("onAddressChange", item.coordinates);
    },
    selectNext() {
      if (this.selectedSuggestionIndex < this.filteredItems.length - 1) {
        this.selectedSuggestionIndex++;
      }
    },
    selectPrevious() {
      if (this.selectedSuggestionIndex > 0) {
        this.selectedSuggestionIndex--;
      }
    },
  },
};
</script>

<style lang="scss">
.custom-search-component {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  z-index: 1;
  max-height: 20rem;
  &__input {
    background: white;
    height: 48px;
    width: 100%;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    border-radius: 0.25rem;
    padding: 0.25rem;
    text-indent: 0.5rem;
  }
  &__results {
    position: absolute;
    background: white;
    padding: 0.25rem;
    margin-right: 0.25rem;
    margin-left: 0.25rem;
    list-style: none;
    margin-top: 0.15rem;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    height: auto;
    overflow-y: scroll;
    max-height: 25rem;
    z-index: 1;
    width: 99%;
    &--result {
      padding: 0.5rem;
      margin-top: 0.125rem;
      margin-bottom: 0.125rem;
    }
    &--result:hover {
      background: whitesmoke;
    }
  }
}
</style>
