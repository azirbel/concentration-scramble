import Ember from 'ember';
import WordChallenge from '../models/word-challenge';

export default Ember.Component.extend({
  didInsertElement: function() {
    this._super();
    $('html').keydown(this.keyPress.bind(this));
    this.startTimer();
  },

  willDestroyElement: function() {
    // HACK: Should remove just the handler we added
    $('html').off('keydown');
    this._super();
  },

  keyPress: function(e) {
    var code = e.keyCode;
    if (!code) {
      return;
    }
    // Backspace
    if (code === 46 || code === 8) {
      e.preventDefault();
      console.log('del');
      this.unguessChar();
    }
    // Letters, upper or lowercase
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      e.preventDefault();
      this.guessChar(String.fromCharCode(code).toLowerCase());
    }
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
  }),

  guessedLetters: function() {
    return [];
  }.property(),

  guessChar: function(character) {
    console.log(character);
    var challengeLetters = this.get('currentChallenge').get('letters');
    var guessedLetter = null;
    for (var i = 0; i < challengeLetters.length; i++) {
      var letter = challengeLetters[i];
      if (letter.get('guessed')) {
        continue;
      }
      if (character === letter.get('character')) {
        letter.set('guessed', true);
        guessedLetter = letter;
        break;
      }
    }

    if (guessedLetter) {
      this.get('guessedLetters').pushObject(guessedLetter);
    }

    // Check for win
    var guessedWord = this.get('guessedLetters').mapBy('character').join('');
    if (guessedWord === this.get('currentChallenge.originalWord')) {
      this.incrementProperty('index');
      this.set('guessedLetters', []);
    }
  },

  unguessChar: function() {
    var guessedLetters = this.get('guessedLetters');
    if (guessedLetters.length < 1) {
      return;
    }
    var lastLetter = guessedLetters.get('lastObject');
    lastLetter.set('guessed', false);
    guessedLetters.removeObject(lastLetter);
  }
});
