# Bachelorarbeit

### Quiz-Anwendung im Kontext gemeinwohlorientierter KI

#### Main component structure:

* App.js -> *App.css*
    * Quiz.jsx -> *Quiz.css*
        * Header.jsx
        * Popup.jsx
            * Start.jsx (later)
            * Feedback.jsx 
            * Goal.jsx (later)
            * Exercise.jsx
                * QuestionExercise.jsx
                * SortingExercise.jsx
                * MatchingExercise.jsx
            * AllQuestions.jsx (later)
            * ? Disclaimer.jsx (later) ?


#### TODOs (roughly ordered by importance):

* [] Sorting.jsx
* [] Matching.jsx
* [] Exercise.jsx: 
    * [] joker behaviour:
        * [] NewQuestions Joker
        * [] Tipp Joker
        * [] NOT clickable after selecting answer
    * [] stop movement when buttons change
* [] Header.jsx:
    * [] progressBar
    * [] correct reset button
* [] Goal.jsx
* [] Start.jsx: 2nd popup (with explanations) or adding them to current popup
* [] Quiz.jsx: 
    * [] reentering after finishing
    * [] what happens when pool empty?
    * [] when finished: resetting used exercises? Starting with not yet used?
* [] Szenario.jsx: correct buttons
* [] AllQuestions.jsx
* [] Quest/Sort/Match: what happens onClick when no answer selected?
