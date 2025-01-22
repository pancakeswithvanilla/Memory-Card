import { useState } from 'react'
import Game from './Game'
import './App.css'
function App() {
  const [highScore, setHighScore] = useState(0);
  return(<>
  <Game highScore = {highScore} setHighScore= {setHighScore}></Game>
  </>)
}

export default App
