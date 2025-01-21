import { useState } from "react";
import MemoryHolder from "./MemoryHolder";
function Game(){
    const [turn, setTurn] = useState(0);
    const [detailedPokemonList, setDetailedPokemonList] = useState({});
    const randomOffset = Math.floor(Math.random() * 1000 ); 
    return(<>
    <MemoryHolder turn = {turn} setTurn={setTurn} randomOffset={randomOffset} detailedPokemonList={detailedPokemonList} setDetailedPokemonList={setDetailedPokemonList}></MemoryHolder></>)
}
export default Game;