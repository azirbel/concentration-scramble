import Ember from 'ember';
import WordChallenge from '../models/word-challenge';
import Wordnik from '../utils/wordnik';

export default Ember.Route.extend({
  model: function() {
    return Wordnik.getWords(4, 4).then(function(result) {
      return result.map(function(word) {
        return WordChallenge.create({
          word: word,
          numHiddenCharacters: 1
        });
      });
    });
  },

  actions: {
    newGame: function() {
      this.refresh();
    }
  }
});
