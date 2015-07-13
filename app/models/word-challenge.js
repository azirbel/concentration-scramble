import Ember from 'ember';
import Letter from '../models/letter';

export default Ember.Object.extend({
  // API - Passed in
  // --------------------------------------------------------------------------
  word: null,

  hiddenIndices: Ember.computed(function() {
    return [];
  }),

  // TODO: Use the other form of CP, using .property()
  letters: Ember.computed('word', 'hiddenIndices', function() {
    var hiddenIndices = this.get('hiddenIndices');
    return this.get('word').split('').map(function (character, idx) {
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
