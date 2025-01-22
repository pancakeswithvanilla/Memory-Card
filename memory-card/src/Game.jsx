import React, { useState } from 'react';
import MemoryHolder from "./MemoryHolder";
function Game({highScore, setHighScore}){
    const [turn, setTurn] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [detailedPokemonList, setDetailedPokemonList] = useState({}); 
    console.log("High score", highScore)
    console.log('Turn:', turn, 'Game Over:', gameOver, 'Detailed List:', detailedPokemonList);
    if (gameOver == true){
        determineHighScore();
        return(<>
        <h3>Game Over...</h3>
        <button id="startbtn" onClick ={handleClick}>Play again!</button>
        </>)
      }
      if (turn == 24){
        determineHighScore();
        return (<>
        <h3>You won!</h3>
        <button id="startbtn" onClick ={handleClick}>Play again!</button>
        </>)
    }
    
    function determineHighScore(){
        if (turn > highScore){
            setHighScore(turn);
        }
    }
    function handleClick(){
        setTurn(0);
        setGameOver(false);
        setDetailedPokemonList({});
    }
    return(<>
    <MemoryHolder turn = {turn} setTurn={setTurn} gameOver={gameOver} setGameOver={setGameOver} detailedPokemonList={detailedPokemonList} setDetailedPokemonList={setDetailedPokemonList}></MemoryHolder></>)
}
export default Game;