import React, { Component } from "react";
import logo from "./logo.svg";
import "./styles/App.css";

import ImageSearchAPI from './api/image-search.js';
import WordsAPI from './api/words.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: "",
      searchResults: [],
      combos: {},
      imageToShowURL: '',
      showImageOverlay: false
    };

    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  formatWord(word) {
    return word.replace(/\W+|[0-9]+/gi, "");
  }

  async isValidWord(word) {
    return WordsAPI(word);
  }

  async getSearchResults(searchTerm) {
    return ImageSearchAPI(searchTerm);
  }

  renderResults() {
    const { searchResults } = this.state;

    return searchResults.map((result, i) => {
      return (
        <div className="result-image-wrapper" key={i}>
          <img onClick={() => this.handleImageClick(result.url)} className="image" src={result.url} />
        </div>
      );
    });
  }

  getVowelCombos() {
    let vowels = ["a", "e", "i", "o", "u"];
    let combos = {};

    return (this.createVowelCombos = (word, start) => {
      let currentWord = word;
      let splitWord = word.split("");

      if (word in combos) return;

      if (start === splitWord.length) {
        combos[word] = word;
        return;
      }

      if (splitWord[start].match(/[aeiou]/gi)) {
        for (let j = 0; j < 5; j++) {
          currentWord = currentWord.split("");
          currentWord.splice(start, 1, vowels[j]);
          currentWord = currentWord.join("");
          this.createVowelCombos(currentWord, start + 1);
        }
      } else {
        this.createVowelCombos(currentWord, start + 1);
      }

      return combos;
    });
  }

  handleImageClick(imageURL) {
    if (!this.state.showImageOverlay) {
      this.setState({
        showImageOverlay: true,
        imageToShowURL: imageURL
      })
    }
    else {
      this.setState({
        showImageOverlay: false,
        imageToShowURL: ''
      })
    }
    console.log(imageURL)
    this.setState({ showImageOverlay: !this.state.showImageOverlay }, () => {
      console.log(this.state)
    });
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    let { searchTerm } = this.state;
    searchTerm = this.formatWord(searchTerm);

    let isValidWord = await this.isValidWord(searchTerm);

    if (isValidWord) {
      let searchResults = await this.getSearchResults(searchTerm);
      this.setState({ searchResults: searchResults.value });
    } else {
      let vowelCombos = this.getVowelCombos();
      vowelCombos = vowelCombos(searchTerm, 0);

      for (let word in vowelCombos) {
        let comboIsValid = await this.isValidWord(word);
        if (comboIsValid) {
          this.setState({ searchTerm: word });
          let searchResults = await this.getSearchResults(word);
          this.setState({ searchResults: searchResults.value });
          break;
        }
      }
    }
  }

  render() {
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

        {this.state.showImageOverlay && this.state.imageToShowURL && (
          <div className="overlay">
            <div
              className="close-button"
              onClick={this.handleImageClick}
            >X
            </div>
            <img src={this.state.imageToShowURL} />
          </div>
        )}

        <div className="search-results">
          {this.state.searchResults && this.renderResults()}
        </div>
      </div>
    );
  }
}

export default App;
