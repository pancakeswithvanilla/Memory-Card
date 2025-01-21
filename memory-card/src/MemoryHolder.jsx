import { useState, useEffect} from "react";
import MemoryCard from "./MemoryCard";
function MemoryHolder({turn, setTurn, randomOffset, detailedPokemonList, setDetailedPokemonList}){
    const [loading, setLoading] = useState(true);
    const [clickedPokis, setClickedPokis] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [numCards, setNumCards] = useState(12);
    const [removedPokis, setRemovedPokis] = useState(false);
    const [pokiIndices, setPokiIndices] = useState([])
    if (turn > 12){
        setNumCards(turn);
    }
    const fetchPokemons = async(numfetches, randfetch) =>{
      try{
          if (numfetches == null){
            numfetches = numCards * 3;
          }
          if (randfetch == null){
            randfetch = randomOffset;
          }
          console.log("Numfetches", numfetches)
          console.log("Randfetch", randfetch)
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${numfetches}&offset=${randfetch}`);
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
  if (detailedPokemonList.length > 4) { 
    const indicesToRemove = chooseIndices(4, detailedPokemonList.length);
    setDetailedPokemonList((prevDetailedPokemonList) => {
      return prevDetailedPokemonList.filter(
        (_, index) => !indicesToRemove.includes(index)
      );
    });
    setRemovedPokis(true);
  }
}, [turn]);

useEffect(() => {
  if (removedPokis) {
    const loadPokemons = async () => {
      let addPokemonList = [];
      let overlapFound = true;
      let iterationCount = 0;  // To limit the number of iterations

      while (overlapFound && iterationCount < 10) { // Prevent infinite loop
        addPokemonList = await fetchPokemons(12);
        const newFirstId = addPokemonList[0].id;
        const newLastId = addPokemonList[addPokemonList.length - 1].id;

        const detFirstId = detailedPokemonList[0].id;
        const detLastId = detailedPokemonList[detailedPokemonList.length - 1].id;

        overlapFound = 
          (newFirstId >= detFirstId && newFirstId <= detLastId) || 
          (newLastId >= detFirstId && newLastId <= detLastId);

        console.log('newFirstId:', newFirstId);
        console.log('newLastId:', newLastId);
        console.log('detFirstId:', detFirstId);
        console.log('detLastId:', detLastId);
        console.log("Iteration count", iterationCount);

        iterationCount++; // Increment iteration count
      }

      // If the loop ended due to too many iterations, we can still proceed
      const allPokemons = [...detailedPokemonList, ...addPokemonList];
      const shuffledPokemons = shuffleArray(allPokemons);

      // Set the shuffled Pokémon list
      setDetailedPokemonList(shuffledPokemons);
      setRemovedPokis(false); // Reset the flag for the next turn
    };

    loadPokemons();
  }
}, [removedPokis]);

const shuffleArray = (array) => {
  let shuffledArray = [...array]; // Make a copy of the array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
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
    console.log("Clicked pokis", clickedPokis);
  })

};
useEffect(() =>{
  const clickedPokisSet = new Set(clickedPokis);
  if(clickedPokisSet.size != clickedPokis.length && clickedPokis.length > 0){
    setGameOver(true);
    console.log("Game over!");
  }
},[clickedPokis])


if(loading == false){
    return(<><h3>Loading Pokemon data...</h3></>)
}

if (gameOver == true){
  return(<><h3>Game Over...</h3></>)
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