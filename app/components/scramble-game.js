import Ember from 'ember';
import WordChallenge from '../models/word-challenge';

export default Ember.Component.extend({
  // API - Passed in
  // --------------------------------------------------------------------------

  // Array of WordChallenges
  wordChallenges: null,

  // Main game state
  // --------------------------------------------------------------------------
  wordIndex: 0,
  timeRemaining: 60,
  score: 0,
  level: Ember.computed('wordIndex', function() {
    return this.get('wordIndex') + 1;
  }),

  // Misc
  // --------------------------------------------------------------------------
  startTimer: function() {
    setInterval(function() {
      this.tick()
    }.bind(this), 1000);
  }.on('init'),

  tick: function() {
    this.decrementProperty('timeRemaining');
    console.log(this.get('timeRemaining'));
  }


});
