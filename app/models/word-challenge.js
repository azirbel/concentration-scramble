import Ember from 'ember';

export default Ember.Object.extend({
  // API - Passed in
  // --------------------------------------------------------------------------
  word: null,

  hiddenIndices: Ember.computed(function() {
    return [];
  })
});
