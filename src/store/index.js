import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/default-board.js'
import { _shuffle } from '@/utils.js'

Vue.use(Vuex)

const local_storage = localStorage.getItem('res')

export default new Vuex.Store({
  state: {
    storage: local_storage || storage,
    answersList: _shuffle()
  },
  mutations: {
    UPDATE(state, { newAnswersList }) {
      state.answersList = newAnswersList
    }
  },
  modules: {}
})
