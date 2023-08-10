import "./App.css"
import { useState } from "react"

function App() {
  const [GameState, setGameState] = useState("start")
  const GameStateEnum = {
    start: "start",
    playing: "playing",
    gameOver: "gameover",
  }
  const emojis = [
    { emoji: "🚙" },
    { emoji: "⭐" },
    { emoji: "🌈" },
    { emoji: "🌨" },
    { emoji: "🚙" },
    { emoji: "⭐" },
    { emoji: "🌈" },
    { emoji: "🌨" },
    { emoji: "🫶" }, //heart hand
    { emoji: "🫶" }, //heart hand
    { emoji: "☀" },
    { emoji: "☀" },
  ]
  let idhelper = 1
  emojis.forEach((item, i) => {
    item.id = idhelper + 1
    idhelper++
  })

  function roundValue(value) {
    let decimal = value % 1
    if (decimal < 0.5) {
      return Math.floor(value)
    }
    return Math.floor(value + 1)
  }
  const amount_items = emojis.length
  const row = 4
  const _itemsPerRow = roundValue(amount_items / row)

  const customGameFieldStyles = {
    "--amount-items": amount_items,
    "--rows": row,
    "--items-per-row": _itemsPerRow,
  }

  const isGameOver = matchArr => {
    return matchArr.length === emojis.length
  }
  const [matches, setMatches] = useState(new Map())
  const [selected, setSelected] = useState(new Map())
  const [cards, setCards] = useState([])
  const [isUIblocked, setUIBlocked] = useState(false)

  function shuffle(array) {
    const arr = [...array]
    if (!arr.length) return

    //Fisher–Yates shuffle -- https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    for (let x = arr.length - 1; x > 0; x--) {
      var y = Math.floor(Math.random() * x)
      var temp = arr[x]
      arr[x] = arr[y]
      arr[y] = temp
    }
    return arr
  }

  const startGame = () => {
    playAgain()
    setGameState(GameStateEnum.playing)
  }

  const selectCard = card => {
    if (isUIblocked) return
    if (selected.size <= 2 && !selected.has(card.id) && !matches.has(card.id)) {
      setSelected(prevSelected => new Map(prevSelected.set(card.id, card)))
      if (selected.size === 1) {
        //blockUI maybe
        matchCards(selected, card)
        //unblock UI
      }
    }
  }

  const matchCards = (firstCard, secondCard) => {
    if (!firstCard.emoji)
      firstCard = firstCard.get(firstCard.keys().next().value)
    if (!secondCard.emoji)
      secondCard = secondCard.get(secondCard.keys().next().value)
    if (firstCard && secondCard) {
      if (firstCard.emoji === secondCard.emoji) {
        let newMatchArr = []
        setMatches(prevMatches => {
          const newMatches = new Map(prevMatches)
          newMatches.set(firstCard.id, firstCard.emoji)
          newMatches.set(secondCard.id, secondCard.emoji)
          newMatchArr = [...newMatches]
          return newMatches
        })
        //?
        if (isGameOver(newMatchArr)) {
          setGameState(GameStateEnum.gameOver)
        }
        //for instant Feedback after scoring a match
        setSelected(new Map())
        setUIBlocked(false)
      } else {
        setUIBlocked(true)
        setTimeout(() => {
          setSelected(new Map())
          setUIBlocked(false)
        }, 2000)
      }
    }
  }

  const playAgain = () => {
    setCards(shuffle([...emojis]))
    setMatches(new Map())
    setSelected(new Map())
  }

  const generateCards = () => {
    const cardElems = []
    cards.forEach(el => {
      cardElems.push(
        <button
          className={
            "card " +
            (selected.get(el.id) ? "front " : "") +
            (matches.get(el.id) ? "matched " : "")
          }
          key={el.id}
          onClick={() => selectCard(el)}
          disabled={selected.has(el.id) || matches.has(el.id) || isUIblocked}
        >
          {selected.get(el.id) || matches.get(el.id) ? el.emoji : ""}
        </button>
      )
    })
    return cardElems
  }

  return (
    <div className="App">
      <div className="header">
        <h1>zanchho's Memory</h1>
        {GameState === GameStateEnum.start ? (
          <button onClick={startGame}>Start Game</button>
        ) : (
          <></>
        )}

        {/**TODO fix instead of workaround for not changing state on GameOver */}
        {matches.size === emojis.length ? (
          <>
            <h2>Game Over</h2>
            <button onClick={startGame}>Start Game Again</button>
          </>
        ) : (
          <></>
        )}
      </div>

      {/**TODO fix instead of workaround for not changing state on GameOver */}
      <div
        style={customGameFieldStyles}
        className={`cards ${
          matches.size === emojis.length || GameState !== GameStateEnum.playing
            ? "hidden"
            : ""
        }`}
      >
        {generateCards()}
      </div>
    </div>
  )
}

export default App
