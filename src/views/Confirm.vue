<template>
  <div class="confirm-view flex flex-row mx-4 mx-auto pt-4 pb-2 rounded shadow">
    <p v-if="filled === storage.length">
      You have finished all the blanks, well done!
    </p>
    <p v-else>
      You have finished <span style="color: tomato">{{ filled }}</span> in
      <span style="color: blue">{{ storage.length }}</span> blank(s).
    </p>
    <p>Do you want to submit it now?</p>
    <div class="d-flex flex-row mb-0 justify-content-end mr-3">
      <b-button pill variant="" @click="cancel">Cancel</b-button>
      <b-button pill variant="success" class="ml-3" @click="ensure"
        >Ok</b-button
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['storage']),
  props: {
    filled: {
      type: Number,
      required: true
    }
  },
  methods: {
    cancel() {
      this.$emit('sendCancelMsg')
    },
    ensure() {
      this.$emit('sendOkMsg')
    }
  }
}
</script>

<style scoped>
.confirm-view {
  position: relative;
  max-width: 24rem;
  background-color: lightgreen;
  margin: -12rem;
}

.confirm-view p:nth-child(1) {
  color: black;
  font-size: 1.24rem;
  line-height: 2rem;
  text-align: left;
  padding-left: 0.75rem;
}

.confirm-view p:nth-child(2) {
  color: gray;
  font-size: 1.18rem;
  line-height: 1.5rem;
  text-align: left;
  padding-left: 2rem;
  margin-bottom: 2rem;
}

button {
  width: 5rem;
}
</style>
