import Ember from 'ember';
import WordChallenge from '../models/word-challenge';

export default Ember.Component.extend({
  // API - Passed in
  // --------------------------------------------------------------------------

  // Array of WordChallenges
  wordChallenges: null,

  // Main game state
  // --------------------------------------------------------------------------
  level: 1,
  timeRemaining: 60,
  score: 0,

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
