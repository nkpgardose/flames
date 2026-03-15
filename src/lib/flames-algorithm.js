export function findRemainingCount(name1, name2) {
  const lettersA = name1.toLowerCase().replace(/[^a-z]/g, '').split('')
  const lettersB = name2.toLowerCase().replace(/[^a-z]/g, '').split('')
  const matchedA = new Array(lettersA.length).fill(false)
  const matchedB = new Array(lettersB.length).fill(false)

  const pairs = []
  for (let i = 0; i < lettersA.length; i++) {
    for (let j = 0; j < lettersB.length; j++) {
      if (!matchedB[j] && !matchedA[i] && lettersA[i] === lettersB[j]) {
        matchedA[i] = true
        matchedB[j] = true
        pairs.push([i, j])
        break
      }
    }
  }

  const count = matchedA.filter(m => !m).length + matchedB.filter(m => !m).length
  return { count, matchedA, matchedB, lettersA, lettersB, pairs }
}

export function resolveFlames(count) {
  const flames = ['F', 'L', 'A', 'M', 'E', 'S']
  const meanings = {
    F: 'Friends',
    L: 'Lovers',
    A: 'Anger',
    M: 'Marriage',
    E: 'Enemies',
    S: 'Sweethearts',
  }

  if (count === 0) {
    return {
      result: 'S',
      meaning: meanings['S'],
      eliminations: [],
    }
  }

  const active = [...flames]
  const eliminations = []
  let pointer = 0

  while (active.length > 1) {
    pointer = (pointer + count - 1) % active.length
    const eliminated = active.splice(pointer, 1)[0]
    eliminations.push({
      letter: eliminated,
      remaining: [...active],
      index: pointer,
    })
    if (pointer >= active.length) pointer = 0
  }

  return {
    result: active[0],
    meaning: meanings[active[0]],
    eliminations,
  }
}
