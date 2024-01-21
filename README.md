# Bachelorarbeit

### Quiz-Anwendung im Kontext gemeinwohlorientierter KI

#### Main component structure:

* App.js -> *App.css*
    * Quiz.jsx -> *Quiz.css*
        * Header.jsx
        * Popup.jsx
            * Start.jsx
            * Feedback.jsx 
            * Goal.jsx
            * Szenario.jsx
            * Exercise.jsx
                * QuestionExercise.jsx
                * SortingExercise.jsx
                * MatchingExercise.jsx
            * AllQuestions.jsx
            * Disclaimer.jsx (later)


#### TODOs (roughly ordered by importance):

* [x] Sorting.jsx:
    * [x] was answer correct/wrong?
* [ ] Matching.jsx
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
* [ ] Header.jsx:
    * [ ] progressBar
    * [x] correct reset button
    * [ ] add Disclaimers for allQuestions / resetting quiz
* [x] Goal (Feedback 3)
* [x] Start.jsx: 2nd popup (with explanations) or adding them to current popup
* [ ] adding explanation button? (user can always see exlanations again) OR start always clickable?
* [x] Quiz.jsx: 
    * [x] REENTER state (after finishing)
    * [x] what happens when pool empty?
    * [x] reset everything needed when resetting / repeating
* [x] STILL: #correctAnswers sometimes wrong OR colors wrong?
* [x] Szenario.jsx: correct buttons
* [ ] AllQuestions.jsx
* [x] Quest/Sort/Match: what happens onClick when no answer selected?
* [ ] change topic names to variables (after receiving actual exercises)
* [ ] add comments where missing

##### laaater (if time)

* [ ] re-clicking on finished circles to see what was answered
* [ ] clean up code / improving & reducing where possible
