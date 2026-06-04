
async function fetchPokemonList() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const data = await response.json()// convert the raw response into usable js data

  const pokemonArray = data.results

  const pokemonDetails = await Promise.all(
    pokemonArray.map(pokemon =>
      fetch(pokemon.url).then(res => res.json())
    )
  )

  allPokemon = pokemonDetails; // pokemonDetails is an array containing pokemon elements
  displayPokemon(allPokemon);

}

fetchPokemonList();
let allPokemon = [];

async function displayPokemon(pokemonList){
  document.getElementById("pokemon-container").innerHTML = "" //clear first!
  pokemonList.forEach(pokemon => {
    const card = document.createElement("div")// creates div html element dynamically
    card.classList.add("pokemon-card")
    card.innerHTML = `<img src="${pokemon.sprites.front_default}">
    <p>${pokemon.name}</p>
    <p>${pokemon.id}</p>`

    document.getElementById("pokemon-container").appendChild(card)
  })
}

async function searchPokemon() {
  let value = document.getElementById("search-input").value.toLowerCase();
  const filtered = allPokemon.filter(pokemon =>
    pokemon.name.includes(value)
  )
  displayPokemon(filtered);
}

document.getElementById("search-input").addEventListener("input", searchPokemon);
