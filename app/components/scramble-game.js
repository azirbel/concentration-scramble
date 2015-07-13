import Ember from 'ember';
import WordChallenge from '../models/word-challenge';

export default Ember.Component.extend({
  didInsertElement: function() {
    this._super();
    $('html').keydown(this.keyPress.bind(this));
  },

  willDestroyElement: function() {
    // HACK: Should remove just the handler we added
    $('html').off('keydown');
    this._super();
  },

  keyPress: function(e) {
    var code = e.keyCode;
    if (!code || e.altKey || e.ctrlKey || e.metaKey) {
      return;
    }
    // Return
    if (code === 13) {
      if (this.get('isStartState')) {
        this.restartGame();
      }
      if (this.get('isEndState')) {
        this.sendAction('newGame');
        this.restartGame();
      }
    }
    // Backspace
    if (code === 46 || code === 8) {
      e.preventDefault();
      this.unguessChar();
    }
    // Tab
    if (code === 9) {
      e.preventDefault();
      this.decrementProperty('score', 2);
      this.send('previewHidden');
    }
    // Letters, upper or lowercase
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      e.preventDefault();
      this.guessChar(String.fromCharCode(code).toLowerCase());
    }
  },

  restartGame: function() {
    this.set('isStartState', false);
    this.set('isEndState', false);
    this.set('timeRemaining', 6);
    this.set('score', 0);
    this.set('index', 0);
    this.startClock();
    this.send('previewHidden');
  },

  // API - Passed in
  // --------------------------------------------------------------------------

  // Array of WordChallenges
  wordChallenges: null,

  // Main game state
  // --------------------------------------------------------------------------
  isStartState: true,
  isEndState: false,
  // TODO: Rename
  index: 0,
  timeRemaining: 6,
  score: 0,
  level: Ember.computed('index', function() {
    if (this.get('isEndState')) {
      return this.get('index');
    }
    return this.get('index') + 1;
  }),

  _clockCallback: null,

  showHidden: true,

  // Misc
  // --------------------------------------------------------------------------
  startClock: function() {
    this.stopClock();
    // TODO: Apparently you can't rely on this for actual time. Revisit
    this.set('_clockCallback', setInterval(function() {
      this.tick()
    }.bind(this), 1000));
  },

  stopClock: function() {
    clearInterval(this.get('_clockCallback'));
  },

  tick: function() {
    this.decrementProperty('timeRemaining');
    if (this.get('timeRemaining') <= 0) {
      this.incrementProperty('index');
      this.send('gameOver');
    }
  },

  lastWord: function() {
    if (this.get('index') === 0) {
      return '-';
    } else {
      var lastChallenge = this.get('wordChallenges')[this.get('index') - 1];
      return lastChallenge.get('originalWord');
    }
  }.property('index', 'wordChallenges.@each.originalWord'),

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
      this.send('correctGuess');
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
  },

  actions: {
    correctGuess: function() {
      // Scoring
      var challenge = this.get('currentChallenge');
      var numPoints = challenge.get('originalWord.length') +
          challenge.get('numHiddenCharacters');

      this.incrementProperty('score', numPoints);
      this.incrementProperty('timeRemaining', numPoints * 2);

      // Call setProperties to set everything atomically, so we don't
      // get a transition on the rerender
      var currentIndex = this.get('index');
      this.setProperties({
        index: currentIndex + 1,
        guessedLetters: [],
        showHidden: true
      });

      if (this.get('index') >= this.get('wordChallenges.length')) {
        this.send('gameOver', true);
      }
      
      this.send('previewHidden');
    },

    gameOver: function(win=false) {
      this.set('isEndState', true);
      this.stopClock();
      this.incrementProperty('score', _.floor(this.get('timeRemaining') / 2));
    },

    previewHidden: function() {
      this.set('showHidden', true);
      Ember.run.later(function() {
        this.set('showHidden', false)
      }.bind(this), 2000);
    }
  }
});
