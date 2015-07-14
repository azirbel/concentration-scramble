import icAjax from 'ic-ajax';
import WordChallenge from '../models/word-challenge';

// Creates an authenticated or unauthenticated request depending on whether
// the token was passed in or not
function _getWords(wordLength, numWords) {
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
};

// Convenience function to make a WordChallenge object
// Only used to make the code look cleaner when making levels
function _buildChallenge(wordnikObject, numHiddenCharacters) {
  return WordChallenge.create({
    word: wordnikObject.word,
    numHiddenCharacters: numHiddenCharacters
  });
};

// Returns a promise.
function generateChallenges() {
  var challenges = [];
  return Ember.RSVP.hash({
    fourLetters: _getWords(4, 5),
    fiveLetters: _getWords(5, 6),
    sixLetters: _getWords(6, 7)
  }).then(function(wordBank) {
    // This is a messy way to build levels, but it works.
    // It's pretty terrible, because you need to make sure to get the indexes
    // right or else you'll get repeated words. If I needed to build level
    // sets more than once, I'd think of a more clever way to do it. It would
    // be awesome to use generator functions for this.
    challenges.pushObject(_buildChallenge(wordBank.fourLetters[0], 0));
    challenges.pushObject(_buildChallenge(wordBank.fiveLetters[0], 0));
    // Note: no six-letter word at the start. We want to show hidden letters
    // as soon as possible to get the player interested, so we move it a
    // level down.
    challenges.pushObject(_buildChallenge(wordBank.fourLetters[1], 1));
    challenges.pushObject(_buildChallenge(wordBank.sixLetters[0], 0));
    challenges.pushObject(_buildChallenge(wordBank.fiveLetters[1], 1));
    challenges.pushObject(_buildChallenge(wordBank.sixLetters[1], 1));
    challenges.pushObject(_buildChallenge(wordBank.fourLetters[2], 2));
    challenges.pushObject(_buildChallenge(wordBank.fiveLetters[2], 2));
    challenges.pushObject(_buildChallenge(wordBank.sixLetters[2], 2));
    challenges.pushObject(_buildChallenge(wordBank.fourLetters[3], 3));
    challenges.pushObject(_buildChallenge(wordBank.fiveLetters[3], 3));
    challenges.pushObject(_buildChallenge(wordBank.sixLetters[3], 3));
    challenges.pushObject(_buildChallenge(wordBank.fourLetters[4], 4));
    challenges.pushObject(_buildChallenge(wordBank.fiveLetters[4], 4));
    challenges.pushObject(_buildChallenge(wordBank.sixLetters[4], 4));
    challenges.pushObject(_buildChallenge(wordBank.fiveLetters[5], 5));
    challenges.pushObject(_buildChallenge(wordBank.sixLetters[5], 5));
    challenges.pushObject(_buildChallenge(wordBank.sixLetters[6], 6));

    // TODO: Remove
    console.log(challenges.mapBy('word'));
    return challenges;
  });
};

export default { generateChallenges };
