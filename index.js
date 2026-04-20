document.addEventListener("DOMContentLoaded", function () {
  const Dictionary_External_Api = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  const wordsFavorite = [];
  let dateVar = new Date().getSeconds();
  let currentWordObj = null;

  const searchForm = document.getElementById("search-form");
  
  const displayResults = document.getElementById("display-results");
  const errorDiv = document.getElementById("erro-section");
  const btnFavicon = document.getElementById("btn-favorite");
  const upcomingTable = document.querySelector("#favorite-words-section tbody");
  const wordTxt = document.getElementById("word-txtbox");
  const resultLoad = document.getElementById("result-sec");

  btnFavicon.style.display = "none";

  async function fetchWord(word) {
    resultLoad.innerHTML = "<p>Searching...</p>";
    errorDiv.innerHTML = "";
    btnFavicon.style.display = "none";

    try {
      const response = await fetch(`${Dictionary_External_Api}${word}`);

      if (!response.ok) {
        throw new Error("Word not found");
      }

      const data = await response.json();
      resultLoad.innerHTML = "";
      return data[0];
    } catch (error) {
      resultLoad.innerHTML = "";
      displayError(error.message);
      return null;
    }
  }

  function displayWord(result) {
    if (!result) return;

    dateVar = new Date().valueOf();

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
    const example = meanings[0]?.definitions[0]?.example || "N/A";

    displayResults.innerHTML = `
      <div class="word-header">
        <h2>${word}</h2>
        <p><strong>Phonetic:</strong> ${phoneticText.text || "N/A"}</p>
        ${audioUrl ? `<audio controls><source src="${audioUrl}"></audio>` : ""}   
        <h3><strong>Definitions:</strong></h3>
    `;
     
    meanings.forEach((meaning) => {
      displayResults.innerHTML += `
      <h3><strong>Part of speech: ${meaning.partOfSpeech.charAt(0).toUpperCase() + meaning.partOfSpeech.slice(1)}</strong></h3>
      <ul>
        ${meaning.definitions.map((def) => `<li>${def.definition}</li>`).join("")}
      </ul>
    `;
    });

    displayResults.innerHTML += `
    <p><strong>Synonyms (${synonymsList.length}):</strong> ${synonyms}</p>
        <p><strong>Example:</strong> ${example}</p>
      </div>

    `;

    currentWordObj = {
      id: dateVar,
      name: word,
      phonetic: phoneticText,
      audio: audioUrl,
      meaning: meaning,
    };

    btnFavicon.style.display = "unset";
  }

  function displayError(message) {
    btnFavicon.style.display = "none";
    currentWordObj = null;
    errorDiv.innerHTML = `<p>Word Not Found</p>`;
  }

  btnFavicon.addEventListener("click", () => {
    if (!currentWordObj) return;

    const exists = wordsFavorite.some((w) => w.name === currentWordObj.name);

    if (!exists) {
      wordsFavorite.unshift(currentWordObj);
      saveFavwords();
      console.log("Word added to favorites");
    } else {
      alert("Word already exists in favorites");
    }
  });

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const word = wordTxt.value.trim().toLowerCase();

    if (!word) return;

    displayResults.innerHTML = "";
    const wordData = await fetchWord(word);

    if (wordData) {
      displayWord(wordData);
    }

    wordTxt.value = "";
    wordTxt.focus();
  });

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const id = Number(e.target.dataset.id);
      const index = wordsFavorite.findIndex((t) => t.id === id);
      if (index !== -1) {
        wordsFavorite.splice(index, 1);
        saveFavwords();
      }
    }
  });

  function saveFavwords() {
    const tableFavwords = document.getElementById("fav-words-table");
    tableFavwords.style.display = "table";

    upcomingTable.innerHTML = "";

    wordsFavorite.forEach((p, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.name}</td>
      <td><button class="delete-btn" data-id="${p.id}">❌</button></td>
    `;
      upcomingTable.appendChild(row);
    });
  }
});
