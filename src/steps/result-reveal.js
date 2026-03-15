const EMOJI_MAP = {
  F: '🤝',
  L: '💕',
  A: '😤',
  M: '💍',
  E: '⚔️',
  S: '💖',
}

const COLOR_MAP = {
  F: 'var(--color-flames-f)',
  L: 'var(--color-flames-l)',
  A: 'var(--color-flames-a)',
  M: 'var(--color-flames-m)',
  E: 'var(--color-flames-e)',
  S: 'var(--color-flames-s)',
}

const HEX_COLORS = {
  F: '#C4727F',
  L: '#8B7EC8',
  A: '#D4836B',
  M: '#7A9B7E',
  E: '#C5993E',
  S: '#A67B8A',
}

const TITLE_HEXES = [
  '#C4727F', '#8B7EC8', '#D4836B', '#7A9B7E', '#C5993E', '#A67B8A'
]

function generateImage(context) {
  const { result, meaning, name1Display, name2Display } = context
  const emoji = EMOJI_MAP[result]

  const w = 720
  const h = 900
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  // Background
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, '#FDF2E9')
  grad.addColorStop(1, '#FFF8F0')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Border
  ctx.strokeStyle = 'rgba(196, 114, 127, 0.3)'
  ctx.lineWidth = 3
  const r = 32
  ctx.beginPath()
  ctx.moveTo(r + 12, 12)
  ctx.lineTo(w - r - 12, 12)
  ctx.quadraticCurveTo(w - 12, 12, w - 12, r + 12)
  ctx.lineTo(w - 12, h - r - 12)
  ctx.quadraticCurveTo(w - 12, h - 12, w - r - 12, h - 12)
  ctx.lineTo(r + 12, h - 12)
  ctx.quadraticCurveTo(12, h - 12, 12, h - r - 12)
  ctx.lineTo(12, r + 12)
  ctx.quadraticCurveTo(12, 12, r + 12, 12)
  ctx.closePath()
  ctx.stroke()

  // Title: F.L.A.M.E.S.
  const titleLetters = 'FLAMES'.split('')
  const titleSize = 36
  ctx.font = `700 ${titleSize}px 'Playfair Display', Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const dotWidth = ctx.measureText('.').width
  let totalTitleWidth = 0
  const letterWidths = titleLetters.map(ch => ctx.measureText(ch).width)
  for (let i = 0; i < titleLetters.length; i++) {
    totalTitleWidth += letterWidths[i]
    if (i < titleLetters.length - 1) totalTitleWidth += dotWidth
  }

  let titleX = (w - totalTitleWidth) / 2
  const titleY = 80
  ctx.textAlign = 'left'
  for (let i = 0; i < titleLetters.length; i++) {
    ctx.fillStyle = TITLE_HEXES[i]
    ctx.fillText(titleLetters[i], titleX, titleY)
    titleX += letterWidths[i]
    if (i < titleLetters.length - 1) {
      ctx.fillStyle = 'rgba(92, 85, 77, 0.4)'
      ctx.fillText('.', titleX, titleY)
      titleX += dotWidth
    }
  }

  // Emoji
  ctx.textAlign = 'center'
  ctx.font = '80px serif'
  ctx.fillText(emoji, w / 2, 220)

  // Meaning
  ctx.font = `700 56px 'Playfair Display', Georgia, serif`
  ctx.fillStyle = HEX_COLORS[result]
  ctx.fillText(meaning, w / 2, 340)

  // Names with heart
  ctx.font = `500 28px 'Inter', system-ui, sans-serif`
  ctx.fillStyle = '#2D2A26'
  const namesText = `${name1Display}  ♥  ${name2Display}`
  ctx.fillText(namesText, w / 2, 420)

  // Divider
  ctx.strokeStyle = 'rgba(196, 114, 127, 0.25)'
  ctx.lineWidth = 1
  ctx.setLineDash([6, 6])
  ctx.beginPath()
  ctx.moveTo(w * 0.2, 500)
  ctx.lineTo(w * 0.8, 500)
  ctx.stroke()
  ctx.setLineDash([])

  // Watermark
  ctx.font = `400 20px 'Inter', system-ui, sans-serif`
  ctx.fillStyle = '#5C554D'
  ctx.fillText('visit https://neil.onl/flames', w / 2, 560)

  return canvas
}

function canvasToBlob(canvas) {
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
}

function downloadBlob(blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'flames-result.png'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function saveImage(canvas) {
  const blob = await canvasToBlob(canvas)
  const file = new File([blob], 'flames-result.png', { type: 'image/png' })

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return
    } catch {}
  }

  downloadBlob(blob)
}

const SHARE_MESSAGES = {
  F: "The FLAMES game said we're just Friends... bestie era it is 🫶 Think you can do better?",
  L: "FLAMES said we're Lovers 💕 idk I didn't make the rules!! Find out yours 👀",
  A: "FLAMES said it's Anger between us 😤 the tension is REAL lol. Try it on your crush~",
  M: "FLAMES said Marriage 💍 so like... save the date?? See what you get 👀",
  E: "FLAMES said Enemies ⚔️ the universe really said NO to this one 😭 Try your luck~",
  S: "FLAMES said Sweethearts 💖 we're literally meant to be!! Check yours too~",
}

async function shareImage(canvas, context) {
  const blob = await canvasToBlob(canvas)
  const file = new File([blob], 'flames-result.png', { type: 'image/png' })

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'FLAMES Result',
        text: `${SHARE_MESSAGES[context.result]}\n\nhttps://neil.onl/flames`,
      })
      return
    } catch {}
  }

  downloadBlob(blob)
}

export function createResultReveal(container, context, onComplete) {
  const { result, meaning, name2Display } = context
  const emoji = EMOJI_MAP[result]
  const color = COLOR_MAP[result]

  const wrapper = document.createElement('div')
  wrapper.className = 'result-wrapper'

  const card = document.createElement('div')
  card.className = 'result-card'

  const emojiEl = document.createElement('div')
  emojiEl.className = 'result-emoji'
  emojiEl.textContent = emoji

  const letterEl = document.createElement('div')
  letterEl.className = 'result-letter'
  letterEl.textContent = result
  letterEl.style.color = color

  const textEl = document.createElement('p')
  textEl.className = 'result-text'
  textEl.append(
    'You are ',
    Object.assign(document.createElement('strong'), { textContent: meaning }),
    ` with ${name2Display}`
  )

  card.append(emojiEl, letterEl, textEl)

  // Action buttons row
  const actions = document.createElement('div')
  actions.className = 'result-actions'

  let cachedCanvas = null
  async function getCanvas() {
    if (!cachedCanvas) {
      await document.fonts.ready
      cachedCanvas = generateImage(context)
    }
    return cachedCanvas
  }

  const saveBtn = document.createElement('button')
  saveBtn.className = 'result-action-btn'
  saveBtn.textContent = '📥 Save'
  saveBtn.addEventListener('click', async () => saveImage(await getCanvas()))

  const shareBtn = document.createElement('button')
  shareBtn.className = 'result-action-btn'
  shareBtn.textContent = '📤 Share'
  shareBtn.addEventListener('click', async () => shareImage(await getCanvas(), context))

  actions.append(saveBtn, shareBtn)

  const playAgainBtn = document.createElement('button')
  playAgainBtn.className = 'result-play-again'
  playAgainBtn.textContent = 'Play Again'
  playAgainBtn.addEventListener('click', () => onComplete())

  wrapper.append(card, actions, playAgainBtn)
  container.appendChild(wrapper)

  requestAnimationFrame(() => {
    card.classList.add('visible')
    setTimeout(() => textEl.classList.add('visible'), 600)
    setTimeout(() => {
      actions.classList.add('visible')
      playAgainBtn.classList.add('visible')
    }, 1000)
  })
}
