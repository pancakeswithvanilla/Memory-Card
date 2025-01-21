import { useState, useEffect} from "react";
import MemoryCard from "./MemoryCard";
function MemoryHolder({turn, setTurn, randomOffset, detailedPokemonList, setDetailedPokemonList}){
    const [loading, setLoading] = useState(true);
    let numcards = turn;
    if (turn > 12){
        numcards = turn;
    }
useEffect(() =>{const fetchPokemons = async() =>{
    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=36&offset=${randomOffset}`);
        if (!response.ok) {
            throw new Error('Failed to fetch Pokémon list');
          }
          const data = await response.json();
          const detailedPokemons = await Promise.all(
            data.results.map(async (pokemon) =>{
                const detailsResponse = await fetch(pokemon.url);
                const details = await detailsResponse.json();
                return{
                    id: details.id,
                    name: pokemon.name,
                    image:details.sprites.front_default,

                }
            } )
          );
          const filteredPokemonList = detailedPokemons.filter(
            (pokemon) => pokemon.id % 3 === 1
          );
          setLoading(true);
          setDetailedPokemonList(filteredPokemonList);
    }
    catch(error){
        console.error('Error fetching Pokémon:', error);
        setLoading(false);
    }
};
fetchPokemons();
},[])

useEffect(() =>{
  const memoryCards = document.querySelectorAll(".memorycard");
  if(memoryCards.length > 0){
    memoryCards.forEach(card =>{
      card.addEventListener("click", handleClick);
    });
  }
  return () => {
    if (memoryCards.length > 0) {
      memoryCards.forEach((card) => {
        card.removeEventListener("click", handleClick);
      });
    }
  };

}, [turn, detailedPokemonList])

useEffect(() =>{
  const uniqueRandomIndices = new Set();

while (uniqueRandomIndices.size < 4) {
  const randomOffset = Math.floor(Math.random() * 12); 
  uniqueRandomIndices.add(randomOffset);
}

const indicesArray = Array.from(uniqueRandomIndices); 

}, [turn])



function handleClick(){
  setTurn((prevTurn) =>{
    const newTurn = prevTurn + 1;
    return newTurn;
  });
}
if(loading == false){
    return(<><h3>Loading Pokemon data...</h3></>)
}
return (
    <div id = "memoryholder">
      {detailedPokemonList.length > 0 ? (
        detailedPokemonList.map((pokemon) => (
          <MemoryCard
            key={pokemon.id}
            name={pokemon.name}
            image={pokemon.image}
          />
        ))
      ) : (
        <p>Loading Pokémon...</p>
      )}
    </div>)
}
export default MemoryHolder;