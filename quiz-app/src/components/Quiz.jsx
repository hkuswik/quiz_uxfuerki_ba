import '../css/Quiz.css';
import { useState, useEffect, useRef } from 'react';
import quizData from '../data/questions_onlyUX';
import feedbackImg from '../data/images/feedback.png';
import goalImg from '../data/images/feedback_ende.png';
import Header from './Header';
import Popup from './Popup';

const topic1 = 'easy';
const topic2 = 'medium';
const topic3 = 'hard';

const pathGraph = {
    start: { next: 'szenario1', topic: 'start', x: '8%', y: '14%' },
    szenario1: { next: 'circle1', topic: 'szenario1', x: '8%', y: '50%' },
    circle1: { next: 'circle2', topic: topic1, x: '20%', y: '11%' },
    circle2: { next: 'feedback1', topic: topic1, x: '30%', y: '11%' },
    feedback1: { next: 'szenario2', topic: 'feedback', x: '200', y: '240' },
    szenario2: { next: 'circle3', topic: 'szenario2', x: '30%', y: '50%' },
    circle3: { next: 'circle4', topic: topic2, x: '40%', y: '13%' },
    circle4: { next: 'feedback2', topic: topic2, x: '50%', y: '16%' },
    feedback2: { next: 'szenario3', topic: 'feedback', x: '400', y: '240' },
    szenario3: { next: 'circle5', topic: 'szenario3', x: '50%', y: '50%' },
    circle5: { next: 'circle6', topic: topic3, x: '60%', y: '18%' },
    circle6: { next: 'goal', topic: topic3, x: '70%', y: '20%' },
    goal: { next: '', topic: 'goal', x: '650', y: '230' }
};

const Quiz = () => {
    const [state, setState] = useState('DEFAULT');

    const [activeCircle, setActiveCircle] = useState('start');
    const [lastClicked, setLastClicked] = useState(null);
    const [possibleCircles, setPossibleCircles] = useState([]);
    const [completedCircles, setCompletedCircles] = useState([]);
    const [hoveredCircle, setHoveredCircle] = useState(null);

    const [completedTopics, setCompletedTopics] = useState(0);
    const [szenariosDone, setSzenariosDone] = useState(0);

    const [currentContent, setCurrentContent] = useState(null);

    const [correctAnswer, setCorrectAnswer] = useState(false);

    const [exercisesTopic1, setExercisesTopic1] = useState([]);
    const [exercisesTopic2, setExercisesTopic2] = useState([]);
    const [exercisesTopic3, setExercisesTopic3] = useState([]);

    const [showPopup, setShowPopup] = useState(false);

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
    }, []);

    const handleCircleClick = (circle) => {
        console.log('circle clicked: ', circle);
        console.log('active: ', activeCircle);

        // check if clicked circle is currently possible
        if (!isCircleReachable(circle)) {
            console.log('Not reachable! Reachable circles are ', possibleCircles, ' or ', activeCircle);
            return;
        }

        setLastClicked(circle);

        const topic = pathGraph[circle].topic;
        const isExercise = (topic === topic1 || topic === topic2 || topic === topic3);

        if (isExercise) {
            handleExerciseBehaviour(circle, topic);
        } else {
            // save type of non-exercise circle to choose correct popup
            setCurrentContent(topic);
        }

        setShowPopup(true);
    }

    const isCircleReachable = (circle) => {
        return circle === activeCircle || possibleCircles.includes(circle)
    }

    const handleExerciseBehaviour = (circle, topic) => {
        // which topic pool to choose exercises from
        const exercises = (topic === topic1 ? exercisesTopic1 : topic === topic2 ? exercisesTopic2 : exercisesTopic3);

        // if there are still exercises left, choose last exercise of array and delete it
        if (exercises.length > 0) {
            const selected = exercises.pop();

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

            console.log('id: ', selected.id, ', topic: ', selected.difficulty, ', type: ', selected.type, ', question: ', selected.question);

            setCurrentContent(selected); // save which exercise is currently used
        } else {
            // TODO: what happens when question pool of one difficulty is empty
            console.log('No more questions of topic: ', pathGraph[circle].topic);
        }
    }

    const handleAnswer = (isCorrect) => {
        console.log('QUIZ! Answer is correct: ', isCorrect);
        setCorrectAnswer(isCorrect);
    }

    const handleUpdate = () => {
        // TODO: change appearance depending on true/false answer
        console.log('was answer correct?: ', correctAnswer);

        switch (state) {
            case 'DEFAULT':
                // check what type of circle was clicked
                const topic = pathGraph[lastClicked].topic;
                const isExercise = (topic === topic1 || topic === topic2 || topic === topic3);

                // execute behaviour depending on what type of circle
                if (isExercise) {
                    setActiveCircle(pathGraph[lastClicked].next);
                }
                else {
                    if (topic === 'goal') {
                        setCompletedTopics(completedTopics + 1);
                        setPossibleCircles(possibleCircles => [...possibleCircles, ...['circle1', 'circle3', 'circle5']]);
                        setState('REENTER');
                    } else if (topic === 'feedback') {
                        console.log(`feedback circle -> topics: ${completedTopics}, now +1`);
                        setActiveCircle(pathGraph[lastClicked].next);
                        setCompletedTopics(completedTopics + 1);
                    } else if (topic.includes('szenario')) {
                        setSzenariosDone(szenariosDone + 1);
                        setActiveCircle(pathGraph[lastClicked].next);
                        !(possibleCircles.includes(lastClicked)) && setPossibleCircles(possibleCircles => [...possibleCircles, lastClicked]);
                    } else { //start
                        console.log('start?');
                        setActiveCircle(pathGraph[lastClicked].next);
                    }
                }

                break;

            case 'REENTER':
                // TODO: how game changes after it was completed once
                console.log('we enter the reenter case..');
                break;

            default:
                console.log('some state problem oh no');
        }

        // update completed circles
        setCompletedCircles(completedCircles => [...completedCircles, lastClicked]);

        setShowPopup(false);
    }

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleReset = () => {
        // TODO: resetting quiz
        console.log('reset btn was pressed');
    }

    const renderBoard = () => {
        const circleColors = {
            easy: '#D177B3', medium: '#8377D1', hard: '#77D1CB',
            szenario1: '#D177B3', szenario2: '#8377D1', szenario3: '#77D1CB',
            start: '#817C9C', goal: '#817C9C', feedback: '#817C9C'
        };

        const circleTexts = {
            szenario1: 'Vertrauen', szenario2: 'Diskriminierung', szenario3: 'Autonomie', start: 'Start'
        }

        const handleCircleHover = (circle) => {
            console.log('hover: ', circle);
            setHoveredCircle(circle);
        };

        const handleCircleLeave = () => {
            setHoveredCircle(null);
        };

        const circles = Object.keys(pathGraph);

        return circles.map((circle) => {
            const isReachable = isCircleReachable(circle);
            const isCompleted = completedCircles.includes(circle);
            const isActiveHovered = circle === activeCircle && circle === hoveredCircle;
            const isCompletedHovered = isCompleted && circle === hoveredCircle;

            const topic = pathGraph[circle].topic;
            const isExerciseOrSzenario = topic !== 'start' && topic !== 'goal' && topic !== 'feedback';
            const isSzenario = topic === 'szenario1' || topic === 'szenario2' || topic === 'szenario3';
            const isFeedback = topic === 'feedback';
            const isGoal = topic === 'goal';

            const color = circleColors[topic];
            const text = circleTexts[topic];

            return (
                <g key={circle} onClick={() => handleCircleClick(circle)}
                    onMouseOver={() => handleCircleHover(circle)} onMouseLeave={handleCircleLeave}
                >
                    <circle
                        cx={pathGraph[circle].x}
                        cy={pathGraph[circle].y}
                        r={isSzenario ? '69' : '35'}
                        fill={isExerciseOrSzenario ? isCompleted ? color : '#21202b' : '#21202b'}
                        stroke={isReachable ? 'white' : color}
                        className={`${isActiveHovered ? 'circle-active-hover' : ''} ${isCompletedHovered ? 'circle-completed-hover' : ''}`}
                        strokeWidth='2px'
                        strokeDasharray={isCompleted ? 'none' : '6'}
                        style={{ cursor: isReachable ? 'pointer' : 'default' }}
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
                            dy='-15px'
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
                </g>
            );
        });
    };

    return (
        <div className='Quiz'>
            <Header onReset={handleReset}></Header>
            <svg className='flex justify-self-center' width="1000px" height="800px">
                {renderBoard()}
            </svg>
            {showPopup &&
                <Popup
                    onClose={handleClosePopup}
                    content={currentContent}
                    active={activeCircle}
                    completedTopics={completedTopics}
                    onAnswer={handleAnswer}
                    onUpdate={handleUpdate}
                />}
        </div>
    )
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

export default Quiz;