<template>
  <div class="container">
    <div class="mt-5 d-flex flex-row justify-content-center">
      <p class="title font-weight-bold">
        Drag and match the radicals to the Chinese Characters.
      </p>
    </div>
    <div class="d-flex flex-row justify-content-center mt-3">
      <div class="column">
        <div class="description" v-for="(stor, index) in storage" :key="index">
          {{ stor.description }}
        </div>
      </div>
      <div class="column ml-3 mr-3">
        <div
          class="blank"
          v-for="(stor, index) in storage"
          :key="index"
          @drop="moveRadical($event, index)"
          @dragenter="isFilled($event)"
          @dragleave="recover($event)"
          @dragover.prevent
          @dragenter.prevent
          draggable
          @dragstart="pickupRadical($event, index)"
        ></div>
      </div>
      <div class="column ml-3">
        <div
          class="answer"
          v-for="(answer, index) in answersList"
          :key="index"
          :draggable="!draggableActive[index]"
          @dragstart="pickupRadical($event, index)"
          @drop="moveRadical($event)"
          @dragenter="isFilled2($event)"
          @dragleave="recover2($event)"
          @dragover.prevent
          @dragenter.prevent
        >
          {{ answer }}
        </div>
      </div>
      <div class="column ml-3">
        <div
          class="result d-flex justify-content-center align-items-center"
          v-for="(stor, index) in storage"
          :key="index"
        >
          <template v-if="resultActive">
            <template v-if="right[index]">
              <b-icon-check variant="success" class="icon"></b-icon-check>
            </template>
            <template v-else>
              <b-icon-x variant="danger" class="icon"></b-icon-x>
            </template>
          </template>
        </div>
      </div>
    </div>

    <div class="d-flex flex-row justify-content-center mt-3">
      <b-button
        pill
        @click="gradeOrRedo"
        variant="success"
        class="btn-change mr-3"
        >{{ btnValue }}</b-button
      >
      <template v-if="confirmMsg">
        <div class="icon-wrapper">
          <svg class="icon" style="width: 36px; height: 36px; color: teal">
            <use xlink:href="/feather-sprite.svg#award" />
          </svg>
          <p>
            Your score(s): <span>{{ score }}</span
            >/<span>{{ storage.length }}</span>
          </p>
        </div>
      </template>
    </div>
    <div @click.self="close" v-if="closeActive">
      <ConfirmDialog
        :filled="filled"
        @sendCancelMsg="getCancelMsg"
        @sendOkMsg="getOkMsg"
      ></ConfirmDialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Confirm from '@/views/Confirm.vue'
import { _shuffle } from '@/utils.js'

export default {
  components: {
    ConfirmDialog: Confirm
  },
  data() {
    return {
      resultActive: false,
      right: [],
      blankActive: true,
      closeActive: false,
      filled: 0,
      score: -1,
      confirmMsg: false,
      btnValue: 'Submit',
      draggableActive: [],
      blankTrigger: false
    }
  },
  computed: {
    ...mapState(['storage', 'answersList'])
  },
  methods: {
    pickupRadical(e, index) {
      if (e.target.innerHTML) {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'
        e.dataTransfer.setData('radical', e.target.innerHTML)
      } else {
        e.dataTransfer.effectAllowed = 'none'
        e.dataTransfer.dropEffect = 'none'
      }
      e.dataTransfer.setData('index', index)

      if (e.target.className === 'answer') {
        e.dataTransfer.setData('order', 'in')
        this.blankTrigger = false
      } else {
        e.dataTransfer.setData('order', 'out')
        this.blankTrigger = true
      }
    },
    moveRadical(e, index) {
      const value = e.dataTransfer.getData('radical')
      if (!e.target.innerHTML) {
        e.target.innerHTML = value
        if (e.dataTransfer.getData('order') === 'in') {
          if (e.target.className === 'blank') {
            e.target.style = 'border: 1px dashed blue'
          } else {
            e.target.style = 'border: 1px solid black'
          }
          const answerList = document.getElementsByClassName('answer')
          const index = e.dataTransfer.getData('index')
          answerList[index].innerHTML = ''
        } else {
          if (e.target.className === 'answer') {
            e.target.style = 'border: 1px solid black'
          } else {
            e.target.style = 'border: 1px dashed blue'
          }
          const answerList = document.getElementsByClassName('blank')
          const index = e.dataTransfer.getData('index')
          answerList[index].innerHTML = ''
        }
      } else {
        if (e.dataTransfer.getData('order') === 'in') {
          e.target.style = 'border: 1px solid black'
        } else {
          e.target.style = 'border: 1px dashed blue'
          this.switchBlanks(e, index)
        }
      }
    },
    switchBlanks(e, toIndex) {
      const fromIndex = e.dataTransfer.getData('index')
      const blankList = document.getElementsByClassName('blank')
      const toAnswer = blankList[toIndex].innerHTML
      blankList[toIndex].innerHTML = blankList[fromIndex].innerHTML
      blankList[fromIndex].innerHTML = toAnswer
    },
    isFilled(e) {
      if (e.target.innerHTML) {
        if (e.target.className === 'blank' && this.blankTrigger) {
          e.target.style = 'border: 1px dashed yellow'
        } else {
          e.target.style = 'border: 1px solid tomato'
        }
      }
    },
    isFilled2(e) {
      if (e.target.innerHTML) {
        e.target.style = 'border: 1px solid tomato'
      }
    },
    recover(e) {
      e.target.style = 'border: 1px dashed blue'
    },
    recover2(e) {
      e.target.style = 'border: 1px solid black'
    },
    gradeOrRedo() {
      if (this.btnValue === 'Submit') {
        this.grade()
      } else {
        this.redo()
      }
    },
    grade() {
      this.right = []
      this.score = 0
      this.filled = 0

      const blankList = document.getElementsByClassName('blank')
      for (const index in this.storage) {
        this.draggableActive[index] = true
        if (blankList[index].innerHTML.trim()) {
          this.filled += 1
        }
        if (blankList[index].innerHTML.trim() === this.storage[index].answer) {
          this.right.push(true)
          this.score += 1
        } else {
          this.right.push(false)
        }
      }

      this.closeActive = true
    },
    redo() {
      for (const index in this.storage) {
        this.draggableActive[index] = false
      }

      this.resultActive = !this.resultActive
      this.confirmMsg = !this.confirmMsg

      const blankList = document.getElementsByClassName('blank')
      const answerList = document.getElementsByClassName('answer')

      const newAnswersList = _shuffle()
      this.$store.commit('UPDATE', {
        newAnswersList
      })

      for (const index in this.storage) {
        blankList[index].innerHTML = ''
        answerList[index].innerHTML = this.answersList[index]
      }

      this.btnValue = 'Submit'
    },
    close() {
      for (const index in this.storage) {
        this.draggableActive[index] = false
      }
      this.closeActive = false
    },
    getCancelMsg() {
      this.confirmMsg = false
      this.close()
    },
    getOkMsg() {
      this.close()
      this.confirmMsg = true
      this.resultActive = true
      this.btnValue = 'Redo'
      for (const index in this.storage) {
        this.draggableActive[index] = true
      }
    }
  }
}
</script>

<style scoped>
@media screen and (min-width: 980px) {
  .title {
    font-size: 2.5rem;
  }

  .btn-change {
    padding: 0.5rem 1rem;
    font-size: 1.25rem;
    line-height: 1.5;
  }
}

@media screen and (min-width: 769px) and (max-width: 979px) {
  .title {
    font-size: 1.5rem;
  }
}

@media screen and (max-width: 767px) {
  .title {
    font-size: 1rem;
  }

  .btn-change {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
  }
}

div.column > div {
  margin-bottom: 1rem;
}

div.column > .description {
  width: 4rem;
  text-align: center;
  line-height: 2rem;
  font-size: 1.5rem;
  font-family: KaiTi;
  font-weight: 600;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

div.column > .answer {
  width: 3rem;
  height: 3rem;
  text-align: center;
  line-height: 2rem;
  font-size: 1.5rem;
  font-family: KaiTi;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  box-sizing: border-box;
  border: 1px solid black;
}

div.column > .blank {
  width: 3rem;
  height: 3rem;
  text-align: center;
  line-height: 2rem;
  font-size: 1.5rem;
  font-family: KaiTi;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  box-sizing: border-box;
  border: 1px dashed blue;
}

div.column > .result {
  width: 2rem;
  height: 2rem;
  margin-top: 1rem;
  margin-bottom: 3rem;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.4);
  font-size: 1rem;
  font-weight: 600;
}
.icon {
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  margin-right: 6px;
}

.icon-wrapper p {
  line-height: 2rem;
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
}

.icon-wrapper span:nth-child(1) {
  color: red;
}

.icon-wrapper span:nth-child(2) {
  color: black;
}
</style>
