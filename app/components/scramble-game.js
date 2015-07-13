import Ember from 'ember';
import WordChallenge from '../models/word-challenge';

export default Ember.Component.extend({
  didInsertElement: function() {
    this._super();
    $('body').keypress(this.keyPress.bind(this));
    this.startTimer();
  },

  willDestroyElement: function() {
    // HACK: Should remove just the handler we added
    $('body').off('keypress');
    this._super();
  },

  keyPress: function(e) {
    var code = e.charCode;
    if (!code) {
      return;
    }
    // Letters, upper or lowercase
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      this.guessChar(String.fromCharCode(code).toLowerCase());
    }
  },

  guessChar: function(character) {
    console.log(character);
  },

  // API - Passed in
  // --------------------------------------------------------------------------

  // Array of WordChallenges
  wordChallenges: null,

  // Main game state
  // --------------------------------------------------------------------------
  index: 0,
  timeRemaining: 60,
  score: 0,
  wordGuessed: '',
  level: Ember.computed('index', function() {
    return this.get('index') + 1;
  }),

  // Misc
  // --------------------------------------------------------------------------
  startTimer: function() {
    // TODO: Apparently you can't rely on this for actual time. Revisit
    setInterval(function() {
      this.tick()
    }.bind(this), 1000);
  },

  tick: function() {
    this.decrementProperty('timeRemaining');
  },

  currentChallenge: Ember.computed('wordChallenges', 'index', function() {
    if (this.get('index') >= this.get('wordChallenges.length')) {
      return null;
    }
    return this.get('wordChallenges')[this.get('index')];
  })
});
