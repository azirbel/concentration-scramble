import Ember from 'ember';
import WordChallenge from '../models/word-challenge';

export default Ember.Route.extend({
  model: function() {
    return ['cats', 'dogs', 'horse'].map(function(word) {
      return WordChallenge.create({
        word: word
      });
    });
  }
});
