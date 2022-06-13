const EMPTY_CELL = 0
const RABBIT_CELL = 1
const HOME_CELL = 2
const WOLF_CELL = 3
const FENCE_CELL = 4
const WOLF_PROCENT = 0.6
const FENCE_PROCENT = 0.4
let gameNumber = 0
let character = [
  {
    name: "rabbit",
    num: RABBIT_CELL
  },
  {
    name: "home",
    num: HOME_CELL
  },
  {
    name: "wolf",
    num: WOLF_CELL
  },
  {
    name: "fence",
    num: FENCE_CELL
  }
]

function newGame() {
  gameNumber++
  const container = document.getElementById("container")
  const GAME = document.createElement("div")
  GAME.id = `game_${gameNumber}`
  const btnDiv = createStartBtn(gameNumber)
  const select = createSelectDiv(gameNumber)
  const main = createMainBoard(gameNumber)
  const messageDiv = createMessageBox(gameNumber)
  container.appendChild(messageDiv)
  GAME.append(btnDiv, select, main)
  container.appendChild(GAME)
  startGame(gameNumber)
}

function startGame(gameNumber) {
  const array = createArray(gameNumber)
  const gameState = {
    array: array,
    isGameOver: false,
    gameMessage: "",
    gameNumber: gameNumber
  }
  setPositions(array)
  console.log(array)
  DrawBoard(gameState)
  document.getElementById(`game_${gameNumber}`).style.display = "block"
  const buttons = document.getElementById(`buttons_${gameNumber}`)
  buttons.removeEventListener("click", function (event) {
    moveEvent(gameState)
  })
  buttons.addEventListener("click", function (event) {
    moveEvent(gameState)
  })

  document.getElementById(`startBtn_${gameNumber}`).onclick = function () {
    startGame(gameNumber)
  }
  document.getElementById(`startAgain_${gameNumber}`).onclick = function () {
    document.getElementById(`messageBox_${gameNumber}`).style.display = "none"
    startGame(gameNumber)
  }
}

function moveEvent(gameState) {
  if (gameState.isGameOver === false) {
    rabbitStep(gameState, event.target.id)
    wolfStep(gameState)
    console.log(gameState.array)
    DrawBoard(gameState)
  }
  message(gameState)
}

function createArray(gameNumber) {
  const arraySize = parseInt(
    document.getElementById(`selectNum_${gameNumber}`).value
  )
  const array = new Array(arraySize)
    .fill(EMPTY_CELL)
    .map(() => new Array(arraySize).fill(EMPTY_CELL))

  return array
}

function setPositions(array) {
  const wolfCount = Math.ceil(array.length * WOLF_PROCENT)
  const fenceCount = Math.ceil(array.length * FENCE_PROCENT)
  setRabbitPosition(array)
  setHomePosition(array)
  for (let i = 0; i < wolfCount; i++) {
    setWolfPosition(array)
  }
  for (let i = 0; i < fenceCount; i++) {
    setFencePosition(array)
  }
}

function setRabbitPosition(array) {
  setIndexes("rabbit", array)
}
function setHomePosition(array) {
  setIndexes("home", array)
}
function setWolfPosition(array) {
  setIndexes("wolf", array)
}
function setFencePosition(array) {
  setIndexes("fence", array)
}

function setIndexes(characterName, array) {
  const x = Math.floor(Math.random() * array.length)
  const y = Math.floor(Math.random() * array.length)

  if (array[x][y] === EMPTY_CELL) {
    const element = character.find((item) => item.name === characterName)
    array[x][y] = element.num
  } else {
    setIndexes(characterName, array)
  }
}

function wolfStep(gameState) {
  const array = gameState.array
  const listOfWolfIndexes = getCurrentDir(array, WOLF_CELL)
  const listOfRabbitIndex = getCurrentDir(array, RABBIT_CELL)[0]
  listOfWolfIndexes.forEach((wolfIndex) => {
    const requiredWolfAreaIndexes = getRequiredWolfAreaIndexes(array, wolfIndex)
    const requiredIndex = []
    const distances = []
    requiredWolfAreaIndexes.forEach((coord) => {
      distances.push(findDistance(coord, listOfRabbitIndex))
      requiredIndex.push(coord)
    })
    index = distances.indexOf(Math.min(...distances))
    wolfMove(gameState, requiredIndex[index], wolfIndex)
  })
}

function wolfMove(gameState, [newX, newY], [oldX, oldY]) {
  const array = gameState.array
  if (gameState.isGameOver === false) {
    iswin(gameState, [newX, newY])
    array[newX][newY] = WOLF_CELL
    array[oldX][oldY] = EMPTY_CELL
  }
}

function iswin(gameState, [x, y]) {
  const array = gameState.array
  if (array[x][y] === HOME_CELL) {
    gameState.gameMessage = "That's Great! You win^^"
    gameState.isGameOver = true
  } else if (array[x][y] === WOLF_CELL || array[x][y] === RABBIT_CELL) {
    gameState.gameMessage = ":(.. Game over"
    gameState.isGameOver = true
  }
}

function getRequiredWolfAreaIndexes(array, index) {
  const [x, y] = [0, 1]
  const [wolfX, wolfY] = index
  const up = [wolfX - 1, wolfY]
  const right = [wolfX, wolfY + 1]
  const down = [wolfX + 1, wolfY]
  const left = [wolfX, wolfY - 1]
  const wolfAreaIndexes = []
  if (isInRange(up, array)) {
    wolfAreaIndexes.push(up)
  }
  if (isInRange(right, array)) {
    wolfAreaIndexes.push(right)
  }
  if (isInRange(down, array)) {
    wolfAreaIndexes.push(down)
  }
  if (isInRange(left, array)) {
    wolfAreaIndexes.push(left)
  }
  return wolfAreaIndexes.filter(
    (item) =>
      array[item[x]][item[y]] === EMPTY_CELL ||
      array[item[x]][item[y]] === RABBIT_CELL
  )
}

function findDistance([x1, y1], [x2, y2]) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

function isInRange([x, y], array) {
  if (x != array.length && x >= 0 && y != array.length && y >= 0) {
    return true
  }
}

function rabbitStep(gameState, step) {
  if (gameState.isGameOver === false) {
    let index = []
    if (step === "left") {
      index = [0, -1]
    } else if (step === "up") {
      index = [-1, 0]
    } else if (step === "right") {
      index = [0, 1]
    } else if (step === "down") {
      index = [1, 0]
    }
    moveRabbit(gameState, index)
  }
}

function moveRabbit(gameState, [newX, newY]) {
  const array = gameState.array
  const listOfIndexes = getCurrentDir(gameState.array, RABBIT_CELL)[0]
  const [oldX, oldY] = listOfIndexes
  let x = ""
  let y = ""
  if (newX === -1 && oldX === 0) {
    ;[x, y] = [oldX + array.length - 1, oldY + newY]
  } else if (newX === 1 && oldX === array.length - 1) {
    ;[x, y] = [array.length - oldX - 1, oldY + newY]
  } else if (newY === 1 && oldY === array.length - 1) {
    ;[x, y] = [oldX + newX, array.length - oldY - 1]
  } else if (newY === -1 && oldY === 0) {
    ;[x, y] = [oldX + newX, oldY + array.length - 1]
  } else {
    ;[x, y] = [oldX + newX, oldY + newY]
  }

  iswin(gameState, [x, y])
  if (gameState.isGameOver === false && array[x][y] !== FENCE_CELL) {
    array[x][y] = RABBIT_CELL
    array[oldX][oldY] = EMPTY_CELL
  }
}

function message(gameState) {
  const gameNumber = gameState.gameNumber
  if (gameState.isGameOver === true) {
    document.getElementById(`messageBox_${gameNumber}`).style.display = "block"
    document.getElementById(`game_${gameNumber}`).style.display = "none"
    document.getElementById(`message_${gameNumber}`).innerHTML =
      gameState.gameMessage
  }
}

function getCurrentDir(array, character) {
  const getFromArray = function (acc, row, i) {
    row.forEach((item, j) => {
      if (item === character) {
        acc.push([i, j])
      }
    })
    return acc
  }
  return array.reduce(getFromArray, [])
}

function DrawBoard(gameState) {
  const gameNumber = gameState.gameNumber
  const array = gameState.array
  const board = document.getElementById(`board_${gameNumber}`)
  board.innerHTML = ""
  const width = array.length * 60 + 2 * array.length
  board.style.width = `${width}px`
  board.style.height = `${width}px`
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      div = generateDiv(array, i, j)

      board.append(div)
    }
  }
}

function generateDiv(array, i, j) {
  const div = document.createElement("div")
  div.id = `${i}${j}`
  div.className = "box"
  const img = generateImg(array[i][j])
  if (img.src != "") {
    div.appendChild(img)
  }
  return div
}

function generateImg(coord) {
  const img = document.createElement("img")
  if (coord === RABBIT_CELL) {
    img.src = "images/rabbit.png"
  }
  if (coord === FENCE_CELL) {
    img.src = "images/fence.png"
  }
  if (coord === HOME_CELL) {
    img.src = "images/home.png"
  }
  if (coord === WOLF_CELL) {
    img.src = "images/wolf.png"
  }
  return img
}

function createStartBtn(gameNumber) {
  const div = document.createElement("div")
  div.className = "start"
  const btn = document.createElement("button")
  btn.id = `startBtn_${gameNumber}`
  btn.innerText = "Start"
  div.appendChild(btn)
  div.style.display = "inline-block"
  return div
}

function createMessageBox(gameNumber) {
  const messageBox = document.createElement("div")
  messageBox.id = `messageBox_${gameNumber}`
  const message = document.createElement("div")
  message.id = `message_${gameNumber}`
  const btn = document.createElement("button")
  btn.id = `startAgain_${gameNumber}`
  btn.innerText = "Start Again"
  messageBox.append(message, btn)
  messageBox.style.display = "none"
  messageBox.style.margin = "20px"
  messageBox.style.marginLeft = "45%"
  return messageBox
}

function createMainBoard(gameNumber) {
  const div = document.createElement("div")
  div.id = `main_${gameNumber}`
  const BoardDiv = document.createElement("div")
  BoardDiv.id = `board_${gameNumber}`
  BoardDiv.style.margin = "0 auto"
  div.appendChild(BoardDiv)
  const ButtonsDiv = document.createElement("div")
  ButtonsDiv.id = `buttons_${gameNumber}`
  ButtonsDiv.style.marginLeft = "28%"
  createButtons(ButtonsDiv)
  div.appendChild(ButtonsDiv)
  return div
}

function createButton(step) {
  const btn = document.createElement("button")
  btn.id = step
  btn.innerText = step
  return btn
}

function createButtons(div) {
  const up = createButton("up")
  const down = createButton("down")
  const left = createButton("left")
  const right = createButton("right")
  div.append(up, left, right, down)
}

function createOption(value) {
  const option = document.createElement("option")
  option.value = `${value}`
  option.innerText = `${value}x${value}`
  return option
}

function createSelectDiv(gameNumber) {
  const selectDiv = document.createElement("div")
  selectDiv.className = `select_${gameNumber}`
  const select = document.createElement("select")
  select.id = `selectNum_${gameNumber}`

  const option1 = createOption(5)
  select.appendChild(option1)
  const option2 = createOption(7)
  select.appendChild(option2)
  const option3 = createOption(10)
  select.appendChild(option3)
  selectDiv.appendChild(select)
  selectDiv.style.display = "inline-block"
  return selectDiv
}
