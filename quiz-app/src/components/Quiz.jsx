import '../css/Quiz.css';
import { useState, useEffect } from 'react';
import quizData from '../data/exercises_UX_byTopic.json';
import feedbackImg from '../data/images/feedback.png';
import goalImg from '../data/images/feedback_ende.png';
import Header from './Header';
import Popup from './Popup';
import swapIcon from '../data/images/swap.png';
import bulbIcon from '../data/images/bulb.png';

const topic1 = 'UX Grundlagen';
const topic2 = 'UCD Prozess';
const topic3 = 'Evaluation';

// save all circles in a graph-like structure (directed); with their topic, x and y position (in svg) and what circle is reachable
const pathGraph = {
    start: { next: 'szenario1', topic: 'start', x: '40', y: '140' },
    szenario1: { next: 'circle1', topic: 'szenario1', x: '200', y: '135' },
    circle1: { next: 'circle2', topic: topic1, x: '345', y: '180' },
    circle2: { next: 'circle3', topic: topic1, x: '390', y: '280' },
    circle3: { next: 'circle4', topic: topic1, x: '290', y: '350' },
    circle4: { next: 'circle5', topic: topic1, x: '170', y: '390' },
    circle5: { next: 'circle6', topic: topic1, x: '110', y: '500' },
    circle6: { next: 'circle7', topic: topic1, x: '140', y: '620' },
    circle7: { next: 'circle8', topic: topic1, x: '250', y: '690' },
    circle8: { next: 'feedback1', topic: topic1, x: '380', y: '710' },
    feedback1: { next: 'szenario2', topic: 'feedback', x: '496', y: '680' },
    szenario2: { next: 'circle9', topic: 'szenario2', x: '660', y: '680' },
    circle9: { next: 'circle10', topic: topic2, x: '810', y: '650' },
    circle10: { next: 'circle11', topic: topic2, x: '890', y: '570' },
    circle11: { next: 'circle12', topic: topic2, x: '850', y: '460' },
    circle12: { next: 'circle13', topic: topic2, x: '740', y: '400' },
    circle13: { next: 'circle14', topic: topic2, x: '640', y: '320' },
    circle14: { next: 'circle15', topic: topic2, x: '630', y: '200' },
    circle15: { next: 'circle16', topic: topic2, x: '730', y: '150' },
    circle16: { next: 'feedback2', topic: topic2, x: '860', y: '140' },
    feedback2: { next: 'szenario3', topic: 'feedback', x: '992', y: '140' },
    szenario3: { next: 'circle17', topic: 'szenario3', x: '1160', y: '150' },
    circle17: { next: 'circle18', topic: topic3, x: '1310', y: '190' },
    circle18: { next: 'circle19', topic: topic3, x: '1390', y: '270' },
    circle19: { next: 'circle20', topic: topic3, x: '1330', y: '370' },
    circle20: { next: 'circle21', topic: topic3, x: '1210', y: '410' },
    circle21: { next: 'circle22', topic: topic3, x: '1110', y: '490' },
    circle22: { next: 'circle23', topic: topic3, x: '1100', y: '620' },
    circle23: { next: 'circle24', topic: topic3, x: '1190', y: '710' },
    circle24: { next: 'feedback3', topic: topic3, x: '1310', y: '750' },
    feedback3: { next: 'circle1', topic: 'feedback', x: '1430', y: '769' }
};

// main component that handles quiz state and renders quiz board
const Quiz = () => {
    const [state, setState] = useState('DEFAULT');
    const [completedAtLeastOnce, setCompletedAtLeastOnce] = useState(false);

    const [exercises, setExercises] = useState({
        [topic1]: [],
        [topic2]: [],
        [topic3]: [],
    });

    const [showPopup, setShowPopup] = useState(false);

    const [activeCircle, setActiveCircle] = useState('start'); // which circle is next
    const [lastClicked, setLastClicked] = useState('start');
    const [possibleCircles, setPossibleCircles] = useState([]); // which circles can also be clicked currently
    const [completedCircles, setCompletedCircles] = useState([]);
    const [hoveredCircle, setHoveredCircle] = useState(null);
    const [correctCircles, setCorrectCircles] = useState([]); // correctly answered

    const [currentTopic, setCurrentTopic] = useState(topic1);
    const [szenariosDone, setSzenariosDone] = useState(0);
    const [currentContent, setCurrentContent] = useState(null); // current content for popup
    const [currentExercise, setCurrentExercise] = useState(null); // currently selected exercise

    const [jokerUsed, setJokerUsed] = useState(null); // which type of joker was just used
    const [jokerMap, setJokerMap] = useState(new Map()); // which joker was used at which circle

    const [jokerInTopic, setJokerInTopic] = useState({ [topic1]: 0, [topic2]: 0, [topic3]: 0 });
    const [doneInTopic, setDoneInTopic] = useState({ [topic1]: 0, [topic2]: 0, [topic3]: 0 });
    const [correctInTopic, setCorrectInTopic] = useState({ [topic1]: 0, [topic2]: 0, [topic3]: 0 });

    // save circle names in Map (as keys) to save where joker were used (as values)
    const initializeJokerMap = () => {
        const circleMap = Object.keys(pathGraph)
            .filter(key => key.includes('circle'))
            .reduce((acc, key) => { // acc = accumulator
                acc[key] = ''
                return acc;
            }, {});
        setJokerMap(circleMap);
    };

    useEffect(() => {
        const initializeExercises = () => {
            // save exercises according to topic and randomize order for each topic
            const topicExercises = {};
            [topic1, topic2, topic3].forEach(topic => {
                const currExercises = quizData.filter(q => q.topic === topic);
                shuffleArray(currExercises);
                topicExercises[topic] = currExercises;
            });
            setExercises(topicExercises);
        };

        initializeExercises();
        initializeJokerMap();
    }, []);

    // logic for clicking on a circle
    const handleCircleClick = (circle) => {
        // check if clicked circle is currently possible
        if (!isCircleReachable(circle)) return;

        const topic = pathGraph[circle].topic;
        const isExercise = [topic1, topic2, topic3].includes(topic);
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

    // sets a new exercise from given topic
    const setNewExercise = (topic) => {
        // which topic pool to choose exercises from
        const currentTopicExercises = exercises[topic];

        if (currentTopicExercises.length > 0) {
            // if there are still exercises left, get a new exercise 
            getExercise(currentTopicExercises, topic);
        } else {
            console.log('reset exercise pool of topic: ', topic);
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
    const handleAnswer = (isCorrect) => {
        // add circle to correctCircles if answer was correct & update correctInTopic
        if (isCorrect) {
            setCorrectCircles(correctCircles => [...correctCircles, lastClicked]);
            setCorrectInTopic(prevCorrectInTopic => ({
                ...prevCorrectInTopic,
                [currentTopic]: prevCorrectInTopic[currentTopic] + 1,
            }));
        }
        // make next circle active
        setActiveCircle(pathGraph[lastClicked].next);
        // update completed circles and doneInTopic
        setCompletedCircles(completedCircles => [...completedCircles, lastClicked]);
        setDoneInTopic(prevDoneInTopic => ({
            ...prevDoneInTopic,
            [currentTopic]: prevDoneInTopic[currentTopic] + 1,
        }))
        // make joker available again for new exercise
        setJokerUsed(null);
        // if it was last answer, quiz has been completed at least once
        if (lastClicked === 'circle24') setCompletedAtLeastOnce(true);
    };

    // updating board when user closes popup
    const handleUpdate = () => {
        // check what type of circle was clicked
        const topic = pathGraph[lastClicked].topic;
        const isExercise = (topic === topic1 || topic === topic2 || topic === topic3);

        // execute behaviour depending on what type of circle (if exercise, board has already been updated)
        if (!isExercise) {
            if (topic === 'feedback') {
                if (completedAtLeastOnce) {
                    setState('REENTER');
                    setPossibleCircles(possibleCircles => [...possibleCircles, ...['circle1', 'circle9', 'circle17']]);
                } else if (currentTopic === topic3) {
                    setState('REENTER');
                    setPossibleCircles(possibleCircles => [...possibleCircles, ...['circle1', 'circle9', 'circle17']]);
                } else {
                    setActiveCircle(pathGraph[lastClicked].next);
                    setCurrentTopic(currentTopic === topic1 ? topic2 : topic3);
                }
            } else if (topic.includes('szenario')) {
                setSzenariosDone(szenariosDone + 1);
                setActiveCircle(pathGraph[lastClicked].next);
                !(possibleCircles.includes(lastClicked)) && setPossibleCircles(possibleCircles => [...possibleCircles, lastClicked]);
            } else { //start
                setActiveCircle(pathGraph[lastClicked].next);
            }
            // update completed circles
            setCompletedCircles(completedCircles => [...completedCircles, lastClicked]);
        }
        setShowPopup(false);
    };

    // resets all relevant information for given topic
    const handleTopicRepeat = (repeatTopic) => {
        // if repeat is clicked after quiz was completed at least once, reset possible circles to only szenarios
        if (completedAtLeastOnce) setPossibleCircles(possibleCircles.filter(circle => pathGraph[circle].topic.includes('szenario')));

        // reset topic state for repeated topic
        setCorrectInTopic(prevCorrectInTopic => ({ ...prevCorrectInTopic, [repeatTopic]: 0, }));
        setJokerInTopic(prevJokerInTopic => ({ ...prevJokerInTopic, [repeatTopic]: 0, }));
        setDoneInTopic(prevDoneInTopic => ({ ...prevDoneInTopic, [repeatTopic]: 0, }));

        // set active circle to first circle of repeated topic
        const initialCircle = `circle${repeatTopic === topic1 ? '1' : repeatTopic === topic2 ? '9' : '17'}`;
        setActiveCircle(initialCircle);

        // reset completed/correct circles by deleting repeated topic's circles
        setCompletedCircles(completedCircles.filter(circle => pathGraph[circle].topic !== repeatTopic));
        setCorrectCircles(correctCircles.filter(circle => pathGraph[circle].topic !== repeatTopic));

        const updatedJokerMap = Object.fromEntries(Object.entries(jokerMap).map(([circle, value]) => {
            // look at number of circle (subsstring that comes after 'e') to reset joker depending on topic
            return (parseInt(circle.substring(circle.indexOf('e') + 1)) >= (getTopicNumber(repeatTopic) - 1) * 8 + 1 &&
                parseInt(circle.substring(circle.indexOf('e') + 1)) <= getTopicNumber(repeatTopic) * 8)
                ? [circle, ''] // if number is between first and last circle of topic, reset value (empty string)
                : [circle, value]; // else, keep value from before (don't reset)
        }));
        setJokerMap(updatedJokerMap);

        // close popup automatically if topic repeat was triggered by feedback popup
        if (pathGraph[lastClicked].topic === 'feedback') setShowPopup(false);
    };

    // helper function: get topic number
    const getTopicNumber = (topic) => {
        switch (topic) {
            case topic1:
                return 1;
            case topic2:
                return 2;
            case topic3:
                return 3;
            default:
                console.log('error in getTopicNumber');
                return 0;
        };
    };

    // resets everything back to start state
    const handleReset = () => {
        setCompletedCircles([]);
        setPossibleCircles([]);
        setCompletedAtLeastOnce(false);
        setSzenariosDone(0);
        setCurrentTopic(topic1);
        setActiveCircle('start');
        setCorrectCircles([]);
        setCorrectInTopic({ [topic1]: 0, [topic2]: 0, [topic3]: 0 });
        setJokerInTopic({ [topic1]: 0, [topic2]: 0, [topic3]: 0 });
        setDoneInTopic({ [topic1]: 0, [topic2]: 0, [topic3]: 0 });
        Object.keys(jokerMap).forEach((circle) => {
            jokerMap[circle] = '';
        });
    };

    // renders board with all circles, icons and text elements
    const renderBoard = () => {
        const circleColors = {
            [topic1]: '#D177B3', [topic2]: '#8377D1', [topic3]: '#77D1CB',
            szenario1: '#D177B3', szenario2: '#8377D1', szenario3: '#77D1CB',
            start: '#817C9C', feedback: '#817C9C'
        };
        const circleTexts = { szenario1: [topic1], szenario2: [topic2], szenario3: [topic3], start: 'Start' };

        const handleCircleHover = (circle) => {
            setHoveredCircle(circle);
        };
        const handleCircleLeave = () => {
            setHoveredCircle(null);
        };

        const circles = Object.keys(pathGraph);

        return circles.map((circle) => {
            const isReachable = isCircleReachable(circle);
            const isCompleted = completedCircles.includes(circle);
            const isReachableHovered = isReachable && circle === hoveredCircle;
            const wasCorrect = correctCircles.includes(circle);

            const topic = pathGraph[circle].topic;
            const isExerciseOrSzenario = topic !== 'start' && topic !== 'feedback';
            const isSzenario = topic === 'szenario1' || topic === 'szenario2' || topic === 'szenario3';
            const isExercise = isExerciseOrSzenario && !isSzenario;
            const isFeedback = topic === 'feedback' && circle !== 'feedback3';
            const isGoal = circle === 'feedback3';

            const isSzenarioHovered = isSzenario && circle === hoveredCircle;
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
                                : isCompleted
                                    ? color
                                    : '#21202B'
                            : '#21202B'}
                        stroke={isReachable ? 'white' : color}
                        className={`${isReachableHovered ? 'circle-active-hover' : ''} ${isSzenarioHovered ? 'opacity-80' : ''}`}
                        strokeWidth='2px'
                        strokeDasharray={isSzenario
                            ? isCompleted
                                ? 'none'
                                : '6'
                            : isReachable
                                ? '6'
                                : isCompleted
                                    ? 'none'
                                    : '6'}
                        style={{
                            ...({ cursor: isReachable ? 'pointer' : 'default' }),
                            ...(isExercise
                                ? isReachable
                                    ? { opacity: '100%' }
                                    : isCompleted
                                        ? { opacity: wasCorrect ? '100%' : '30%' }
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
                    {isGoal &&
                        <image
                            x={pathGraph[circle].x - 48}
                            y={pathGraph[circle].y - 109}
                            href={goalImg}
                            height='120'
                            style={{ cursor: isReachable ? 'pointer' : 'default' }}
                        />
                    }
                    {(joker === 'tip' || joker === 'swap') &&
                        <image
                            x={pathGraph[circle].x - (joker === 'tip' ? 30 : 24)}
                            y={pathGraph[circle].y - (joker === 'tip' ? 29 : 22)}
                            href={joker === 'tip' ? bulbIcon : swapIcon}
                            height={joker === 'tip' ? 60 : 45}
                        />
                    }
                </g>
            );
        });
    };

    return (
        <div className='Quiz'>
            <Header onReset={handleReset} doneInTopic={doneInTopic} correctInTopic={correctInTopic}></Header>
            <div className='svg-container'>
                <svg id='board' viewBox="0 0 1470 820">
                    <text x={248} y={50} textAnchor="middle" fill='#D177B3' className='h3'>{topic1}</text>
                    <text x={744} y={50} textAnchor="middle" fill='#8377D1' className='h3'>{topic2}</text>
                    <text x={1240} y={50} textAnchor="middle" fill='#77D1CB' className='h3'>{topic3}</text>
                    <line x1={496} y1={0} x2={496} y2={1000} style={{ stroke: '#2D2C36', strokeWidth: '5px' }} />
                    <line x1={992} y1={0} x2={992} y2={1000} style={{ stroke: '#2D2C36', strokeWidth: '5px' }} />
                    {renderBoard()}
                </svg>
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
                    onRepeat={() => handleTopicRepeat(currentTopic)}
                    jokerUsed={jokerUsed}
                    correctAmount={correctInTopic[currentTopic]}
                    jokerAmount={jokerInTopic[currentTopic]}
                    completedAtLeastOnce={completedAtLeastOnce}
                />
            }
        </div>
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