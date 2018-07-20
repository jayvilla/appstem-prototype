import CONFIG from '../config.json';

const WordsAPI = async(word) => {
  try {
    let uri = `https://wordsapiv1.p.mashape.com/words/${word}`;
    let options = {
      method: "GET",
      headers: {
        "X-Mashape-Key": CONFIG.API_KEY,
        "X-Mashape-Host": CONFIG.WORDS_API_HOST,
      }
    };

    let response = await fetch(uri, options);
    let json = await response.json();

    return json.results ? true : false;
  } catch (e) {
    console.log(e);
  }
}

export default WordsAPI;
