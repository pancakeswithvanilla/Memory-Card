import { useState } from "react";
import MemoryHolder from "./MemoryHolder";
function Game(){
    const [turn, setTurn] = useState(0);
    const [detailedPokemonList, setDetailedPokemonList] = useState({});
    return(<>
    <MemoryHolder turn = {turn} setTurn={setTurn} detailedPokemonList={detailedPokemonList} setDetailedPokemonList={setDetailedPokemonList}></MemoryHolder></>)
}
export default Game;