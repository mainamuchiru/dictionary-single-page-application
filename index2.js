document.addEventListener("DOMContentLoaded", function () {
  const externalApi = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  const wordsFavorite = [];
  let dateVar = new Date().getSeconds();

  const btnFetch = document.getElementById("btn-wordsearch");
  const displayResults = document.getElementById("display-results");
  const favoritesAdd = document.getElementById("add-favourites");
  const errorDiv = document.getElementById("error-message");
  const btnFavicon = document.getElementById("btn-favorite");
  //const upcomingTable = document.getElementById("favorite-words-section tbody");
  const upcomingTable = document.querySelector("#favorite-words-section tbody");
  const wordTxt = document.getElementById("word-txtbox");
  const tableFavwords = document.getElementById("fav-words-table");

  async function fetchWord(word) {
    try {
      const response = await fetch(`${externalApi}${word}`);
      if (!response.ok) {
        throw new Error("Word not found");
      }
      const data = await response.json();
      return data[0]; // Return the first result
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function displayWord(result) {
    dateVar = new Date().valueOf();
    btnFavicon.style.display = "unset";

    const { word, phonetics, meanings } = result;

    const phoneticText =
      phonetics.find((p) => p.text && p.audio) || phonetics[0] || {};
    const audioUrl = phonetics.find((p) => p.audio)?.audio;
    const meaning = meanings[0]?.definitions[0]?.definition || "N/A";
    const synonymsList =
      meanings[0]?.synonyms?.length > 0
        ? meanings[0].synonyms
        : meanings[0]?.definitions[0]?.synonyms || [];
    const synonyms = synonymsList.length > 0 ? synonymsList.join(", ") : "N/A";
    const partOfSpeech = meanings[0]?.partOfSpeech || "N/A";
    const example = meanings[0]?.definitions[0]?.example || "N/A";

    const hName = document.createElement("h2");
    const txtPronounce = document.createElement("h4");
    const audioPronounce = document.createElement("AUDIO");
    const pReults = document.createElement("p");

    hName.textContent = word;
    txtPronounce.textContent = phoneticText.text;
    pReults.textContent = meaning;
    audioPronounce.setAttribute("src", `${audioUrl}`);
    audioPronounce.setAttribute("controls", "controls");

    displayResults.append(hName);
    displayResults.append(txtPronounce);
    displayResults.append(audioPronounce);
    displayResults.append(pReults);

    const wordsObj = {
      id: dateVar,
      name: `${word}`,
      phonetic: phoneticText,
      audio: audioUrl,
      meaning: meaning,
    };

    btnFavicon.addEventListener("click", (e) => {
      if (!e.detail || e.detail == 1) {
        const searchName = wordsFavorite.find((w) => w.name === word);
        // console.log(searchName)
        if (searchName) {
          console.log("Word exists amigo");
        } else {
          wordsFavorite.push(wordsObj);
          //   saveFavwords(wordsFavorite)
          saveFavwords();
          //   console.log(wordsFavorite);
          console.log("word added successfully");
        }
      }
    });
  }

  function saveFavwords() {
    //upcomingTable.innerHTML = "";
    tableFavwords.style.display = "unset";
    console.log(wordsFavorite);

    let number = 1;
    const row = document.createElement("tr");
    wordsFavorite.forEach((p) => {
      row.innerHTML = `
        <td class="word-fav-name">${number++}</td>
       <td class="word-fav-name">${p.name}</td>
       <td> <button class="delete-btn" data-id="${p.id}"> ❌ Delete</button></td>
       `;
      upcomingTable.append(row);
    });
  }

  btnFetch.addEventListener("click", async (event) => {
    dateVar = "";
    console.log(dateVar);
    displayResults.textContent = "";
    event.preventDefault();
    const word = wordTxt.value.trim();
    // resultContainer.style.display = 'none'; // Hide the box initially
    // resultContainer.innerHTML = ''; // clear previous results

    if (word) {
      const wordData = await fetchWord(word);
      displayWord(wordData);
    }
    wordTxt.value = "";
    wordTxt.focus();
  });

  document.addEventListener("click", function (e) {
    const id = Number(e.target.dataset.id);

    if (e.target.classList.contains("delete-btn")) {
      const index = wordsFavorite.findIndex((t) => t.id === id);
      if (index !== -1) wordsFavorite.splice(index, 1);

      saveFavwords();
    }
  });
});
