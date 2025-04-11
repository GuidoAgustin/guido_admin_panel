<template>
  <div class="counter-widget">
    <div class="counter-widget-head">
      <h6>{{ title }}</h6>
    </div>
    <div class="counter-widget-body">
      <div>
        <h3>{{ moneySign }}{{ count }}</h3>
        <p class="small m-0" v-if="description">{{ description }}</p>
      </div>

      <div class="chart" v-if="$slots.default">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
    count: Number,
    moneySign: String
  }
}
</script>

<style></style>
