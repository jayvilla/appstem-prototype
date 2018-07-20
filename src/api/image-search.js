import CONFIG from '../config.json';

const ImageSearchAPI = async(searchTerm) => {
  try {
    let uri = `https://contextualwebsearch-websearch-v1.p.mashape.com/api/Search/ImageSearchAPI?count=25&q=${searchTerm}&autoCorrect=false`;
    let options = {
      method: "GET",
      headers: {
        "X-Mashape-Key": CONFIG.API_KEY,
        "X-Mashape-Host": CONFIG.IMAGE_API_HOST,
      }
    };
    
    let response = await fetch(uri, options);
    let json = await response.json();

    return json;
  } catch (e) {
    console.log(e);
  }
}

export default ImageSearchAPI;
