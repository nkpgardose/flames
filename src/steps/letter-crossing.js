import { findRemainingCount } from '../lib/flames-algorithm.js'

const delay = (ms) => new Promise(r => setTimeout(r, ms))

export async function createLetterCrossing(container, context, onComplete) {
  const { count, matchedA, matchedB, lettersA, lettersB, pairs } = findRemainingCount(context.name1, context.name2)

  const wrapper = document.createElement('div')
  wrapper.className = 'crossing-wrapper'

  const nameRowA = document.createElement('div')
  nameRowA.className = 'crossing-name'
  const spansA = lettersA.map(ch => {
    const span = document.createElement('span')
    span.className = 'letter'
    span.textContent = ch
    nameRowA.appendChild(span)
    return span
  })

  const heart = document.createElement('div')
  heart.className = 'crossing-heart'
  heart.textContent = '♥'

  const nameRowB = document.createElement('div')
  nameRowB.className = 'crossing-name'
  const spansB = lettersB.map(ch => {
    const span = document.createElement('span')
    span.className = 'letter'
    span.textContent = ch
    nameRowB.appendChild(span)
    return span
  })

  wrapper.append(nameRowA, heart, nameRowB)
  container.appendChild(wrapper)

  await delay(600)

  // Cross out matched letter pairs
  for (const [idxA, idxB] of pairs) {
    spansA[idxA].classList.add('crossed')
    spansB[idxB].classList.add('crossed')
    await delay(400)
  }

  await delay(600)

  // Show remaining count
  const countEl = document.createElement('div')
  countEl.className = 'crossing-count'
  countEl.textContent = count
  wrapper.appendChild(countEl)

  await delay(100)
  countEl.classList.add('visible')

  await delay(1500)
  onComplete({ remainingCount: count, matchedA, matchedB, lettersA, lettersB })
}
