This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Description

This is a simple image search application with spell check.

## Implementation

1. First, the spell check removes any non alphabet characters from the search term.
2. Then, the word (if not valid) will run through an algorithm replacing all vowels and creating every possible combination.
3. After the algorithm is done running, every word is sent to an API validating each word.
4. The spellcheck is short circuit to stop after finding the first valid combination.
5. The search term will then be run through an image search API (if the first word is valid, it will skip to this step)
6. The api then returns at maximum 50 results.
7. Errors that are checked for include:
    - No search term is entered.
    - Search term is entered but non alphabet. (Ex. @$#^%#$@)
    - Search term is entered but no possible spellcheck available. (Ex. vbnmna)
