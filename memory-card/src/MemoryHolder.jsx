import { useState, useEffect} from "react";
import MemoryCard from "./MemoryCard";
function MemoryHolder({turn, randomOffset, detailedPokemonList, setDetailedPokemonList}){
    const [loading, setLoading] = useState(true);
    let numcards = turn;
    console.log(randomOffset)
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
}, [])
if(loading == false){
    return(<><h3>Loading Pokemon data...</h3></>)
}
console.log(detailedPokemonList)
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