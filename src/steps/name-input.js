function renderNameInput(container, promptText, fieldName, onComplete) {
  const wrapper = document.createElement('div')
  wrapper.className = 'name-input-wrapper'

  const label = document.createElement('label')
  label.className = 'name-input-prompt'
  label.textContent = promptText
  label.setAttribute('for', 'name-field')

  const input = document.createElement('input')
  input.type = 'text'
  input.id = 'name-field'
  input.className = 'name-input-field'
  input.autocomplete = 'off'
  input.spellcheck = false

  const hintRow = document.createElement('div')
  hintRow.className = 'name-input-hint-row'

  const hint = document.createElement('span')
  hint.className = 'name-input-hint'
  hint.textContent = 'press Enter or'

  const nextBtn = document.createElement('button')
  nextBtn.type = 'button'
  nextBtn.className = 'name-input-next'
  nextBtn.textContent = 'Next'

  hintRow.append(hint, nextBtn)
  wrapper.append(label, input, hintRow)
  container.appendChild(wrapper)

  setTimeout(() => input.focus(), 100)
  setTimeout(() => hintRow.classList.add('visible'), 2000)

  function submit() {
    const display = input.value.replace(/[^a-zA-Z\s]/g, '').trim()
    const clean = display.replace(/\s/g, '')
    if (clean.length >= 1) {
      onComplete({ [fieldName]: clean, [fieldName + 'Display']: display })
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit()
  })

  nextBtn.addEventListener('click', submit)
}

export function createNameStep1(container, context, onComplete) {
  renderNameInput(container, "What's your name?", 'name1', onComplete)
}

export function createNameStep2(container, context, onComplete) {
  renderNameInput(container, "Who's your crush?", 'name2', onComplete)
}
