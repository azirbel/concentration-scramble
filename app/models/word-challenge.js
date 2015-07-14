import Ember from 'ember';
import Letter from '../models/letter';

export default Ember.Object.extend({
  // API - Passed in
  // --------------------------------------------------------------------------
  word: '',
  numHiddenCharacters: 0,

  // Main state
  // --------------------------------------------------------------------------
  originalWord: '',
  scrambledWord: '',
  hiddenIndices: [],

  // Pass in "word" and "numHiddenCharacters" and Ember.Object.create() calls
  // this to take care of the rest of the setup.
  init: function() {
    var word = this.get('word').toLowerCase();
    this.set('originalWord', word);
    this.set('scrambledWord', word);
    // Make sure the scrambled word is not the same as the original. Keep
    // shuffling until it is so!
    while(this.get('scrambledWord') === word) {
      this.set('scrambledWord', _.shuffle(word).join(''));
    }
    var numHidden = this.get('numHiddenCharacters');
    this.set('hiddenIndices',
        _.take(_.shuffle(_.range(word.length)), numHidden));
  },

  // TODO: Again a misnomer; this is an array of Letter (objects) containing
  // state
  // TODO: This should not actually be a computed property. It should be set
  // only in "init". The current structure could lead to bugs if the
  // computation is triggered again (it isn't, so everything works fine).
  letters: function() {
    var hiddenIndices = this.get('hiddenIndices');
    return this.get('scrambledWord').split('').map(function (character, idx) {
      var hidden = false;
      if (hiddenIndices.indexOf(idx) >= 0) {
        hidden = true;
      }
      return Letter.create({
        character: character,
        hidden: hidden
      });
    });
  }.property('scrambledWord', 'hiddenIndices')
});
