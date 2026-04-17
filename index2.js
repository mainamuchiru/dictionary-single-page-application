document.addEventListener("DOMContentLoaded", function () {
  const externalApi = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  const wordsFavorite = [];
  let dateVar = new Date().getUTCMilliseconds();

  const btnFetch = document.getElementById("btn-wordsearch");
  const displayResults = document.getElementById("display-results");
  const favoritesAdd = document.getElementById("add-favourites");
  const errorDiv = document.getElementById("error-message");
  const btnFavicon = document.getElementById("btn-favorite");
  const upcomingTable = document.getElementById("fav-words-table tbody");
  const wordTxt = document.getElementById("word-txtbox");

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
    console.log(result);

    //New code
    const { word, phonetics, meanings } = result;
    console.log(word);
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

    // const wordHeader = result[0].word;
    // const wordPronounce = result[0].phonetic;
    // let wordAudio = result[0].phonetics[0].audio;
    // const wordMeaning = result[0].meanings[0].definitions[0].definition;

    // if (wordAudio != "undefined") {
    //   console.log(`Audio does exist for the word: ${wordHeader}`)
    // } else{
    //     console.log(`Audio does not exist for the word: ${wordHeader}`)
    // }

    const hName = document.createElement("h2");
    const txtPronounce = document.createElement("h4");
    const audioPronounce = document.createElement("AUDIO");
    const pReults = document.createElement("p");
    //const
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

    let searchName = wordsFavorite.filter(w=> w[0].name === word)
    console.log(searchName)
    btnFavicon.addEventListener("click", (e) => {
      if (!e.detail || e.detail == 1) {
        if (wordsObj.name !== searchName) {
          wordsFavorite.push(wordsObj);
          saveFavwords(word);
        } else {
          console.log("Word Exists");
          console.log(wordsFavorite);
        }
      }
    });
  }

  function saveFavwords() {
    // upcomingTable.innerHTML= "";
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
});
