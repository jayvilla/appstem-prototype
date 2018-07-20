let word = 'p??>>,,y@#@th;on323423#*#*(!)';


const  isVowel = letter => {
  let vowels = {
    'a': true,
    'e': true,
    'i': true,
    'o': true,
    'u': true
  };

  return vowels[letter] ? true : false;
}


const allVowelCombos = () => {
  let vowels = ['a', 'e', 'i', 'o', 'u'];
  let combos = {};

  return createVowelCombos = (word, start) => {
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
        createVowelCombos(currentWord, start+1)
      }
    } else {
      createVowelCombos(currentWord, start+1);
    }

    return combos;
  }
};

let combos = allVowelCombos();
console.log(combos('ceku', 0));
// allVowelCombos('cekure', 0);

const formatWord = word => {
  let newWord = word;
  newWord = newWord.replace(/\W+|[0-9]+/g, '')
  return newWord;
};

// console.log(formatWord(word));
