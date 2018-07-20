import React, { Component } from "react";
import logo from "./logo.svg";
import "./styles/App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: "",
      searchResults: [],
      combos: {}
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  renderResults() {
    const { searchResults } = this.state;

    return searchResults.map((result, i) => {
      return (
        <div className="result-image-wrapper" key={i}>
          <img
            className="image"
            src={result.url}
          />
        </div>
      )
    })
  }

  formatWord(word) {
    return word.replace(/\W+|[0-9]+/gi, "");
  }

  async isValidWord(word) {
    try {
      let uri = `https://wordsapiv1.p.mashape.com/words/${word}`;
      let options = {
        method: "GET",
        headers: {
          "X-Mashape-Key": "5gdwILBqvCmshk6QILmOV86OQ2HYp10PAiojsnpzNX3eom7oaO",
          "X-Mashape-Host": "wordsapiv1.p.mashape.com"
        }
      };

      let response = await fetch(uri, options);
      let json = await response.json();

      return json.results ? true : false;
    } catch (e) {
      console.log(e);
    }
  }

  getVowelCombos() {
    let vowels = ['a', 'e', 'i', 'o', 'u'];
    let combos = {};

    return this.createVowelCombos = (word, start) => {
      let currentWord = word;
      let splitWord = word.split('');

      if (word in combos) return;

      if (start === splitWord.length) {
        combos[word] = word;
        return;
      }

      if (splitWord[start].match(/[aeiou]/gi)) {
        for (let j = 0; j < 5; j++) {
          currentWord = currentWord.split('');
          currentWord.splice(start, 1, vowels[j]);
          currentWord = currentWord.join('');
          this.createVowelCombos(currentWord, start+1)
        }
      } else {
        this.createVowelCombos(currentWord, start+1);
      }

      return combos;
    }
  }

  async getSearchResults(searchTerm) {
    try {
      let uri = `https://contextualwebsearch-websearch-v1.p.mashape.com/api/Search/ImageSearchAPI?count=10&q=${searchTerm}&autoCorrect=false`;
      let options = {
        method: "GET",
        headers: {
          "X-Mashape-Key": "5gdwILBqvCmshk6QILmOV86OQ2HYp10PAiojsnpzNX3eom7oaO",
          "X-Mashape-Host": "contextualwebsearch-websearch-v1.p.mashape.com"
        }
      };
      let response = await fetch(uri, options);
      let json = await response.json();
      return json;
    } catch(e) {
      console.log(e);
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    let { searchTerm } = this.state;
    searchTerm = this.formatWord(searchTerm);

    let isValidWord = await this.isValidWord(searchTerm);

    if (isValidWord) {
      let searchResults = await this.getSearchResults(searchTerm);
      this.setState({ searchResults: searchResults.value });
      console.log('searchResults 1', searchResults);
    } else {
      let vowelCombos = this.getVowelCombos();
      vowelCombos = vowelCombos(searchTerm, 0);

      for (let word in vowelCombos) {
        let comboIsValid = await this.isValidWord(word);
        if (comboIsValid) {
          this.setState({ searchTerm: word })
          let searchResults = await this.getSearchResults(word);
          this.setState({ searchResults: searchResults.value });
          console.log('search results 2: ', searchResults);
          break;
        }
      }
    }
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <div className="search-field">
          <form onSubmit={this.handleFormSubmit}>
            <input
              placeholder="Search"
              type="text"
              value={this.state.searchTerm}
              onChange={e => this.setState({ searchTerm: e.target.value })}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="search-results">
          {this.state.searchResults && this.renderResults()}
        </div>
      </div>
    );
  }
}

export default App;
