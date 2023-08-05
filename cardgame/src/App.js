import "./App.css"
import { useState } from "react"

function App() {
  const [GameState, setGameState] = useState("start")
  const GameStateEnum = {
    start: "start",
    playing: "playing",
    paused: "paused",
    gameOver: "gameover",
  }
  const emojis = [
    { id: 1, emoji: "🚙" },
    { id: 2, emoji: "⭐" },
    { id: 3, emoji: "🌈" },
    { id: 4, emoji: "🌨" },
    { id: 5, emoji: "🚙" },
    { id: 6, emoji: "⭐" },
    { id: 7, emoji: "🌈" },
    { id: 8, emoji: "🌨" },
  ]

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
        setMatches(prevMatches => {
          const newMatches = new Map(prevMatches)
          newMatches.set(firstCard.id, firstCard.emoji)
          newMatches.set(secondCard.id, secondCard.emoji)
          return newMatches
        })

        setUIBlocked(true)
        setTimeout(() => {
          setSelected(new Map())
          setUIBlocked(false)
        }, 2000)
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

  function handleEscapeKey(e) {
    if (e.key === "Escape") {
      if (GameState === GameStateEnum.playing) {
        setGameState(GameStateEnum.paused)
      }
    }
  }

  function gameStartButton() {}
  function gamePausedHeader() {}
  function gameOverHeader() {
    if (GameState === GameStateEnum.gameOver) {
      return <h1>Game Over</h1>
    }
    return <>GO</>
  }

  const actualGame = () => {
    const cardElems = []
    cards.forEach(el => {
      cardElems.push(
        <button
          className={"card "}
          key={el.id}
          onClick={() => selectCard(el)}
          disabled={selected.has(el.id) || matches.has(el.id)}
        >
          {selected.get(el.id) || matches.get(el.id) ? el.emoji : ""}
        </button>
      )
    })
    return cardElems
  }

  const windowESClistener = window.addEventListener("keydown", handleEscapeKey)

  return (
    <div className="App">
      {GameState === GameStateEnum.start ? (
        <button onClick={() => startGame()}>Start Game</button>
      ) : (
        <></>
      )}
      {GameState === GameStateEnum.paused ? <h1>Game Paused</h1> : <></>}
      {matches.size === emojis.length ? <></> : <></>}
      {GameState === GameStateEnum.playing ? (
        <div className="cards">{actualGame()}</div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default App
