document.addEventListener("DOMContentLoaded", function () {
  const externalApi = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  const wordsFavorite = [];

  const btnFetch = document.getElementById("btn-wordsearch");
  const displayResults = document.getElementById("display-results");
  const favoritesAdd = document.getElementById("add-favourites");
  const errorDiv = document.getElementById("error-message");
  const btnFavicon = document.getElementById("btn-favorite");
  const upcomingTable = document.getElementById("fav-words-table tbody");

  async function fetchWord(word) {
    try {
      const response = await fetch(externalApi + word);
      const postsJson = await response.json();
      console.log(postsJson);
      displayWord(postsJson);
    } catch (error) {
      console.log(error);
    }
  }

  function displayWord(result) {
    btnFavicon.style.display = "unset";

    const wordHeader = result[0].word;
    const wordPronounce = result[0].phonetic;
    let wordAudio = result[0].phonetics[0].audio;
    const wordMeaning = result[0].meanings[0].definitions[0].definition;

    console.log(wordMeaning);

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
    hName.textContent = wordHeader;
    txtPronounce.textContent = wordPronounce;
    pReults.textContent = wordMeaning;
    audioPronounce.setAttribute("src", `${wordAudio}`);
    audioPronounce.setAttribute("controls", "controls");

    displayResults.append(hName);
    displayResults.append(txtPronounce);
    displayResults.append(audioPronounce);
    displayResults.append(pReults);

    const wordsObj = {
      id: 1,
      name: wordHeader,
      phonetic: wordPronounce,
      audio: wordAudio,
      meaning: wordMeaning,
    };
    btnFavicon.addEventListener("click", () => {
      wordsFavorite.push(wordsObj);

      saveFavwords(wordsFavorite);
    });
  }

  function saveFavwords() {
    console.log("Inside save fav words");
    console.log(wordsFavorite);
    // upcomingTable.innerHTML= "";
  }

  btnFetch.addEventListener("click", () => {
    displayResults.textContent = "";
    const wordTxt = document.getElementById("word-txtbox");
    const searchTxt = wordTxt.value.trim();
    console.log(searchTxt);

    fetchWord(searchTxt);
  });
});
