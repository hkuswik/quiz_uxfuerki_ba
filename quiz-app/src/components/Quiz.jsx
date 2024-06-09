import '../css/Quiz.css';
import { useState, useEffect } from 'react';
import QuizContext from './QuizContext';
import quizData from '../data/exercises_UX_byTopic.json';
import feedbackImg from '../data/images/feedback.png';
import Header from './Header';
import Popup from './Popup';
import swapIcon from '../data/images/swap.png';
import bulbIcon from '../data/images/bulb.png';

const topics = ['UX Grundlagen', 'UCD Prozess', 'Evaluation'];
const colors = {
    pink: '#D177B3', purple: '#8377D1', turquoise: '#77D1CB',
    correct: '#7AD177', wrong: '#D24141', lightgrey: '#D4D2DD', grey: '#817C9C'
};

// save all circles in a graph-like structure (directed); with their topic, x and y position (in svg) and what circle is reachable
const pathGraph = {
    szenario1: { next: 'circle1', topic: 'szenario1', x: '150', y: '140' },
    circle1: { next: 'circle2', topic: topics[0], x: '305', y: '170' },
    circle2: { next: 'circle3', topic: topics[0], x: '370', y: '270' },
    circle3: { next: 'circle4', topic: topics[0], x: '290', y: '350' },
    circle4: { next: 'circle5', topic: topics[0], x: '170', y: '390' },
    circle5: { next: 'circle6', topic: topics[0], x: '110', y: '500' },
    circle6: { next: 'circle7', topic: topics[0], x: '140', y: '620' },
    circle7: { next: 'circle8', topic: topics[0], x: '250', y: '690' },
    circle8: { next: 'feedback1', topic: topics[0], x: '380', y: '710' },
    feedback1: { next: 'szenario2', topic: 'feedback', x: '496', y: '680' },
    szenario2: { next: 'circle9', topic: 'szenario2', x: '660', y: '680' },
    circle9: { next: 'circle10', topic: topics[1], x: '810', y: '650' },
    circle10: { next: 'circle11', topic: topics[1], x: '890', y: '570' },
    circle11: { next: 'circle12', topic: topics[1], x: '850', y: '460' },
    circle12: { next: 'circle13', topic: topics[1], x: '740', y: '400' },
    circle13: { next: 'circle14', topic: topics[1], x: '640', y: '320' },
    circle14: { next: 'circle15', topic: topics[1], x: '630', y: '200' },
    circle15: { next: 'circle16', topic: topics[1], x: '730', y: '150' },
    circle16: { next: 'feedback2', topic: topics[1], x: '860', y: '140' },
    feedback2: { next: 'szenario3', topic: 'feedback', x: '992', y: '140' },
    szenario3: { next: 'circle17', topic: 'szenario3', x: '1160', y: '150' },
    circle17: { next: 'circle18', topic: topics[2], x: '1310', y: '190' },
    circle18: { next: 'circle19', topic: topics[2], x: '1390', y: '270' },
    circle19: { next: 'circle20', topic: topics[2], x: '1330', y: '370' },
    circle20: { next: 'circle21', topic: topics[2], x: '1210', y: '410' },
    circle21: { next: 'circle22', topic: topics[2], x: '1110', y: '490' },
    circle22: { next: 'circle23', topic: topics[2], x: '1100', y: '620' },
    circle23: { next: 'circle24', topic: topics[2], x: '1190', y: '710' },
    circle24: { next: 'feedback3', topic: topics[2], x: '1310', y: '750' },
    feedback3: { next: 'circle1', topic: 'feedback', x: '1430', y: '769' }
};

// main component that handles quiz state and renders quiz board
const Quiz = () => {
    const [state, setState] = useState('DEFAULT');
    const [hasStarted, setHasStarted] = useState(false);
    const [completedAtLeastOnce, setCompletedAtLeastOnce] = useState(false);

    const [exercises, setExercises] = useState({
        [topics[0]]: [],
        [topics[1]]: [],
        [topics[2]]: [],
    });

    const [showPopup, setShowPopup] = useState(true);
    const [soundOn, setSoundOn] = useState(true);

    const [activeCircle, setActiveCircle] = useState('szenario1'); // which circle is next
    const [lastClicked, setLastClicked] = useState('');
    const [possibleCircles, setPossibleCircles] = useState(['szenario1', 'szenario2', 'szenario3']); // which circles can also be clicked currently
    const [completedCircles, setCompletedCircles] = useState([]);
    const [hoveredCircle, setHoveredCircle] = useState("");
    const [correctCircles, setCorrectCircles] = useState([]); // correctly answered

    const [currentTopic, setCurrentTopic] = useState(topics[0]);
    const [currentContent, setCurrentContent] = useState('start'); // current content for popup
    const [currentExercise, setCurrentExercise] = useState(null); // currently selected exercise

    const [jokerMap, setJokerMap] = useState({}); // which joker was used at which circle
    const [jokerUsed, setJokerUsed] = useState(""); // which type of joker was just used

    // save amount of used joker, completed exercises and correctly completed exercises per topic
    const [jokerInTopic, setJokerInTopic] = useState({ [topics[0]]: 0, [topics[1]]: 0, [topics[2]]: 0 });
    const [doneInTopic, setDoneInTopic] = useState({ [topics[0]]: 0, [topics[1]]: 0, [topics[2]]: 0 });
    const [correctInTopic, setCorrectInTopic] = useState({ [topics[0]]: 0, [topics[1]]: 0, [topics[2]]: 0 });

    const [completedExercises, setCompletedExercises] = useState({});
    const [reviewContent, setReviewContent] = useState(null);

    // save circle names as keys and joker as values to save which were used where
    const initializeJokerMap = () => {
        const circleMap = Object.keys(pathGraph)
            .filter(key => key.includes('circle'))
            .reduce((acc, key) => { // acc = accumulator
                acc[key] = ''
                return acc;
            }, {});
        setJokerMap(circleMap);
    };

    // save circle names as keys and exercise ids as well as user's answers as values
    const initializeCompletedExercises = () => {
        const circleMap = Object.keys(pathGraph)
            .filter(key => key.includes('circle'))
            .reduce((acc, key) => { // acc = accumulator
                acc[key] = { id: null, answers: [] }
                return acc;
            }, {});
        setCompletedExercises(circleMap);
    };

    useEffect(() => {
        const initializeExercises = () => {
            // save exercises according to topic and randomize order for each topic
            const topicExercises = {};
            [topics[0], topics[1], topics[2]].forEach(topic => {
                const currExercises = quizData.filter(q => q.topic === topic);
                shuffleArray(currExercises);
                topicExercises[topic] = currExercises;
            });
            setExercises(topicExercises);
        };

        initializeExercises();
        initializeJokerMap();
        initializeCompletedExercises();
    }, []);

    useEffect(() => {
        console.log("joker: ", jokerUsed);
    }, [jokerUsed]);

    // logic for clicking on a circle
    const handleCircleClick = (circle, isSectionStart = false) => {
        // when its not reenter state or sectionstart, clicking on completed circles opens review popup
        if (completedCircles.includes(circle) && !isSectionStart && state !== 'REENTER') {
            prepareReviewContent(circle);
            return;
        };

        if (!isSectionStart) {
            // if it's not section-start, check if clicked circle is currently possible
            if (!isCircleReachable(circle)) return;
        };
        if (hasStarted === false) setHasStarted(true); // start quiz here if user ignored start popup

        const topic = pathGraph[circle].topic;
        const isExercise = [topics[0], topics[1], topics[2]].includes(topic);
        const szenarioActive = ['szenario1', 'szenario2', 'szenario3'].includes(activeCircle);

        if (isExercise) {
            // check if circle is the same as the last clicked circle
            if (circle !== lastClicked) {
                switch (state) {
                    case 'DEFAULT':
                        setNewExercise(topic); // if it is a new circle, select a new exercise
                        break;
                    case 'REENTER':
                        // check which topic was selected and save as new current topic; select exercise of this topic
                        setCurrentTopic(topic);
                        setNewExercise(topic);
                        handleTopicRepeat(topic);
                        // remove REENTER-circles from possible circles
                        setPossibleCircles(possibleCircles.filter((circle) => !circle.includes('circle')));
                        setState('DEFAULT');
                        break;
                    default:
                        console.log('some state error in handleCircleClick');
                }
                setLastClicked(circle); // circle is now last clicked circle
            }
            else {
                setCurrentContent(currentExercise); // if circle was just clicked again, show current content again
            }
        } else {
            // save type of non-exercise circle to choose correct popup
            setCurrentContent(topic);
            // don't update lastClicked if szenario is clicked without being active
            if (topic.startsWith('szenario') && !szenarioActive) {
                setShowPopup(true);
                return;
            }
            setLastClicked(circle);
        }
        setShowPopup(true);
    };

    // helper function: check if circle is reachable
    const isCircleReachable = (circle) => {
        return circle === activeCircle || possibleCircles.includes(circle);
    };

    // helper function: set review content
    const prepareReviewContent = (circle) => {
        // search for exercise completed at this circle by using stored exercise id
        const exercise = quizData.find(exercise => exercise.id === completedExercises[circle].id);
        const answer = completedExercises[circle].answers;
        setReviewContent({ exercise: exercise, answer: answer, circle: circle });
        setCurrentContent('review');
        setShowPopup(true);
    };

    // sets a new exercise from given topic
    const setNewExercise = (topic) => {
        // which topic pool to choose exercises from
        const currentTopicExercises = exercises[topic];

        if (currentTopicExercises.length > 0) {
            // if there are still exercises left, get a new exercise 
            getExercise(currentTopicExercises, topic);
        } else {
            console.log('reshuffled exercise pool of topic: ', topic);
            // reshuffle exercise pool for exhausted topic
            const newExercisePool = quizData.filter((exercise) => exercise.topic === topic);
            shuffleArray(newExercisePool);
            // get new exercise from reshuffled pool
            getExercise(newExercisePool, topic);
        };
    };

    // pops last exercise of array and saves updated exercise pool
    const getExercise = (exercises, topic) => {
        // choose last exercise of array and delete it
        const selected = exercises.pop();
        // save which exercise is currently used
        setCurrentExercise(selected);
        setCurrentContent(selected);
        // update the changed exercises array in state, according to topic
        setExercises(currentExercises => ({ ...currentExercises, [topic]: exercises }));
    };

    // logic when a joker is clicked
    const handleJoker = (joker) => {
        // update all relevant states with used joker
        setJokerUsed(joker);
        setJokerMap({ ...jokerMap, [activeCircle]: joker });
        setJokerInTopic(prevJokerInTopic => ({
            ...prevJokerInTopic,
            [currentTopic]: prevJokerInTopic[currentTopic] + 1,
        }));
        // set new exercise for 'swap' joker
        if (joker === 'swap') setNewExercise(currentTopic);
    };

    // updating state and board after exercise answer has been locked in
    const handleAnswer = (isCorrect, usersAnswers) => {
        // add circle to correctCircles if answer was correct & update correctInTopic
        if (isCorrect) {
            setCorrectCircles(correctCircles => [...correctCircles, lastClicked]);
            setCorrectInTopic(prevCorrectInTopic => ({
                ...prevCorrectInTopic,
                [currentTopic]: prevCorrectInTopic[currentTopic] + 1,
            }));
        };
        // make next circle active
        setActiveCircle(pathGraph[lastClicked].next);
        // update completed circles, completed exercises and doneInTopic
        setCompletedCircles(completedCircles => [...completedCircles, lastClicked]);
        setDoneInTopic(prevDoneInTopic => ({
            ...prevDoneInTopic,
            [currentTopic]: prevDoneInTopic[currentTopic] + 1,
        }));
        setCompletedExercises(prevComplEx => ({
            ...prevComplEx,
            [lastClicked]: { id: currentExercise.id, answers: usersAnswers } // save id of completed exercise
        }));
        // make joker available again for new exercise
        setJokerUsed("");
        // check if quiz has been completed at least once
        setCompletedAtLeastOnce(isQuizFinished());
    };

    // helper function: checks if quiz is finished
    const isQuizFinished = () => {
        let isFinished = false;
        switch (activeCircle) {
            case 'circle8':
                if (doneInTopic[topics[1]] === 8 && doneInTopic[topics[2]] === 8) isFinished = true;
                break;
            case 'circle16':
                if (doneInTopic[topics[0]] === 8 && doneInTopic[topics[2]] === 8) isFinished = true;
                break;
            case 'circle24':
                if (doneInTopic[topics[0]] === 8 && doneInTopic[topics[1]] === 8) isFinished = true;
                break;
            default:
                return isFinished;
        }
        return isFinished;
    };

    // updating board when user clicks update-button on popup
    const handleUpdate = (szenario = null, szenarioTopic) => {
        // start 1st szenario automatically after quiz start
        if (hasStarted === false) {
            setHasStarted(true);
            handleCircleClick('szenario1');
            return;
        };

        // if update was called via szneario, new topic starts
        if (szenario !== null) {
            // reset status of started topic
            handleTopicRepeat(szenarioTopic);
            // directly render 1st exercise if update was called via 'szenario'
            handleCircleClick(pathGraph[szenario].next, true);
            return;
        };

        // check what type of circle was clicked
        const topic = pathGraph[lastClicked].topic;
        const isExercise = (topic === topics[0] || topic === topics[1] || topic === topics[2]);

        if (!isExercise) { // if exercise, board has already been updated
            // update completed circles (if circle isn't already in it)
            !completedCircles.includes(lastClicked) && setCompletedCircles(completedCircles => [...completedCircles, lastClicked]);
        };

        if (topic === 'feedback') {
            if (completedAtLeastOnce || currentTopic === topics[2]) {
                setState('REENTER');
                // add 1st circle of each topic to possible (can now start any topic)
                setPossibleCircles(possibleCircles => [...possibleCircles, ...['circle1', 'circle9', 'circle17']]);
            } else {
                handleCircleClick(pathGraph[lastClicked].next, true); // automatically render next szenario
                setActiveCircle(pathGraph[pathGraph[lastClicked].next].next); // 1st circle of new topic will be active
                setCurrentTopic(currentTopic === topics[0] ? topics[1] : topics[2]); // next topic
                return;
            }
        };

        setShowPopup(false);
    };

    // resets all relevant information for given topic
    const handleTopicRepeat = (repeatTopic) => {
        // if repeat is clicked after quiz was completed at least once, reset possible circles to only szenarios
        if (completedAtLeastOnce) setPossibleCircles(possibleCircles.filter(circle => pathGraph[circle].topic.includes('szenario')));

        // repeated topic is now current topic
        setCurrentTopic(repeatTopic);

        // reset topic state for repeated topic
        setCorrectInTopic(prevCorrectInTopic => ({ ...prevCorrectInTopic, [repeatTopic]: 0, }));
        setJokerInTopic(prevJokerInTopic => ({ ...prevJokerInTopic, [repeatTopic]: 0, }));
        setDoneInTopic(prevDoneInTopic => ({ ...prevDoneInTopic, [repeatTopic]: 0, }));

        // set active circle to first circle of repeated topic
        const initialCircle = `circle${repeatTopic === topics[0] ? '1' : repeatTopic === topics[1] ? '9' : '17'}`;
        setActiveCircle(initialCircle);

        // reset completed/correct circles by deleting repeated topic's circles
        setCompletedCircles(completedCircles.filter(circle => pathGraph[circle].topic !== repeatTopic));
        setCorrectCircles(correctCircles.filter(circle => pathGraph[circle].topic !== repeatTopic));

        // update completed exercises by removing entries of circles that belong to repeated topic
        const updatedCompletedExercises = Object.fromEntries(Object.entries(completedExercises).map(([circle, value]) => {
            // look at number of circle (subsstring that comes after 'e') to reset depending on topic
            return (parseInt(circle.substring(circle.indexOf('e') + 1)) >= (getTopicNumber(repeatTopic) - 1) * 8 + 1 &&
                parseInt(circle.substring(circle.indexOf('e') + 1)) <= getTopicNumber(repeatTopic) * 8)
                ? [circle, { id: null, answers: [] }] // if number is between first and last circle of topic, reset value
                : [circle, value]; // else, keep value from before (don't reset)
        }));
        setCompletedExercises(updatedCompletedExercises);
        setReviewContent(null);

        // update joker map by removing jokers of repeated topic
        const updatedJokerMap = Object.fromEntries(Object.entries(jokerMap).map(([circle, value]) => {
            // look at number of circle (subsstring that comes after 'e') to reset joker depending on topic
            return (parseInt(circle.substring(circle.indexOf('e') + 1)) >= (getTopicNumber(repeatTopic) - 1) * 8 + 1 &&
                parseInt(circle.substring(circle.indexOf('e') + 1)) <= getTopicNumber(repeatTopic) * 8)
                ? [circle, ''] // if number is between first and last circle of topic, reset value (empty string)
                : [circle, value]; // else, keep value from before (don't reset)
        }));
        setJokerMap(updatedJokerMap);
        setJokerUsed("");

        // close popup automatically if topic repeat was triggered by feedback popup
        if (pathGraph[lastClicked].topic === 'feedback') setShowPopup(false);
    };

    // helper function: get topic number
    const getTopicNumber = (topic) => {
        switch (topic) {
            case topics[0]:
                return 1;
            case topics[1]:
                return 2;
            case topics[2]:
                return 3;
            default:
                console.log('error in getTopicNumber');
                return 0;
        };
    };

    // switch sound on/off (globally) if sound button is clicked in Popup component
    const handleSoundClick = () => { setSoundOn(prevSoundOn => !prevSoundOn); };

    // opening help popup when help button is clicked
    const handleHelpClick = () => {
        setCurrentContent('help');
        setShowPopup(true);
    };

    // enable clicking through already completed (review) content
    const handleReviewClick = (direction) => {
        const currCircle = reviewContent.circle;
        // save circle before/after current circle by using number in circle name
        const numberCircle = parseInt(currCircle.substring(currCircle.indexOf('e') + 1));
        // can't go left if circle is first or right if circle is last circle
        if (numberCircle === (direction === 'left' ? 1 : 24)) return;
        // save new circle
        const newNumber = (direction === 'left') ? numberCircle - 1 : numberCircle + 1;
        const circleNext = `circle${newNumber}`;
        // render new content if next circle was already completed as well
        if (completedExercises[circleNext].id !== null) {
            prepareReviewContent(circleNext);
        };
    };

    // resets everything back to start state
    const handleReset = () => {
        setCompletedCircles([]);
        setPossibleCircles(['szenario1', 'szenario2', 'szenario3']);
        setCompletedAtLeastOnce(false);
        setCurrentTopic(topics[0]);
        setActiveCircle('szenario1');
        setCorrectCircles([]);
        setCorrectInTopic({ [topics[0]]: 0, [topics[1]]: 0, [topics[2]]: 0 });
        setJokerInTopic({ [topics[0]]: 0, [topics[1]]: 0, [topics[2]]: 0 });
        setJokerUsed("");
        setDoneInTopic({ [topics[0]]: 0, [topics[1]]: 0, [topics[2]]: 0 });
        Object.keys(jokerMap).forEach((circle) => {
            jokerMap[circle] = '';
        });
        Object.keys(completedExercises).forEach((circle) => {
            completedExercises[circle] = { id: null, answers: [] };
        });
        setReviewContent(null);
    };

    // renders board with all circles, icons and text elements
    const renderBoard = () => {
        const circleColors = {
            [topics[0]]: colors.pink, [topics[1]]: colors.purple, [topics[2]]: colors.turquoise,
            szenario1: colors.pink, szenario2: colors.purple, szenario3: colors.turquoise, feedback: colors.grey
        };
        const circleTexts = { szenario1: [topics[0]], szenario2: [topics[1]], szenario3: [topics[2]] };

        const handleCircleHover = (circle) => { setHoveredCircle(circle); };
        const handleCircleLeave = () => { setHoveredCircle(""); };

        const circles = Object.keys(pathGraph);

        return circles.map((circle) => {
            const isReachable = isCircleReachable(circle);
            const isCompleted = completedCircles.includes(circle);
            const isHovered = circle === hoveredCircle;
            const wasCorrect = correctCircles.includes(circle);

            const topic = pathGraph[circle].topic;
            const isExerciseOrSzenario = topic !== 'start' && topic !== 'feedback';
            const isSzenario = topic === 'szenario1' || topic === 'szenario2' || topic === 'szenario3';
            const isExercise = isExerciseOrSzenario && !isSzenario;
            const isFeedback = topic === 'feedback';

            const color = circleColors[topic];
            const text = circleTexts[topic];

            const joker = jokerMap[circle];

            return (
                <g key={circle} onClick={() => handleCircleClick(circle)}
                    onMouseOver={() => handleCircleHover(circle)} onMouseLeave={handleCircleLeave}
                >
                    <ellipse
                        cx={pathGraph[circle].x}
                        cy={pathGraph[circle].y}
                        rx={isSzenario ? '80' : '35'}
                        ry={isSzenario ? '55' : '35'}
                        fill={isExerciseOrSzenario
                            ? isExercise
                                ? isReachable
                                    ? '#21202B'
                                    : isCompleted
                                        ? color
                                        : '#21202B'
                                : color
                            : '#21202B'}
                        stroke={isReachable ? 'white' : color}
                        className={`${(isReachable && isHovered) ? 'circle-active-hover' : ''} ${(isSzenario && isHovered) ? 'opacity-80' : ''}`}
                        strokeWidth='2px'
                        strokeDasharray={isSzenario
                            ? 'none'
                            : isReachable
                                ? '6'
                                : isCompleted
                                    ? 'none'
                                    : '6'}
                        style={{
                            ...({ cursor: isExercise ? (isCompleted || isReachable) ? 'pointer' : 'default' : isReachable ? 'pointer' : 'default' }),
                            ...(isExercise
                                ? isReachable
                                    ? { opacity: '100%' }
                                    : isCompleted
                                        ? isHovered
                                            ? { opacity: wasCorrect ? '75%' : '20%' }
                                            : { opacity: wasCorrect ? '100%' : '30%' }
                                        : {}
                                : {})
                        }}
                    />
                    <text
                        x={pathGraph[circle].x}
                        y={pathGraph[circle].y}
                        dy="5px"
                        textAnchor="middle" // text horizontally
                        fill="white"
                        fontWeight='400'
                        style={{ cursor: isReachable ? 'pointer' : 'default' }}
                    >
                        {text}
                    </text>
                    {isSzenario &&
                        <text
                            x={pathGraph[circle].x}
                            y={pathGraph[circle].y}
                            textAnchor="middle"
                            dy='-20px'
                            fill='white'
                            className='sm'
                            style={{ cursor: isReachable ? 'pointer' : 'default' }}
                        >
                            Szenario:
                        </text>
                    }
                    {isFeedback &&
                        <image
                            x={pathGraph[circle].x - 50}
                            y={pathGraph[circle].y - 90}
                            href={feedbackImg}
                            height='100'
                            style={{ cursor: isReachable ? 'pointer' : 'default' }}
                        />
                    }
                    {(joker === 'tip' || joker === 'swap') &&
                        <image
                            x={pathGraph[circle].x - (joker === 'tip' ? 30 : 24)}
                            y={pathGraph[circle].y - (joker === 'tip' ? 29 : 22)}
                            href={joker === 'tip' ? bulbIcon : swapIcon}
                            height={joker === 'tip' ? 60 : 45}
                            className='cursor-pointer'
                        />
                    }
                </g>
            );
        });
    };

    return (
        <QuizContext.Provider value={{ topics, colors }}>
            <div className='Quiz'>
                <Header onReset={handleReset} doneInTopic={doneInTopic} correctInTopic={correctInTopic}></Header>
                <div className='svg-container'>
                    <svg id='board' viewBox="0 0 1470 820">
                        <text x={248} y={50} textAnchor="middle" fill={colors.pink} className='h3'>{topics[0]}</text>
                        <text x={744} y={50} textAnchor="middle" fill={colors.purple} className='h3'>{topics[1]}</text>
                        <text x={1240} y={50} textAnchor="middle" fill={colors.turquoise} className='h3'>{topics[2]}</text>
                        <line x1={496} y1={0} x2={496} y2={1000} style={{ stroke: '#2D2C36', strokeWidth: '5px' }} />
                        <line x1={992} y1={0} x2={992} y2={1000} style={{ stroke: '#2D2C36', strokeWidth: '5px' }} />
                        {renderBoard()}
                    </svg>
                </div>
                <div onClick={() => handleHelpClick()} className='help-btn hover:opacity-80'>
                    <h2 className='cursor-pointer'>?</h2>
                </div>
                {showPopup &&
                    <Popup
                        onClose={() => setShowPopup(false)}
                        content={currentContent}
                        active={activeCircle}
                        currentTopic={currentTopic}
                        onAnswer={handleAnswer}
                        onUpdate={handleUpdate}
                        onJoker={handleJoker}
                        onRepeat={handleTopicRepeat}
                        jokerUsed={jokerUsed}
                        correctAmount={correctInTopic[currentTopic]}
                        jokerAmount={jokerInTopic[currentTopic]}
                        completedAtLeastOnce={completedAtLeastOnce}
                        soundOn={soundOn}
                        onSoundClick={handleSoundClick}
                        reviewContent={reviewContent}
                        onReviewClick={handleReviewClick}
                    />
                }
            </div>
        </QuizContext.Provider>
    );
};

// helper function: shuffles array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

export default Quiz;