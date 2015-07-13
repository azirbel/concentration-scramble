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

  init: function() {
    var word = this.get('word');
    this.set('originalWord', word);
    this.set('scrambledWord', word);
    // TODO: Apply numHiddenCharacters
  },

  hiddenIndices: Ember.computed(function() {
    return [];
  }),

  // TODO: Use the other form of CP, using .property()
  letters: Ember.computed('word', 'hiddenIndices', function() {
    var hiddenIndices = this.get('hiddenIndices');
    return this.get('scrambledWord').split('').map(function (character, idx) {
      var isHidden = false;
      if (hiddenIndices.indexOf(idx) >= 0) {
        isHidden = true;
      }
      return Letter.create({
        character: character,
        hidden: isHidden
      });
    });
  })
});
