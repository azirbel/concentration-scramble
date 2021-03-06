import Ember from 'ember';

export default Ember.Component.extend({
  // API - Passed in
  // --------------------------------------------------------------------------
  letters: null,
  correctGuess: null,

  correctGuessCharacters: function() {
    if (this.get('correctGuess')) {
      return this.get('correctGuess').split('');
    }
    return [];
  }.property('correctGuess')
});
