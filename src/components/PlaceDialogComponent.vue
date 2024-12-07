<template>
  <div class="overlay">
    <div class="place-dialog">
      <div class="place-dialog__title">
        <span>{{ place.title }}</span>
        <button @click="$emit('close')" class="place-dialog__title--button">
          <img src="../assets/close.svg" alt="close" />
        </button>
      </div>
      <span
        v-if="place.openingHours && place.openingHours[0]?.isOpen"
        class="place-dialog__open"
      >
        Abierto
      </span>
      <span v-else class="place-dialog__closed"> Cerrado </span>
      <div class="place-dialog__tags">
        <span
          class="place-dialog__tags-tag"
          v-for="(tag, idx) in place.categories"
          :key="idx"
        >
          {{ tag.name }}
        </span>
      </div>
      <div class="place-dialog__content">
        <span>Dirección: </span>
        <span>
          {{ place.address.street }}
          {{ place.address.houseNumber ? place.address.houseNumber : "" }}</span
        >
        <span v-if="place.openingHours">Horario: </span>
        <div v-if="place.openingHours" class="place-dialog__content--schedule">
          <span v-for="(item, idx) in place.openingHours[0].text" :key="idx">{{
            item
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlaceDialogComponent",
  props: {
    place: {
      type: Object,
      default: {},
    },
  },
};
</script>

<style lang="scss" scoped>
.overlay {
  height: 100%;
  position: absolute;
  top: 0;
  background: rgba(128, 128, 128, 0.5);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.place-dialog {
  display: flex;
  flex-direction: column;
  width: 40%;
  max-height: 60%;
  position: relative;
  background: white;
  border-radius: 4px;
  filter: drop-shadow(1px 2px 4px hsla(0, 0%, 0%, 0.784));
  padding: 2rem;
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    & > span {
      font-weight: 700;
    }
    &--button {
      cursor: pointer;
      background-image: url("../assets/close.svg");
      width: 1.5rem;
    }
  }
  &__open {
    margin-top: 0.1rem;
    color: lightseagreen;
    margin-bottom: 0.5rem;
  }
  &__closed {
    margin-top: 0.1rem;
    color: coral;
    margin-bottom: 0.5rem;
  }
  &__tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
    &-tag {
      padding: 0.25rem;
      border-radius: 4px;
      background: whitesmoke;
    }
  }
  &__content {
    display: grid;
    grid-template-columns: 30% auto;
    grid-template-rows: auto auto;
    &--schedule {
      display: flex;
      flex-direction: column;
    }
  }
  @media (max-width: 700px) {
    width: 80%;
  }
}
</style>