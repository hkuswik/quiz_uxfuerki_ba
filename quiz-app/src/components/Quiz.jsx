import '../css/Quiz.css';
import { useState, useEffect } from 'react';
import quizData from '../data/questions_onlyMatch.json';
import feedbackImg from '../data/images/feedback.png';
import goalImg from '../data/images/feedback_ende.png';
import Header from './Header';
import Popup from './Popup';
import swapIcon from '../data/images/swap.png';
import bulbIcon from '../data/images/bulb.png';

const topic1 = 'easy';
const topic2 = 'medium';
const topic3 = 'hard';

const pathGraph = {
    start: { next: 'szenario1', topic: 'start', x: '60', y: '140' },
    szenario1: { next: 'circle1', topic: 'szenario1', x: '210', y: '135' },
    circle1: { next: 'circle2', topic: topic1, x: '350', y: '180' },
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

const Quiz = () => {
    const [state, setState] = useState('DEFAULT');
    const [completedAtLeastOnce, setCompletedAtLeastOnce] = useState(false);

    const [exercisesTopic1, setExercisesTopic1] = useState([]);
    const [exercisesTopic2, setExercisesTopic2] = useState([]);
    const [exercisesTopic3, setExercisesTopic3] = useState([]);

    const [showPopup, setShowPopup] = useState(false);

    const [activeCircle, setActiveCircle] = useState('start');
    const [lastClicked, setLastClicked] = useState('start');
    const [possibleCircles, setPossibleCircles] = useState([]);
    const [completedCircles, setCompletedCircles] = useState([]);
    const [hoveredCircle, setHoveredCircle] = useState(null);
    const [correctCircles, setCorrectCircles] = useState([]);

    const [currentTopic, setCurrentTopic] = useState(1);
    const [szenariosDone, setSzenariosDone] = useState(0);
    const [currentContent, setCurrentContent] = useState(null);
    const [currentExercise, setCurrentExercise] = useState(null);

    const [jokerUsed, setJokerUsed] = useState(null); // which type of joker was just used
    const [jokerMap, setJokerMap] = useState(new Map()); // which joker was used at which circle

    const [jokerInTopic, setJokerInTopic] = useState({ 1: 0, 2: 0, 3: 0 });
    const [correctInTopic, setCorrectInTopic] = useState({ 1: 0, 2: 0, 3: 0 });
    const [doneInTopic, setDoneInTopic] = useState({ 1: 0, 2: 0, 3: 0 });

    useEffect(() => {
        // save questions according to topic
        const firstTopic = quizData.filter((q) => q.difficulty === topic1);
        const secondTopic = quizData.filter((q) => q.difficulty === topic2);
        const thirdTopic = quizData.filter((q) => q.difficulty === topic3);

        // randomize the order
        shuffleArray(firstTopic);
        shuffleArray(secondTopic);
        shuffleArray(thirdTopic);

        setExercisesTopic1(firstTopic);
        setExercisesTopic2(secondTopic);
        setExercisesTopic3(thirdTopic);

        // save circle names in Map (as keys) to save where joker were used (values)
        const circleMap = Object.keys(pathGraph)
            .filter(key => key.includes('circle'))
            .reduce((acc, key) => { // acc = accumulator
                acc[key] = ''
                return acc;
            }, {});
        setJokerMap(circleMap);
    }, []);

    const handleCircleClick = (circle) => {
        console.log('circle clicked: ', circle);
        console.log('active: ', activeCircle);

        // check if clicked circle is currently possible
        if (!isCircleReachable(circle)) {
            return;
        }

        const topic = pathGraph[circle].topic;
        const isExercise = (topic === topic1 || topic === topic2 || topic === topic3);
        const szenarioActive = (activeCircle === 'szenario1' || activeCircle === 'szenario2' || activeCircle === 'szenario3');

        if (isExercise) {
            // check if circle is the same as the last clicked circle
            if (circle !== lastClicked) {
                switch (state) {
                    case 'DEFAULT':
                        // if it is a new circle, a new exercise shall be selected
                        setNewExercise(topic);
                        break;
                    case 'REENTER':
                        // check which topic was selected and save as new current topic; select exercise of this topic
                        switch (pathGraph[circle].topic) {
                            case topic1:
                                setCurrentTopic(1);
                                setNewExercise(topic1);
                                handleTopicRepeat(1);
                                break;
                            case topic2:
                                setCurrentTopic(2);
                                setNewExercise(topic2);
                                handleTopicRepeat(2);
                                break;
                            case topic3:
                                setCurrentTopic(3);
                                setNewExercise(topic3);
                                handleTopicRepeat(3);
                                break;
                            default:
                                console.log('some error setting new topic in REENTER state');
                        }
                        // remove REENTER-circles from possible circles
                        const newPossibleCircles = possibleCircles.filter((circle) => !circle.includes('circle'));
                        setPossibleCircles(newPossibleCircles);
                        setState('DEFAULT');
                        break;
                    default:
                        console.log('some state error in handleCircleClick');
                }
                // circle is now last clicked circle
                setLastClicked(circle);
            }
            else {
                // if circle was just clicked again, show current content again
                setCurrentContent(currentExercise);
            }
        } else {
            // save type of non-exercise circle to choose correct popup
            setCurrentContent(topic);
            // lastClicked shall not be updated if szenario is clicked without being active
            if ((topic === 'szenario1' || topic === 'szenario2' || topic === 'szenario3') && !szenarioActive) {
                setShowPopup(true);
                return;
            }
            setLastClicked(circle);
        }

        setShowPopup(true);
    };

    const isCircleReachable = (circle) => {
        return circle === activeCircle || possibleCircles.includes(circle);
    };

    const setNewExercise = (topic) => {
        // which topic pool to choose exercises from
        const exercises = (topic === topic1 ? exercisesTopic1 : topic === topic2 ? exercisesTopic2 : exercisesTopic3);

        if (exercises.length > 0) {
            // if there are still exercises left, get a new exercise 
            getExercise(exercises, topic);
        } else {
            console.log('reset exercise pool of topic: ', topic);
            // reshuffle exercises for exhausted topic exercise pool
            const newExercisePool = quizData.filter((exercise) => exercise.difficulty === topic);
            shuffleArray(newExercisePool);

            // get new exercise and save new exercise pool after popping
            getExercise(newExercisePool, topic);
        }
    };

    const getExercise = (exercises, topic) => {
        // choose last exercise of array and delete it
        const selected = exercises.pop();

        // save which exercise is currently used
        setCurrentExercise(selected);
        setCurrentContent(selected);

        // update the changed exercises array in state, according to topic
        switch (topic) {
            case topic1:
                setExercisesTopic1(exercises);
                break;
            case topic2:
                setExercisesTopic2(exercises);
                break;
            case topic3:
                setExercisesTopic3(exercises);
                break;
            default:
                console.log('some mistake by setting topic exercises');
        }
    };

    const handleJoker = (joker) => {
        setJokerUsed(joker);
        setJokerMap({ ...jokerMap, [activeCircle]: joker });
        setJokerInTopic(prevJokerInTopic => ({
            ...prevJokerInTopic,
            [currentTopic]: prevJokerInTopic[currentTopic] + 1,
        }));

        if (joker === 'swap') {
            switch (currentTopic) {
                case 1:
                    setNewExercise(topic1);
                    break;
                case 2:
                    setNewExercise(topic2);
                    break;
                case 3:
                    setNewExercise(topic3);
                    break;
                default:
                    console.log(currentTopic, ' is neither 1, 2 or 3 (error swap joker');
            }
        }
    };

    // updating state and board after exercise answer has been locked in
    const handleAnswer = (isCorrect) => {
        console.log('Quiz knows that answer was: ', isCorrect);
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
        if (lastClicked === 'circle24') {
            setCompletedAtLeastOnce(true);
        }
    };

    // updating board when user closes popup
    const handleUpdate = () => {
        // check what type of circle was clicked
        const topic = pathGraph[lastClicked].topic;
        const isExercise = (topic === topic1 || topic === topic2 || topic === topic3);

        // execute behaviour depending on what type of circle (if exercise, board has already been updated)
        if (!isExercise) {
            if (topic === 'feedback') {
                if (currentTopic === 3) {
                    setState('REENTER');
                    setPossibleCircles(possibleCircles => [...possibleCircles, ...['circle1', 'circle9', 'circle17']]);
                } else {
                    setActiveCircle(pathGraph[lastClicked].next);
                    setCurrentTopic(currentTopic + 1);
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

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleTopicRepeat = (repeatTopic) => {
        // reset amount of used joker & correct circles in current topic
        setCorrectInTopic(prevCorrectInTopic => ({
            ...prevCorrectInTopic,
            [repeatTopic]: 0,
        }));
        setJokerInTopic(prevJokerInTopic => ({
            ...prevJokerInTopic,
            [repeatTopic]: 0,
        }));
        setDoneInTopic(prevDoneInTopic => ({
            ...prevDoneInTopic,
            [repeatTopic]: 0,
        }))
        // depending on which topic is repeated, set active circle, reset completed/correct circles & joker
        if (repeatTopic === 1) {
            setActiveCircle('circle1');
            const newCompleted = completedCircles.filter(
                circle => pathGraph[circle].topic !== topic1
            );
            setCompletedCircles(newCompleted);
            const newCorrect = correctCircles.filter(
                circle => pathGraph[circle].topic !== topic1
            );
            setCorrectCircles(newCorrect);
            Object.keys(jokerMap).forEach((circle) => {
                if (parseInt(circle.substring(circle.indexOf('e') + 1)) < 9) {
                    jokerMap[circle] = '';
                }
            });
        } else if (repeatTopic === 2) {
            setActiveCircle('circle9');
            const newCompleted = completedCircles.filter(
                circle => pathGraph[circle].topic !== topic2
            );
            setCompletedCircles(newCompleted);
            const newCorrect = correctCircles.filter(
                circle => pathGraph[circle].topic !== topic2
            );
            setCorrectCircles(newCorrect);
            Object.keys(jokerMap).forEach((circle) => {
                const nr = parseInt(circle.substring(circle.indexOf('e') + 1));
                if (nr >= 9 && nr < 17) {
                    jokerMap[circle] = '';
                }
            });
        } else {
            setActiveCircle('circle17');
            const newCompleted = completedCircles.filter(
                circle => pathGraph[circle].topic !== topic3
            );
            setCompletedCircles(newCompleted);
            const newCorrect = correctCircles.filter(
                circle => pathGraph[circle].topic !== topic3
            );
            setCorrectCircles(newCorrect);
            Object.keys(jokerMap).forEach((circle) => {
                if (parseInt(circle.substring(circle.indexOf('e') + 1)) >= 17) {
                    jokerMap[circle] = '';
                }
            });
        }

        // close popup automatically if topic repeat was triggered by feedback popup
        if (pathGraph[lastClicked].topic === 'feedback') {
            setShowPopup(false);
        }
    };

    const handleReset = () => {
        setCompletedCircles([]);
        setPossibleCircles([]);
        setCompletedAtLeastOnce(false);
        setSzenariosDone(0);
        setCurrentTopic(1);
        setActiveCircle('start');
        setCorrectCircles([]);
        setCorrectInTopic({ 1: 0, 2: 0, 3: 0 });
        setJokerInTopic({ 1: 0, 2: 0, 3: 0 });
        setDoneInTopic({ 1: 0, 2: 0, 3: 0 });

        Object.keys(jokerMap).forEach((circle) => {
            jokerMap[circle] = '';
        });
    };

    const renderBoard = () => {
        const circleColors = {
            easy: '#D177B3', medium: '#8377D1', hard: '#77D1CB',
            szenario1: '#D177B3', szenario2: '#8377D1', szenario3: '#77D1CB',
            start: '#817C9C', feedback: '#817C9C'
        };

        const circleTexts = {
            szenario1: 'Vertrauen', szenario2: 'Diskriminierung', szenario3: 'Autonomie', start: 'Start'
        }

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
                        strokeDasharray={isExercise
                            ? isReachable
                                ? '6'
                                : isCompleted
                                    ? 'none'
                                    : '6'
                            : isCompleted
                                ? 'none'
                                : '6'}
                        style={
                            {
                                ...({ cursor: isReachable ? 'pointer' : 'default' }),
                                ...(isExercise ? isCompleted ? { opacity: wasCorrect ? '100%' : '40%' } : {} : {})
                            }
                        }
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
                <svg id='board'>
                    <text x={248} y={50} textAnchor="middle" fill='#D177B3' className='h3'>Vertrauen</text>
                    <text x={744} y={50} textAnchor="middle" fill='#8377D1' className='h3'>Diskriminierung</text>
                    <text x={1240} y={50} textAnchor="middle" fill='#77D1CB' className='h3'>Autonomie</text>
                    <line x1={496} y1={0} x2={496} y2={1000} style={{ stroke: '#2D2C36', strokeWidth: '5px' }} />
                    <line x1={992} y1={0} x2={992} y2={1000} style={{ stroke: '#2D2C36', strokeWidth: '5px' }} />
                    {renderBoard()}
                </svg>
            </div>
            {showPopup &&
                <Popup
                    onClose={handleClosePopup}
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
}

// helper function: shuffles array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

export default Quiz;