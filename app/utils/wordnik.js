import icAjax from 'ic-ajax';

// Creates an authenticated or unauthenticated request depending on whether
// the token was passed in or not
function getWords(wordLength, numWords) {
  return icAjax('http://api.wordnik.com:80/v4/words.json/randomWords', {
    data: {
      hasDictionaryDef: false,
      includePartOfSpeech: 'noun',
      minCorpusCount: 50000,
      maxCorpusCount: -1,
      minDictionaryCound: 5,
      maxDictionaryCound: -1,
      minLength: wordLength,
      maxLength: wordLength,
      limit: numWords,
      api_key: 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
    }
  });
}

export default { getWords };
