<template>
  <vue-modal @close="$emit('close')" ref="modal" size="md" class="gallery-modal">
    <template #body>
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="10"
        loop
        pagination
        class="swiper-light"
        @swiper="onSwiper"
      >
        <swiper-slide v-for="(photo, phi) in items" :key="phi">
          <div class="img-container" :style="`background-image: url(${photo.url})`" />
        </swiper-slide>
      </swiper>
    </template>
  </vue-modal>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    items: Array,
    selectedIndex: Number
  },
  data: () => ({
    swiperEl: null,
    modules: [Pagination]
  }),
  methods: {
    onSwiper(swiper) {
      this.swiperEl = swiper

      if (this.selectedIndex) {
        this.swiperEl.slideTo(this.selectedIndex)
      }
    },
    close() {
      this.$refs.modal.close()
    }
  }
}
</script>
