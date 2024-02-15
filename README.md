# Bachelorarbeit

### Quiz-Anwendung im Kontext gemeinwohlorientierter KI

#### Main component structure:

* App.js -> *App.css*
    * Quiz.jsx -> *Quiz.css*
        * Header.jsx
            * ProgressBar.jsx
        * Popup.jsx
            * Start.jsx
            * Feedback.jsx
            * Szenario.jsx
            * Exercise.jsx
                * QuestionExercise.jsx
                * SortingExercise.jsx
                * MatchingExercise.jsx
                    * DropContainer.jsx
                    * Definition.jsx
            * Disclaimer.jsx
                * AllQuestions.jsx


#### TODOs (roughly ordered by importance):

* [x] Sorting.jsx:
    * [x] was answer correct/wrong?
* [x] Matching.jsx
* [x] Matching.jsx: how to show if answer was correct/wrong?
* [x] Quiz.jsx: SVG done (all circles in correct place)
* [x] Exercise.jsx: 
    * [x] joker behaviour:
        * [x] NewQuestions Joker
        * [x] Tipp Joker
        * [x] NOT clickable after selecting answer
        * [x] adding joker amount to Feedback
        * [x] adding Symbol to svg (when joker used)
    * [x] stop movement when buttons change
    * [x] log answer in AS SOON as check clicked (else: cheating possible)
* [x] Joker: adding joker name to button (?)
* [x] Feedback.jsx: repeat section
* [x] Header.jsx:
    * [x] progressBar:
        * [x] when correct: lighter, else: darker
    * [x] correct reset button
    * [x] add Disclaimers for allQuestions / resetting quiz
* [x] Goal (Feedback 3)
* [x] Start.jsx: 2nd popup (with explanations) or adding them to current popup
* [x] adding explanation button? (user can always see explanations again) OR start always clickable?
* [x] Quiz.jsx: 
    * [x] REENTER state (after finishing)
    * [x] what happens when pool empty?
    * [x] reset everything needed when resetting / repeating
* [x] STILL: #correctAnswers sometimes wrong OR colors wrong?
* [x] Szenario.jsx: correct buttons
* [x] AllQuestions.jsx
* [x] Quest/Sort/Match: what happens onClick when no answer selected?

##### to fix

* [x] found coloring error when chosing topic for 2nd time! (but functionality is ok)
* [x] re-enter error after reentering from 2nd topic section
  
##### when finished

* [x] add comments (!!!) where missing
* [x] test on smaller screens (at least laptop)

##### after receiving actual exercises

* [x] change topic names to variables
* [x] filter by topic (not by difficulty)
* [x] any errors?