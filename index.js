document.addEventListener("DOMContentLoaded", function () {
  const externalApi = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  const btnFetch = document.getElementById("btn-wordsearch");
  const displayResults = document.getElementById("displayResults");
  const errorDiv = document.getElementById("error-message");

  btnFetch.addEventListener("click", () => {
    displayResults.textContent = "";
    const wordTxt = document.getElementById("word-txtbox");
    const searchTxt = wordTxt.value.trim();
    console.log(searchTxt);

    fetchWord(searchTxt);
  });

  function displayWord(result) {
    const wordHeader = result[0].word;
    //const myFunc = sampleFunc()
    const wordPronounce = result[0].phonetic;
    //const wordAudio = result[0].phonetics[1].audio;
    const wordMeaning = result[0].meanings[0].definitions[0].definition;
    
    console.log(wordMeaning);

    // if (wordAudio != "undefined") {
    //   console.log(`Audio does exist for the word: ${wordHeader}`)
    // } else{
    //     console.log(`Audio does not exist for the word: ${wordHeader}`)
    // }
    

    // const hName = document.createElement("h2");
    // const txtPronounce = document.createElement("h4");
    // const audioPronounce = document.createElement("AUDIO");
    // const pReults = document.createElement("p");
    // audioPronounce.setAttribute("src", `${wordAudio}`);
    // audioPronounce.setAttribute("controls", "controls");

    // hName.textContent = wordHeader;
    // txtPronounce.textContent = wordPronounce;
    // pReults.textContent = wordMeaning;
    // displayResults.append(hName);
    // displayResults.append(txtPronounce);
    // displayResults.append(audioPronounce);
    // displayResults.append(pReults);
    
  }

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
});
