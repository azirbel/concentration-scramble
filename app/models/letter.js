import Ember from 'ember';

// TODO: "Letter" is a misnomer. This is an object that bundles state with it,
// and needs a new name. But for now I've consistently used "character" to
// describe the actual text character.
export default Ember.Object.extend({
  // API - Passed in
  // --------------------------------------------------------------------------
  character: '~',
  hidden: false,
  guessed: false
});
