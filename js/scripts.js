// loading
const loading = document.getElementById('loading')
// hands
const hands = document.querySelectorAll('.clock-hands')
const handSecond = document.getElementById('second')
const handMinute = document.getElementById('minute')
const handHour = document.getElementById('hour')
// numbers and minute lines
const numbers = document.querySelectorAll('.clock-numbers b')
const minuteLines = document.querySelectorAll('.clock-numbers-minute-lines span')
// periods
const periods = document.getElementsByClassName('clock-periods-text')
// colors
const colorLocalName = 'analog-clock-gmm-color'
const colorOptions = []
document.querySelectorAll('.colors-options input[type="radio"]')
  .forEach(item => colorOptions.push(item.value))
const spanColorName = document.querySelector('.colors-current span')
// themes
const themeLocalName = 'analog-clock-gmm-theme'
const themeOptions = []
document.querySelectorAll('.themes-options input[type="radio"]')
  .forEach(item => themeOptions.push(item.value))
const spanThemeName = document.querySelector('.themes-current span')

/**
 * @name updateHand
 * @param {HTMLElement} hand
 * @param {number} angle
 * @returns {void}
 * @description
 * Atualiza a rotação e a sombra do ponteiro.
 */
function updateHand(hand, angle) {
  const intensity = 0.25
  const angleAdjustment = 45
  const x = (intensity * Math.sin((angle + angleAdjustment) * (Math.PI / 180))).toFixed(2)
  const y = (intensity * Math.cos((angle + angleAdjustment) * (Math.PI / 180))).toFixed(2)

  hand.style.transform = `rotate(${angle}deg)`
  hand.getElementsByTagName("span")[0].style.boxShadow = `${x}rem ${y}rem ${intensity}rem var(--shadow-effect-color)`
}

/**
 * @name calcMinuteLineIndex
 * @param {number} value
 * @returns {number}
 * @description
 * Calcula o index da linha do minuto baseado no valor do minuto.
 */
function calcMinuteLineIndex(value) {
  return value - ((value - (value % 5)) / 5) - 1
}

/**
 * @name calcPrevMinuteLineIndex
 * @param {number} index
 * @returns {number}
 * @description
 * Calcula o index da linha do minuto anterior baseado no index atual.
 */
function calcPrevMinuteLineIndex(index) {
  return index > 0 ? index - 1 : minuteLines.length - 1
}

/**
 * @name clock
 * @returns {void}
 * @description
 * Atualiza o relogio.
 */
function clock(h = undefined, m = undefined, s = undefined) {
  // Pega os valores da hora atual
  let time
  if (h === undefined || m === undefined || s === undefined) {
    time = new Date().toLocaleTimeString('pt-br').split(':')
  } else {
    time = [h, m, s]
  }
  const hour = Number(time[0])
  const minute = Number(time[1])
  const second = Number(time[2])

  // Calcula a rotação dos ponteiros
  const secondAngle = (second / 60) * 360
  const minuteAngle = (minute / 60) * 360 + (secondAngle / 60)
  const hourAngle = (hour / 12) * 360 + (minuteAngle / 12)

  // Verifica se a próxima rotação fará um circulo perfeito,
  // se sim, tira o efeito de transição de rotação, pois o
  // ponteiro faria todo o caminho reverso para chegar ao
  // valor de rotação 0. O que quebra a "imersão".
  if (second === 0) {
    hands.forEach(hand => {
      hand.style.transition = 'transform 0s ease-in-out'
    })
  } else if (second === 1) {
    hands.forEach(hand => {
      hand.style.transition = 'transform .1s ease-in-out'
    })
  }
  // Atualiza os ponteiros
  updateHand(handSecond, secondAngle)
  updateHand(handMinute, minuteAngle)
  updateHand(handHour, hourAngle)

  // Calcula os índeces dos números e das linhas de minutos
  const numberI = ((hour > 12 ? hour - 12 : hour) || 12) - 1
  const prevNumberI = numberI > 0 ? numberI - 1 : 11
  const minuteI = calcMinuteLineIndex(minute || 1)
  const prevMinuteI = calcPrevMinuteLineIndex(minuteI)

  // Daqui em diante, coloca o brilho nos números e nas linhas de minutos
  minuteLines[prevMinuteI].style.boxShadow = 'none'
  minuteLines[prevMinuteI].style.opacity = '.2'
  if (minute % 5 !== 0) {
    const tempPrevNumberI = ((minute - (minute % 5)) / 5 || numbers.length) - 1
    numbers[tempPrevNumberI].style.textShadow = '0 0 .5rem transparent'
    minuteLines[minuteI].style.boxShadow = '0 0 .25rem var(--tint-color)'
    minuteLines[minuteI].style.opacity = '1'
  } else {
    numbers[(minute / 5 || numbers.length) - 1].style.textShadow = '0 0 .5rem var(--details-light-effect-color)'
    minuteLines[minuteI].style.boxShadow = '0 0 .25rem transparent'
    minuteLines[minuteI].style.opacity = '.2'
  }

  numbers[prevNumberI].style.color = 'var(--theme-color)'
  numbers[numberI].style.color = 'var(--tint-highlight-color)'

  // Atualiza o período "AM" ou "PM"
  const isAM = hour <= 12
  periods[isAM ? 0 : 1].style.opacity = '1'
  periods[!isAM ? 0 : 1].style.opacity = '0'
}

/**
 * @name onLoadColor
 * @returns {void}
 * @description
 * Carrega a cor dos detalhes, utilizando localStorage.
 */
function onLoadColor() {
  let color = localStorage.getItem(colorLocalName)

  if (color !== null) {
    if (!colorOptions.includes(color)) {
      color = colorOptions[0]
      localStorage.setItem(colorLocalName, color)
    }
    document.documentElement.setAttribute('data-color', color.split('-')[0])
  } else {
    color = colorOptions[0]
    document.documentElement.setAttribute('data-color', color.split('-')[0])
    localStorage.setItem(colorLocalName, color)
  }
  document.getElementById(`color-option-${color.split('-')[0]}`).checked = true
  spanColorName.textContent = color.split('-')[1]
}

/**
 * @name changeColor
 * @param {Event} e
 * @returns {void}
 * @description
 * Atualiza a cor dos detalhes, utilizando localStorage.
 */
function changeColor(e) {
  const newColor = colorOptions.includes(e.value)
    ? e.value
    : colorOptions[0]
  document.documentElement.setAttribute('data-color', newColor.split('-')[0])
  spanColorName.textContent = newColor.split('-')[1]
  localStorage.setItem(colorLocalName, newColor)
}

/**
 * @name onLoadTheme
 * @returns {void}
 * @description
 * Carrega o tema, utilizando localStorage.
 */
function onLoadTheme() {
  let theme = localStorage.getItem(themeLocalName)

  if (theme !== null) {
    if (!themeOptions.includes(theme)) {
      theme = themeOptions[0]
      localStorage.setItem(themeLocalName, theme)
    }
    document.documentElement.setAttribute('data-theme', theme.split('-')[0])
  } else {
    theme = themeOptions[0]
    document.documentElement.setAttribute('data-theme', theme.split('-')[0])
    localStorage.setItem(themeLocalName, theme)
  }
  document.getElementById(`theme-option-${theme.split('-')[0]}`).checked = true
  spanThemeName.textContent = theme.split('-')[1]
}

/**
 * @name changeTheme
 * @param {Event} e
 * @returns {void}
 * @description
 * Atualiza o tema, utilizando localStorage.
 */
function changeTheme(e) {
  const newTheme = themeOptions.includes(e.value)
    ? e.value
    : themeOptions[0]
  document.documentElement.setAttribute('data-theme', newTheme.split('-')[0])
  spanThemeName.textContent = newTheme.split('-')[1]
  localStorage.setItem(themeLocalName, newTheme)
}

/**
 * @function window.onload
 * @returns {void}
 * @description
 * Evento disparado quando a página é carregada.
 * Carrega o relógio com a hora atual, define o
 * tema e a cor, e esconde o loading.
 */
window.onload = () => {
  onLoadColor()
  onLoadTheme()
  setInterval(clock, 1000)
  setTimeout(() => {
    loading.style.pointerEvents = 'none'
    loading.style.opacity = 0
  }, 1500)
}