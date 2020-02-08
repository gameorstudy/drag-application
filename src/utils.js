import storage from '@/default-board.js'

export function uniqueId() {
  return Math.floor(Math.random() * 10000000)
}

export function _shuffle() {
  const stor = localStorage.getItem('res') || storage

  let shuffled_answers_list = []
  for (const s in stor) {
    shuffled_answers_list.push(stor[s].answer)
  }

  for (var i = shuffled_answers_list.length; i > 0; --i) {
    var index = Math.floor(Math.random() * i)
    var temp = shuffled_answers_list[i - 1]
    shuffled_answers_list[i - 1] = shuffled_answers_list[index]
    shuffled_answers_list[index] = temp
  }
  return shuffled_answers_list
}
