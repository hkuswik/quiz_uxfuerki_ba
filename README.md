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
* [ ] Exercise.jsx: 
    * [ ] joker behaviour:
        * [ ] NewQuestions Joker
        * [ ] Tipp Joker
        * [ ] NOT clickable after selecting answer
        * [ ] adding joker amount to Feedback
        * [ ] adding Symbol to svg (when joker used)
    * [ ] stop movement when buttons change
    * [ ] log answer in AS SOON as check clicked (else: cheating possible)
* [ ] Feedback.jsx: repeat section
* [ ] Header.jsx:
    * [ ] progressBar
    * [x] correct reset button
    * [ ] add Disclaimers for allQuestions / resetting quiz
* [ ] Goal.jsx
* [ ] Start.jsx: 2nd popup (with explanations) or adding them to current popup
* [ ] Quiz.jsx: 
    * [ ] reentering after finishing
    * [ ] what happens when pool empty?
    * [ ] when finished: resetting used exercises? Starting with not yet used?
* [ ] Szenario.jsx: correct buttons
* [ ] AllQuestions.jsx
* [x] Quest/Sort/Match: what happens onClick when no answer selected?
* [ ] change topic names to variables (after receiving actual exercises)
* [ ] add comments where missing
