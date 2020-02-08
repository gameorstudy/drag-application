<template>
  <div
    class="w-100 vh-100 mh-80 bg-teal d-flex justify-content-center align-items-center"
    style="min-height: 80px"
  >
    <transition name="fade" mode="out-in">
      <b-button
        v-show="!faded"
        @click="showProgress"
        pill
        variant="primary "
        class="flex-size"
        >ENTER</b-button
      >
    </transition>
    <transition name="bloom" mode="in-out">
      <b-progress-bar
        v-show="show"
        class="w-50"
        :value="value"
        :max="max"
        :label="`${((value / max) * 100).toFixed(2)}%`"
        animated
        style="height: 20px"
      ></b-progress-bar>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      faded: false,
      value: 0,
      max: 100,
      timeout: ''
    }
  },
  methods: {
    disappear() {
      this.faded = !this.faded
    },
    appear() {
      this.show = !this.show
    },
    showProgress() {
      this.disappear()
      setTimeout(this.appear, 900)
      this.timeout = setInterval(this.load, 1000)
    },
    load() {
      if (this.value < this.max) {
        this.value += Math.random() * 10 + 10
      }
      if (this.value >= this.max) {
        this.value = this.max
        this.$router.push({ path: 'problem-solving' })
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timeout)
  }
}
</script>

<style scoped>
.bg-teal {
  background-color: #20c997;
}

@media screen and (min-width: 980px) {
  .flex-size {
    padding: 0.5rem 1rem;
    font-size: 1.25rem;
    line-height: 1.5;
  }
}

@media screen and (max-width: 767px) {
  .flex-size {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
  }
}

.fade-leave-active {
  transition: opacity 0.8s ease-in;
}

.fade-leave-to {
  opacity: 0;
}

.bloom-enter-active {
  transition: opacity 1.2s ease-out;
}

.bloom-enter {
  opacity: 0;
}
</style>
