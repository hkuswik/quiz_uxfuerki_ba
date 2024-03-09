# Bachelorarbeit

### Quiz-Anwendung im Kontext gemeinwohlorientierter KI

#### Main component structure:

* App.jsx -> *App.css*
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


#### 2. Iteration (TODOs zur Verbesserung):

* [x] Abschnitt über 'Szenario' neu starten
* [x] Tooltips: Fortschrittsbalken
* [x] Tooltips: Joker
* [x] Anzeigen: wieviele Joker pro Aufgabe?
* [x] Start-Button weg: 1. Popup automatisch
* [x] nach 'Start' automatisch 1. Szenario starten
* [x] nach 'Szenario' automatisch 1. Frage starten
* [x] ?-Button lieber unten links
* [x] Fragen erneut angucken können
* [x] -> dann auch schnelle durchklicken können?
* [x] bei allen Themen starten können (über Szenario-Buttons)
* [x] Ton auch ausstellen können
* [x] Joker etw. kleiner
* [x] mehr Rand (Popup)
* [x] Sorting: Buttons weit weg vom Text
* [x] Matching: Box unten sollte Größe behalten + Größe Begriffe auto (?)
* [x] Szenario wird dunkler am Anfang onHover
* [x] evtl.: "Überprüfen" statt Haken (Popup)

##### for better maintainability and reducing redundancy:

* [x] add React Context (for static variables that are needed often)