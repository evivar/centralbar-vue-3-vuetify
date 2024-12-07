<template>
  <div class="result-card pa-2">
    <div class="result-card__title" :title="result.title">
      <span>{{ result.title }}</span>
      <p
        v-if="result.openingHours && result.openingHours[0]?.isOpen"
        class="result-card__open"
      >
        Abierto
      </p>
      <p v-else class="result-card__closed">Cerrado</p>
    </div>
    <p class="result-card__address">
      {{ result.address.street }}
      {{ result.address.houseNumber ? result.address.houseNumber : "" }}
    </p>
    <div class="result-card__tags">
      <span
        class="result-card__tags-tag"
        v-for="(tag, idx) in result.categories"
        :key="idx"
      >
        {{ tag.name }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultCardComponent",
  props: {
    result: {
      type: Object,
      default: {},
    },
  },
};
</script>

<style lang="scss" scoped>
.result-card {
  background: white;
  border: 1px solid black;
  border-radius: 0.3rem;
  min-width: 16rem;
  height: 8rem;
  &__title {
    font-weight: 700;
    justify-content: space-between;
    display: grid;
    grid-template-columns: 75% auto;
    & > span {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    & > button {
      background: #01b6b2;
      padding: 0.25rem;
      font-size: 13px;
      border-radius: 4px;
      color: white;
      &:hover {
        background: #359293;
        color: whitesmoke;
      }
    }
  }
  &__address {
    font-size: 12px;
    color: gray;
    margin-bottom: 0.1rem;
  }
  &__open {
    margin-top: 0.1rem;
    color: lightseagreen;
    font-size: 12px;
  }
  &__closed {
    margin-top: 0.1rem;
    color: coral;
    font-size: 12px;
  }
  &__tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.25rem;
    &-tag {
      font-size: 10px;
      padding: 0.25rem;
      border-radius: 4px;
      background: whitesmoke;
    }
  }
}
</style>