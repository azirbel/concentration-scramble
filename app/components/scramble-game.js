import Ember from 'ember';
import Wordnik from '../helpers/wordnik';

export default Ember.Component.extend({
  // Main game state
  // --------------------------------------------------------------------------
  challenges: null,     // Array of WordChallenge objects
  isStartState: true,
  isEndState: false,
  levelIndex: 0,
  timeRemaining: 0,
  score: 0,
  showHidden: true,
  guessedLetters: function() { return []; }.property(),

  isGameActive: function() {
    return !this.get('isStartState') && !this.get('isEndState');
  }.property('isStartState', 'isEndState'),

  // Keyboard handling
  // --------------------------------------------------------------------------
  didInsertElement: function() {
    this._super();
    Ember.$('html').keydown(this.keyPress.bind(this));
  },

  willDestroyElement: function() {
    // TODO: Should remove only the handler we added
    Ember.$('html').off('keydown');
    this._super();
  },

  keyPress: function(e) {
    var code = e.keyCode;
    if (e.altKey || e.ctrlKey || e.metaKey || !code) {
      return;
    }
    // Return/enter
    if (code === 13 && !this.get('isGameActive')) {
      // TODO: Pull out into function
      var _this = this;
      Wordnik.generateChallenges().then(function(challenges) {
        _this.set('challenges', challenges);
        _this.send('startGame');
      });
    }
    // Backspace
    if (code === 46 || code === 8) {
      e.preventDefault();  // I hate accidental "back"s in all cases
      if (this.get('isGameActive')) {
        this.send('unguessChar');
      }
    }
    // Tab
    if (code === 9 && this.get('isGameActive')) {
      e.preventDefault();
      this.decrementProperty('score', 2);
      this.send('previewHidden');
    }
    // Letters, upper or lowercase
    if (this.get('isGameActive') &&
        ((code >= 65 && code <= 90) || (code >= 97 && code <= 122))) {
      e.preventDefault();
      this.send('guessChar', String.fromCharCode(code).toLowerCase());
    }
  },

  // Clock
  // --------------------------------------------------------------------------
  _clockCallback: null,

  startClock: function() {
    this.stopClock();
    this.set('_clockCallback', setInterval(function() {
      this.tick();
    }.bind(this), 1000));
  },

  stopClock: function() {
    clearInterval(this.get('_clockCallback'));
  },

  tick: function() {
    this.decrementProperty('timeRemaining');
    if (this.get('timeRemaining') <= 0) {
      this.send('gameOver');
    }
  },

  // Computed properties for transformations on game state
  // --------------------------------------------------------------------------
  currentChallenge: function() {
    if (this.get('levelIndex') >= this.get('challenges.length')) {
      return null;
    }
    return this.get('challenges')[this.get('levelIndex')];
  }.property('challenges.[]', 'levelIndex'),

  // The last word guessed, or '-' if no words have been guessed yet
  // At the end of the game, the last word should be the last one the user saw
  lastWord: function() {
    var levelIndex = this.get('levelIndex');
    if (this.get('isEndState')) {
      levelIndex = Math.min(levelIndex + 1, this.get('challenges.length'));
    }
    if (levelIndex === 0) {
      return '-';
    } else {
      var lastChallenge = this.get('challenges')[levelIndex - 1];
      return lastChallenge.get('originalWord');
    }
  }.property('levelIndex', 'challenges.@each.originalWord', 'isEndState'),

  // levelIndex is 0-indexed, but we want to start the user at level 1
  levelDisplayNumber: Ember.computed('levelIndex', function() {
    return this.get('levelIndex') + 1;
  }),

  // Game Actions
  //
  // I've used the actions hash for "game actions/events". I think this is nice
  // because it puts them all together, and theoretically components could
  // trigger these using "sendAction". For example, the word-display component
  // could call "sendAction('previewHidden')" to trigger that game event.
  // --------------------------------------------------------------------------
  actions: {
    startGame: function() {
      this.set('isStartState', false);
      this.set('isEndState', false);
      this.set('timeRemaining', 60);    // TODO: Should be a global config
      this.set('score', 0);
      this.set('levelIndex', 0);
      this.set('guessedLetters', []);
      this.startClock();
      this.send('previewHidden');
    },

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
        this.send('correctAnswer');
      }
    },

    // Backspace over the most recently guessed character
    unguessChar: function() {
      var guessedLetters = this.get('guessedLetters');
      if (guessedLetters.length < 1) {
        return;
      }
      var lastLetter = guessedLetters.get('lastObject');
      lastLetter.set('guessed', false);
      guessedLetters.removeObject(lastLetter);
    },

    correctAnswer: function() {
      var challenge = this.get('currentChallenge');

      // You get points depending on the difficulty (approximated as word
      // length + number of hidden characters)
      var numPoints = challenge.get('originalWord.length') +
          challenge.get('numHiddenCharacters');
      this.incrementProperty('score', numPoints);
      this.set('guessedLetters', []);
      this.set('showHidden', true);

      if (this.get('levelIndex') >= this.get('challenges.length') - 1) {
        this.send('gameOver');
      } else {
        this.incrementProperty('timeRemaining', numPoints * 2);
        this.incrementProperty('levelIndex');
      }

      // Used to give the user feedback about correct guesses. When
      // "lastCorrectGuess" is set to a word, the word-display components can
      // show it in green letters. Soon after, we stop displaying it
      this.set('lastCorrectGuess', challenge.word);
      Ember.run.later(function() {
        this.set('lastCorrectGuess', null);
      }.bind(this), 1000);
      
      // Show the hidden characters for the next word
      this.send('previewHidden');
    },

    // Show the hidden characters briefly, then hide them again
    previewHidden: function() {
      this.set('showHidden', true);
      Ember.run.later(function() {
        this.set('showHidden', false);
      }.bind(this), 2000);
    },

    gameOver: function() {
      this.set('isEndState', true);
      this.stopClock();
      this.incrementProperty('score', _.floor(this.get('timeRemaining') / 2));
    }
  }
});
