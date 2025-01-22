import { useState, useEffect} from "react";
import MemoryCard from "./MemoryCard";
function MemoryHolder({turn, setTurn, detailedPokemonList, setDetailedPokemonList, gameOver, setGameOver}){
    const [loading, setLoading] = useState(true);
    const [clickedPokis, setClickedPokis] = useState([]);
    const [removedPokis, setRemovedPokis] = useState(false);
    const [randomOffset, setRandomOffset] = useState(Math.floor(Math.random() * 100 ))
    const numCards = 12;
    const moreChallenging = 4;
    const evenMoreChallenging = 8;
    const fetchPokemons = async(numfetches) =>{
      try{
          if (numfetches == null){
            numfetches = numCards * 3;
          }

          const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${numfetches}&offset=${randomOffset}`);
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
            return filteredPokemonList;
            
      }
      catch(error){
          console.error('Error fetching Pokémon:', error);
          return [];
      }
  };
  useEffect(() => {
    const loadPokemons = async () => {
      const filteredPokemonList = await fetchPokemons();
      setDetailedPokemonList(filteredPokemonList);
      setRandomOffset((prevRandomOffset) =>prevRandomOffset + numCards *3);

      setLoading(true);
    };
  
    loadPokemons();
  }, []); 

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

useEffect(() => {
  let toRemove = 4;
  if (turn >= moreChallenging){
    toRemove = 2;
  }
  else if (turn >= evenMoreChallenging){
    toRemove = 1;
  }
  if (detailedPokemonList.length > toRemove) { 
    const indicesToRemove = chooseIndices(toRemove, detailedPokemonList.length);
    setDetailedPokemonList((prevDetailedPokemonList) => {
      return prevDetailedPokemonList.filter(
        (_, index) => !indicesToRemove.includes(index)
      );
    });
    setRemovedPokis(true);
  }
}, [turn]);

useEffect(() => {
  let pokistoadd = 12;
  if (turn >= moreChallenging){
    pokistoadd = 6;
  }
  else if (turn >= evenMoreChallenging){
    pokistoadd = 3;
  }
  if (removedPokis) {
    const loadPokemons = async () => {
      let addPokemonList = [];
      addPokemonList = await fetchPokemons(pokistoadd);
      setRandomOffset((prevRandomOffset) =>prevRandomOffset + pokistoadd);
      const allPokemons = [...detailedPokemonList, ...addPokemonList];
      //console.log("All pokemons:", allPokemons)
      const shuffledPokemons = shuffleArray(allPokemons);
      //console.log("Shuffled pokemons", shuffledPokemons);
      setDetailedPokemonList(shuffledPokemons);
      setRemovedPokis(false); 
    };

    loadPokemons();
  }
}, [removedPokis]);

const shuffleArray = (array) => {
  let shuffledArray = [...array]; 
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; 
  }
  return shuffledArray;
};
function chooseIndices(numToRemove, maxIndex) {
  const uniqueRandomIndices = new Set();

  while (uniqueRandomIndices.size < numToRemove) { 
    const randomIndex = Math.floor(Math.random() * maxIndex); 
    uniqueRandomIndices.add(randomIndex);
  }
  
  return Array.from(uniqueRandomIndices); 
}

const handleClick = (card) => {
  const cardId = event.currentTarget.id;
  setTurn((prevTurn) => prevTurn + 1);
  detailedPokemonList.forEach((poki) =>{
    if (poki.id == cardId){
      setClickedPokis((prevClickedPokis) =>[...prevClickedPokis, poki])
    }
  })

};
useEffect(() =>{
  const clickedPokisSet = new Set(clickedPokis);
  if(clickedPokisSet.size != clickedPokis.length && clickedPokis.length > 0){
    setGameOver(true);
  }
},[clickedPokis])


if(loading == false){
    return(<><h3>Loading Pokemon data...</h3></>)
}

return (
    <div id = "memoryholder">
      {detailedPokemonList.length > 0 ? (
        detailedPokemonList.map((pokemon) => (
          <MemoryCard
            id = {pokemon.id}
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