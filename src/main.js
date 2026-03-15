import './style.css'
import './steps/name-input.css'
import './steps/letter-crossing.css'
import './steps/flames-countdown.css'
import './steps/result-reveal.css'

import { createStepManager } from './lib/step-manager.js'
import { createNameStep1, createNameStep2 } from './steps/name-input.js'
import { createLetterCrossing } from './steps/letter-crossing.js'
import { createFlamesCountdown } from './steps/flames-countdown.js'
import { createResultReveal } from './steps/result-reveal.js'

const app = document.querySelector('#app')
const manager = createStepManager(app)

manager.addStep(createNameStep1)
manager.addStep(createNameStep2)
manager.addStep(createLetterCrossing)
manager.addStep(createFlamesCountdown)
manager.addStep(createResultReveal)

manager.start()
