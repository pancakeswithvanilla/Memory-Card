import React, { useState, useEffect } from 'react';
import MemoryHolder from "./MemoryHolder";

function Game({ highScore, setHighScore }) {
    const [turn, setTurn] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [detailedPokemonList, setDetailedPokemonList] = useState({});
    const [isHigh, setIsHigh] = useState(false);

    useEffect(() => {
        if (gameOver || turn === 24) {
            determineHighScore();
        }
    }, [turn, gameOver]); 

    const determineHighScore = () => {
        if (turn > highScore && !isHigh) {
            setHighScore(turn);
            setIsHigh(true); 
        }
    };

    function handleClick() {
        setTurn(0);
        setGameOver(false);
        setDetailedPokemonList({});
        setIsHigh(false);
    }

    return (
        <>
           
            {(gameOver === false && turn !== 24) && (
                <MemoryHolder
                    turn={turn}
                    setTurn={setTurn}
                    gameOver={gameOver}
                    setGameOver={setGameOver}
                    detailedPokemonList={detailedPokemonList}
                    setDetailedPokemonList={setDetailedPokemonList}
                />
            )}
    
              
        {gameOver && (
            <div id="gameover">
                <h3>Game Over...</h3>
                {isHigh && <h4>You achieved a new highscore, {highScore}! Congratulations!</h4>}
                <button id="startbtn" onClick={handleClick}>Play again!</button>
            </div>
        )}


        {turn === 24 && (
            <div id="youwon">
                <h3>You won!</h3>
                {isHigh && <h3>You achieved a new highscore, {highScore}! Congratulations!</h3>}
                <button id="startbtn" onClick={handleClick}>Play again!</button>
            </div>
        )}
        </>
    );
    
}

export default Game;
