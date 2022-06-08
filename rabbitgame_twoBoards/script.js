const EMPTY_CELL = 0
const RABBIT_CELL = 1
const HOME_CELL = 2
const WOLF_CELL = 3
const FENCE_CELL = 4
const WOLF_PROCENT = 0.6
const FENCE_PROCENT = 0.4

let character = [
  {
    name: "rabbit",
    img: "/images/rabbit.png",
    num: RABBIT_CELL,
  },
  {
    name: "home",
    img: "/images/home.png",
    num: HOME_CELL,
  },
  {
    name: "wolf",
    img: "/images/wolf.png",
    num: WOLF_CELL,
  },
  {
    name: "fence",
    img: "/images/fence.png",
    num: FENCE_CELL,
  },
]

document.getElementById("startAgain").onclick = function () {
  document.getElementById("messageBox").style.display = "none"
  startGame()
}

function startGame() {
  const array = createArray()
  const gameState = {
    array: array,
    isGameOver: false,
    gameMessage: "",
  }
  setPositions(array)
  console.log(array)
  DrawBoard(array)
  rabbitEventMove(gameState)
}

function rabbitEventMove(gameState) {
  window.onkeydown = (event) => {
    rabbitStep(gameState, event.key)
    wolfStep(gameState)
    console.log(array)
    DrawBoard(gameState.array)
    message(gameState)
  }
}

function createArray() {
  const arraySize = parseInt(document.getElementById("selectNum").value)
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
  array = gameState.array
  const listOfWolfIndexes = getCurrentDir(array, WOLF_CELL)
  const listOfRabbitIndex = getCurrentDir(array, RABBIT_CELL)[0]
  if (listOfRabbitIndex) {
    listOfWolfIndexes.forEach((index) => {
      const requiredWolfAreaIndexes = getRequiredWolfAreaIndexes(array, index)
      const requiredIndex = []
      const distances = []
      requiredWolfAreaIndexes.forEach((coord) => {
        distances.push(findDistance(coord, listOfRabbitIndex))
        requiredIndex.push(coord)
      })
      i = distances.indexOf(Math.min(...distances))
      wolfMove(gameState, requiredIndex[i], index)
    })
  }
}

function wolfMove(gameState, [newX, newY], [oldX, oldY]) {
  if (gameState.isGameOver === false) {
    iswin(gameState, [newX, newY])
    array[newX][newY] = WOLF_CELL
    array[oldX][oldY] = EMPTY_CELL
  }
}

function iswin(gameState, [x, y]) {
  array = gameState.array
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
  if (checkValid(up, array)) {
    wolfAreaIndexes.push(up)
  }
  if (checkValid(right, array)) {
    wolfAreaIndexes.push(right)
  }
  if (checkValid(down, array)) {
    wolfAreaIndexes.push(down)
  }
  if (checkValid(left, array)) {
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

function checkValid([x, y], array) {
  if (x != array.length && x >= 0 && y != array.length && y >= 0) {
    return true
  }
}

function rabbitStep(gameState, step) {
  const listOfIndexes = getCurrentDir(gameState.array, RABBIT_CELL)[0]
  if (gameState.isGameOver === false) {
    if (step === "ArrowLeft") {
      moveRabbitToLeft(gameState, listOfIndexes)
    } else if (step === "ArrowUp") {
      moveRabbitToUp(gameState, listOfIndexes)
    } else if (step === "ArrowRight") {
      moveRabbitToRight(gameState, listOfIndexes)
    } else if (step === "ArrowDown") {
      moveRabbitToDown(gameState, listOfIndexes)
    }
  }
}

function moveRabbitToLeft(gameState, [oldX, oldY]) {
  console.log(gameState.array)
  array = gameState.array
  console.log()
  if (oldY === 0 && array[oldX][array.length - 1] != FENCE_CELL) {
    iswin(gameState, [oldX, array.length - 1])
    array[oldX][array.length - 1] = RABBIT_CELL
    array[oldX][oldY] = EMPTY_CELL
  } else if (array[oldX][array.length - 1] != FENCE_CELL) {
    moveRabbit(gameState, [oldX, oldY], [oldX, oldY - 1])
  }
}

function moveRabbitToUp(gameState, [oldX, oldY]) {
  array = gameState.array
  if (oldX === 0 && array[array.length - 1][oldY] != FENCE_CELL) {
    iswin(gameState, [array.length - 1, oldY])
    array[array.length - 1][oldY] = RABBIT_CELL
    array[oldX][oldY] = EMPTY_CELL
  } else if (array[array.length - 1][oldY] != FENCE_CELL) {
    moveRabbit(gameState, [oldX, oldY], [oldX - 1, oldY])
  }
}

function moveRabbitToRight(gameState, [oldX, oldY]) {
  array = gameState.array
  if (oldY === array.length - 1 && array[oldX][0] != FENCE_CELL) {
    iswin(gameState, [oldX, 0])
    array[oldX][0] = RABBIT_CELL
    array[oldX][oldY] = EMPTY_CELL
  } else if (array[oldX][0] != FENCE_CELL) {
    moveRabbit(gameState, [oldX, oldY], [oldX, oldY + 1])
  }
}

function moveRabbitToDown(gameState, [oldX, oldY]) {
  array = gameState.array
  if (oldX === array.length - 1 && array[0][oldY] != FENCE_CELL) {
    iswin(gameState, [0, oldY])
    array[0][oldY] = RABBIT_CELL
    array[oldX][oldY] = EMPTY_CELL
  } else if (array[0][oldY] != FENCE_CELL) {
    moveRabbit(gameState, [oldX, oldY], [oldX + 1, oldY])
  }
}

function moveRabbit(gameState, [oldX, oldY], [newX, newY]) {
  array = gameState.array
  if (array[newX][newY] != FENCE_CELL) {
    iswin(gameState, [newX, newY])
    array[newX][newY] = RABBIT_CELL
    array[oldX][oldY] = EMPTY_CELL
  }
}

function message(gameState) {
  if (gameState.isGameOver === true) {
    document.getElementById("messageBox").style.display = "block"
    document.getElementById("message").innerHTML = gameState.gameMessage
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

function DrawBoard(array) {
  board = document.getElementById("board")
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
  img = generateImg(array[i][j])
  if (img.src != "") {
    div.appendChild(img)
  }
  return div
}

function generateImg(coord) {
  img = document.createElement("img")
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
