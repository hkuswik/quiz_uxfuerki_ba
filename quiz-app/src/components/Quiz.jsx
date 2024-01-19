import '../css/Quiz.css';
import { useState, useEffect } from 'react';
import quizData from '../data/questions_onlyUX.json';
import feedbackImg from '../data/images/feedback.png';
import goalImg from '../data/images/feedback_ende.png';
import Header from './Header';
import Popup from './Popup';

const topic1 = 'easy';
const topic2 = 'medium';
const topic3 = 'hard';

const pathGraph = {
    start: { next: 'szenario1', topic: 'start', x: '40', y: '140' },
    szenario1: { next: 'circle1', topic: 'szenario1', x: '180', y: '135' },
    circle1: { next: 'circle2', topic: topic1, x: '320', y: '170' },
    circle2: { next: 'circle3', topic: topic1, x: '380', y: '270' },
    circle3: { next: 'circle4', topic: topic1, x: '290', y: '350' },
    circle4: { next: 'circle5', topic: topic1, x: '170', y: '390' },
    circle5: { next: 'circle6', topic: topic1, x: '110', y: '500' },
    circle6: { next: 'circle7', topic: topic1, x: '140', y: '620' },
    circle7: { next: 'circle8', topic: topic1, x: '250', y: '690' },
    circle8: { next: 'feedback1', topic: topic1, x: '380', y: '710' },
    feedback1: { next: 'szenario2', topic: 'feedback', x: '496', y: '680' },
    szenario2: { next: 'circle9', topic: 'szenario2', x: '660', y: '680' },
    circle9: { next: 'circle10', topic: topic2, x: '40%', y: '13%' },
    circle10: { next: 'circle11', topic: topic2, x: '50%', y: '16%' },
    circle11: { next: 'circle12', topic: topic2, x: '50%', y: '16%' },
    circle12: { next: 'circle13', topic: topic2, x: '50%', y: '16%' },
    circle13: { next: 'circle14', topic: topic2, x: '50%', y: '16%' },
    circle14: { next: 'circle15', topic: topic2, x: '50%', y: '16%' },
    circle15: { next: 'circle16', topic: topic2, x: '50%', y: '16%' },
    circle16: { next: 'feedback2', topic: topic2, x: '50%', y: '16%' },
    feedback2: { next: 'szenario3', topic: 'feedback', x: '992', y: '140' },
    szenario3: { next: 'circle17', topic: 'szenario3', x: '50%', y: '50%' },
    circle17: { next: 'circle18', topic: topic3, x: '60%', y: '18%' },
    circle18: { next: 'circle19', topic: topic3, x: '60%', y: '18%' },
    circle19: { next: 'circle20', topic: topic3, x: '60%', y: '18%' },
    circle20: { next: 'circle21', topic: topic3, x: '60%', y: '18%' },
    circle21: { next: 'circle22', topic: topic3, x: '60%', y: '18%' },
    circle22: { next: 'circle23', topic: topic3, x: '60%', y: '18%' },
    circle23: { next: 'circle24', topic: topic3, x: '60%', y: '18%' },
    circle24: { next: 'goal', topic: topic3, x: '60%', y: '18%' },
    goal: { next: '', topic: 'goal', x: '1430', y: '769' }
};

const Quiz = () => {
    const [state, setState] = useState('DEFAULT');

    const [activeCircle, setActiveCircle] = useState('start');
    const [lastClicked, setLastClicked] = useState('start');
    const [possibleCircles, setPossibleCircles] = useState([]);
    const [completedCircles, setCompletedCircles] = useState([]);
    const [hoveredCircle, setHoveredCircle] = useState(null);
    const [correctCircles, setCorrectCircles] = useState([]);
    const [correctInTopic, setCorrectInTopic] = useState(new Map([[1, 0], [2, 0], [3, 0]]));

    const [completedTopics, setCompletedTopics] = useState(0);
    const [szenariosDone, setSzenariosDone] = useState(0);

    const [currentContent, setCurrentContent] = useState(null);
    const [currentExercise, setCurrentExercise] = useState(null);

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

        const topic = pathGraph[circle].topic;
        const isExercise = (topic === topic1 || topic === topic2 || topic === topic3);
        const szenarioActive = (activeCircle === 'szenario1' || activeCircle === 'szenario2' || activeCircle === 'szenario3');

        if (isExercise) {
            // check if circle is the same as the last clicked circle
            if (circle !== lastClicked) {
                // if it is a new circle, a new exercise shall be selected
                setNewExercise(circle, topic);
                setLastClicked(circle);
            } else {
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
    }

    const isCircleReachable = (circle) => {
        return circle === activeCircle || possibleCircles.includes(circle)
    }

    const setNewExercise = (circle, topic) => {
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

            setCurrentExercise(selected); // save which exercise is currently used
            setCurrentContent(selected);
        } else {
            // TODO: what happens when question pool of one difficulty is empty (currently: last repeated)
            console.log('No more questions of topic: ', pathGraph[circle].topic);
        }
    }

    const handleAnswer = (isCorrect) => {
        console.log('Quiz knows that answer was: ', isCorrect);
        setCorrectAnswer(isCorrect);
    }

    const handleUpdate = () => {
        console.log('was answer correct?: ', correctAnswer);
        if (correctAnswer) {
            setCorrectCircles(correctCircles => [...correctCircles, lastClicked]);
        }

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
                // TODO: how game changes after it was completed once (enable reentering at every topic's 1st circle)
                console.log('we enter the reenter case..');
                break;

            default:
                console.log('some state problem oh no');
        }

        // update completed circles
        setCompletedCircles(completedCircles => [...completedCircles, lastClicked]);
        updateCorrectInTopic(lastClicked, correctAnswer);

        setShowPopup(false);
    }

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const updateCorrectInTopic = (circle, correct) => {
        if (correct) {
            switch (pathGraph[circle].topic) {
                case topic1:
                    setCorrectInTopic(correctInTopic.set(1, correctInTopic.get(1) + 1));
                    break;
                case topic2:
                    setCorrectInTopic(correctInTopic.set(2, correctInTopic.get(2) + 1));
                    break;
                case topic3:
                    setCorrectInTopic(correctInTopic.set(3, correctInTopic.get(3) + 1));
                    break;
                default:
                    console.log('error setting correctInTopic');
            }
        }
    }

    const handleReset = () => {
        console.log('reset btn was pressed');
        setCompletedCircles([]);
        setPossibleCircles([]);
        setSzenariosDone(0);
        setCompletedTopics(0);
        setActiveCircle('start');
        // TODO: reset used exercises or not??
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
            const wasCorrect = correctCircles.includes(circle);

            const topic = pathGraph[circle].topic;
            const isExerciseOrSzenario = topic !== 'start' && topic !== 'goal' && topic !== 'feedback';
            const isSzenario = topic === 'szenario1' || topic === 'szenario2' || topic === 'szenario3';
            const isExercise = isExerciseOrSzenario && !isSzenario;
            const isFeedback = topic === 'feedback';
            const isGoal = topic === 'goal';

            const isSzenarioHovered = isSzenario && circle === hoveredCircle;
            const color = circleColors[topic];
            const text = circleTexts[topic];

            return (
                <g key={circle} onClick={() => handleCircleClick(circle)}
                    onMouseOver={() => handleCircleHover(circle)} onMouseLeave={handleCircleLeave}
                >
                    <ellipse
                        cx={pathGraph[circle].x}
                        cy={pathGraph[circle].y}
                        rx={isSzenario ? '80' : '35'}
                        ry={isSzenario ? '55' : '35'}
                        fill={isExerciseOrSzenario ? isCompleted ? color : '#21202b' : '#21202b'}
                        stroke={isReachable ? 'white' : color}
                        className={`${isActiveHovered ? 'circle-active-hover' : ''} ${isSzenarioHovered ? 'opacity-80' : ''}`}
                        strokeWidth='2px'
                        strokeDasharray={isCompleted ? 'none' : '6'}
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
                </g>
            );
        });
    };

    return (
        <div className='Quiz'>
            <Header onReset={handleReset}></Header>
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
                    completedTopics={completedTopics}
                    onAnswer={handleAnswer}
                    onUpdate={handleUpdate}
                    correctInTopic={correctInTopic}
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