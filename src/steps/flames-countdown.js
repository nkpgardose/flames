import { resolveFlames } from '../lib/flames-algorithm.js'

const delay = (ms) => new Promise(r => setTimeout(r, ms))

const FLAMES = ['F', 'L', 'A', 'M', 'E', 'S']
const MEANINGS = {
  F: 'Friends',
  L: 'Lovers',
  A: 'Anger',
  M: 'Marriage',
  E: 'Enemies',
  S: 'Sweethearts',
}
const COLOR_MAP = {
  F: 'var(--color-flames-f)',
  L: 'var(--color-flames-l)',
  A: 'var(--color-flames-a)',
  M: 'var(--color-flames-m)',
  E: 'var(--color-flames-e)',
  S: 'var(--color-flames-s)',
}

export async function createFlamesCountdown(container, context, onComplete) {
  const count = context.remainingCount
  const { result, meaning, eliminations } = resolveFlames(count)

  const wrapper = document.createElement('div')
  wrapper.className = 'flames-wrapper'

  const row = document.createElement('div')
  row.className = 'flames-row'

  const spans = FLAMES.map(letter => {
    const span = document.createElement('span')
    span.className = 'flames-letter'
    span.textContent = letter
    span.style.color = COLOR_MAP[letter]
    span.dataset.letter = letter
    row.appendChild(span)
    return span
  })

  const pointer = document.createElement('div')
  pointer.className = 'flames-pointer'
  pointer.textContent = '👆'

  const legend = document.createElement('div')
  legend.className = 'flames-legend'
  const legendItems = {}
  for (const letter of FLAMES) {
    const item = document.createElement('div')
    item.className = 'flames-legend-item'
    item.style.color = COLOR_MAP[letter]
    item.innerHTML = `<span class="flames-legend-letter">${letter}</span> <span class="flames-legend-dash">&mdash;</span> <span class="flames-legend-meaning">${MEANINGS[letter]}</span>`
    legend.appendChild(item)
    legendItems[letter] = item
  }

  wrapper.append(row, pointer, legend)
  container.appendChild(wrapper)

  await delay(600)

  // Pre-calculate letter positions (layout doesn't shift since eliminated letters stay in flow)
  const rowRect = row.getBoundingClientRect()
  const spanOffsets = new Map()
  for (const span of spans) {
    const rect = span.getBoundingClientRect()
    spanOffsets.set(span, rect.left - rowRect.left + rect.width / 2)
  }

  // Track which spans are still active
  const activeSpans = [...spans]
  let pointerIdx = 0

  for (const elimination of eliminations) {
    // Count through active letters
    for (let step = 0; step < count; step++) {
      pointerIdx = step === 0 ? pointerIdx : (pointerIdx + 1) % activeSpans.length
      pointer.style.transform = `translateX(${spanOffsets.get(activeSpans[pointerIdx])}px)`
      pointer.classList.add('visible')

      await delay(200)
    }

    // Eliminate the current letter
    const eliminatedSpan = activeSpans[pointerIdx]
    eliminatedSpan.classList.add('eliminated')
    legendItems[eliminatedSpan.dataset.letter].classList.add('eliminated')
    await delay(500)

    // Skip eliminated letters when counting
    activeSpans.splice(pointerIdx, 1)
    if (activeSpans.length > 0 && pointerIdx >= activeSpans.length) pointerIdx = 0
  }

  // Winner
  if (activeSpans.length === 1) {
    activeSpans[0].classList.add('winner')
  }

  await delay(1000)
  onComplete({ result, meaning })
}
