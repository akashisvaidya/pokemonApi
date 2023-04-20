document.querySelector("#search-btn").addEventListener("click", getPokemon);
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log(capitalize("hello"));
function getPokemon(event) {
  const name = document.querySelector("#pokemon-name").value;
  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const id = data.id;
      console.log(id);
      document.querySelector(".pokemonBox").innerHTML = `
    <div>  <img src="${
      data.sprites.other["official-artwork"].front_default
    }" alt="${data.name}" /> </div>
    <div class="pokemonInfo">
        <h1>${capitalize(data.name)}</h1>
        <p>Description</p>
        <p>Weight: ${data.weight}</p>
        <p>Height: ${data.height}</p>

      </div>
    
    `;
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .then((response) => response.json())
        .then((data) => {
          //   const seenText = [];
          //   for (i = 0; i < data.flavor_text_entries.length; i++) {
          //     if (data.flavor_text_entries[i].language.name === "en") {
          //       const flavorText = data.flavor_text_entries[i].flavor_text;
          //       console.log(data.flavor_text_entries[i].version.name);
          //       if (!seenText.includes(flavorText)) {
          //         console.log(flavorText);
          //         seenText.push(flavorText);

          // }

          //   }
          // }
          const flavorTextVersion = {};
          for (let i in data.flavor_text_entries) {
            const entry = data.flavor_text_entries[i];
            // console.log(entry);
            if (entry.language.name === "en") {
              const versionName = entry.version.name;
              const flavorText = entry.flavor_text;
              //   console.log(versionName, flavorText);
              if (!flavorTextVersion[versionName]) {
                flavorTextVersion[versionName] = flavorText;
              }
            }
          }
          const flavorTextArray = Object.entries(flavorTextVersion).map(
            ([versionName, flavorText]) => ({ versionName, flavorText })
          );
          console.log(flavorTextVersion);
          console.log(flavorTextArray);
        });
    })
    .catch((err) => {
      console.log("pokemon not found", err);
    });
  event.preventDefault();
}
