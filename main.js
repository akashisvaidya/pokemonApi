document.querySelector("#search-btn").addEventListener("click", getPokemon);
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const recentSearch = [];
// console.log(capitalize("hello"));
function getPokemon(event) {
  const pokeName = document.querySelector("#pokemon-name").value.toLowerCase();
  console.log(pokeName);

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
    .then((response) => {
      if (response.ok) {
        if (!localStorage.getItem("search")) {
          localStorage.setItem("search", pokeName);
        }
        // throw new Error("Network response was not ok");
        // recentSearch.push(pokeName);

        console.log(recentSearch);
      }
      return response.json();
    })

    .then((data) => {
      // console.log(data);
      const id = data.id;
      // console.log(id);
      document.querySelector(".pokemonBox").innerHTML = `
      <div class="card" style="width: 18rem" id="card-border">
  <img class="card-img-top" src="${
    data.sprites.other["official-artwork"].front_default
  }" alt="Card image cap">
  <div class="card-body ">
    <h5 class="card-title text-center">${capitalize(data.name)}</h5>
 
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Weight: ${data.weight}</li>
    <li class="list-group-item">Height: ${data.height}</li>
    <li class="list-group-item">Base Experience: ${data.base_experience}</li>
  </ul>
  
    <button type="button" class="btn btn-warning mt-3" >Learn More about the different versions of the pokemon</button>

  </div>
 
</div>
   
    
    `;
      document.querySelector(".btn").addEventListener("click", getDescription);
      function getDescription() {
        const descriptionDiv = document.querySelector(".versions");
        if (descriptionDiv.style.display === "none") {
          descriptionDiv.style.display = "block";
          button.textContent = "Hide the version descriptions";
        } else {
          descriptionDiv.style.display = "none";
          button.textContent =
            "Learn More about the different versions of the pokemon";
        }
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
            // console.log(flavorTextVersion);
            // console.log(flavorTextArray);

            // const versionText = flavorTextArray
            //   .map((entry) => `${entry.versionName}: ${entry.flavorText} `)
            //   .join("\n");
            // console.log(versionText);
            const versionText = flavorTextArray
              .map(
                (entry) =>
                  `<li class="list-group-item">${capitalize(
                    entry.versionName
                  )}: ${entry.flavorText} </li>`
              )
              .join("\n");

            // console.log(versionText);

            document.querySelector(".versions").innerHTML = `
              <h4 class="text-center text-light">
            This Pokemon has different version, with unquie features. They are
            listed below.
          </h4>
               <ul class="list-group">
          ${versionText}
               </ul>

              `;
          });
      }

      const button = document.querySelector(".btn");
    })

    .catch((err) => {
      console.log("pokemon not found", err);
      // alert("Pokemon not found, Sorry.");
      document.querySelector(".alert-msg").innerHTML = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Holy guacamole!</strong> Pokemon not found, Please check the name.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
     `;
    });
  event.preventDefault();
}
