import Ember from 'ember';
import Letter from '../models/letter';

export default Ember.Object.extend({
  // API - Passed in
  // --------------------------------------------------------------------------
  word: '',

  // Main state
  // --------------------------------------------------------------------------
  originalWord: '',
  scrambledWord: '',
  numHiddenCharacters: 0,
  hiddenIndices: [],

  init: function() {
    var word = this.get('word').toLowerCase();
    this.set('originalWord', word);
    this.set('scrambledWord', word);
    while(this.get('scrambledWord') === word) {
      this.set('scrambledWord', _.shuffle(word).join(''));
    }
    var numHidden = this.get('numHiddenCharacters');
    this.set('hiddenIndices',
        _.take(_.shuffle(_.range(word.length)), numHidden));
  },

  // TODO: Use the other form of CP, using .property()
  letters: Ember.computed('scrambledWord', 'hiddenIndices', function() {
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
  })
});
