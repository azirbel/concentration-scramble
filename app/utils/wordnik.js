import icAjax from 'ic-ajax';

// Creates an authenticated or unauthenticated request depending on whether
// the token was passed in or not
// function getWords(numWords, wordLength) {
//   return icAjax('http://api.wordnik.com:80/v4/words.json/randomWords', {
//     hasDictionaryDef: false,
//     includePartOfSpeech: 'noun,adjective,adverb',
//     minCorpusCount: 50000,
//     minLength: wordLength,
//     maxLength: wordLength,
//     limit: numWords,
//     apiKey: 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
//   });
// }

function getWords(numWords, wordLength) {
  return new Promise(function(resolve, reject) {
    resolve(['zirbel', 'weed', 'head']);
  });
}

export default { getWords };
