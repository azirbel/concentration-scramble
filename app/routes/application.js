import Ember from 'ember';
import WordChallenge from '../models/word-challenge';
import Wordnik from '../utils/wordnik';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    var challenges = [];
    return Ember.RSVP.hash({
      fourLetters: Wordnik.getWords(4, 5),
      fiveLetters: Wordnik.getWords(5, 6),
      sixLetters: Wordnik.getWords(6, 7)
    }).then(function(wordBank) {
      // This is a messy way to build levels, but it works.
      // It's pretty terrible, because you need to make sure to get the indexes
      // right or else you'll get repeated words. If I needed to build level
      // sets more than once, I'd think of a more clever way to do it. It would
      // be awesome to use generator functions for this.
      challenges.pushObject(_this.buildChallenge(wordBank.fourLetters[0], 0));
      challenges.pushObject(_this.buildChallenge(wordBank.fiveLetters[0], 0));
      // Note: no six-letter word at the start. We want to show hidden letters
      // as soon as possible to get the player interested, so we move it a
      // level down.
      challenges.pushObject(_this.buildChallenge(wordBank.fourLetters[1], 1));
      challenges.pushObject(_this.buildChallenge(wordBank.sixLetters[0], 0));
      challenges.pushObject(_this.buildChallenge(wordBank.fiveLetters[1], 1));
      challenges.pushObject(_this.buildChallenge(wordBank.sixLetters[1], 1));
      challenges.pushObject(_this.buildChallenge(wordBank.fourLetters[2], 2));
      challenges.pushObject(_this.buildChallenge(wordBank.fiveLetters[2], 2));
      challenges.pushObject(_this.buildChallenge(wordBank.sixLetters[2], 2));
      challenges.pushObject(_this.buildChallenge(wordBank.fourLetters[3], 3));
      challenges.pushObject(_this.buildChallenge(wordBank.fiveLetters[3], 3));
      challenges.pushObject(_this.buildChallenge(wordBank.sixLetters[3], 3));
      challenges.pushObject(_this.buildChallenge(wordBank.fourLetters[4], 4));
      challenges.pushObject(_this.buildChallenge(wordBank.fiveLetters[4], 4));
      challenges.pushObject(_this.buildChallenge(wordBank.sixLetters[4], 4));
      challenges.pushObject(_this.buildChallenge(wordBank.fiveLetters[5], 5));
      challenges.pushObject(_this.buildChallenge(wordBank.sixLetters[5], 5));
      challenges.pushObject(_this.buildChallenge(wordBank.sixLetters[6], 6));

      // TODO: Remove
      console.log(challenges.mapBy('word'));
      return challenges;
    });
  },

  // Convenience function to make a WordChallenge object
  // Only used to make the code look cleaner when making levels
  buildChallenge: function(wordnikObject, numHiddenCharacters) {
    return WordChallenge.create({
      word: wordnikObject.word,
      numHiddenCharacters: numHiddenCharacters
    });
  },

  actions: {
    newGame: function() {
      this.refresh();
    }
  }
});
