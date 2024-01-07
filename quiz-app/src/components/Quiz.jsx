import '../css/Quiz.css';
import { useState, useEffect } from 'react';
import quizData from './../data/questions_onlyUX';
import Header from './Header';
import Popup from './Popup';

const pathGraph = {
    start: { reachable: ['szenario1'], topic: 'start', x: '8%', y: '14%' },
    szenario1: { reachable: ['circle1'], topic: 'szenario', x: '8%', y: '50%' },
    circle1: { reachable: ['circle2'], topic: 'easy', x: '20%', y: '11%' },
    circle2: { reachable: ['feedback1'], topic: 'easy', x: '30%', y: '11%' },
    feedback1: { reachable: ['szenario2'], topic: 'feedback', x: '30%', y: '30%' },
    szenario2: { reachable: ['circle3'], topic: 'szenario', x: '30%', y: '50%' },
    circle3: { reachable: ['circle4'], topic: 'medium', x: '40%', y: '13%' },
    circle4: { reachable: ['feedback2'], topic: 'medium', x: '50%', y: '16%' },
    feedback2: { reachable: ['szenario3'], topic: 'feedback', x: '50%', y: '30%' },
    szenario3: { reachable: ['circle5'], topic: 'szenario', x: '50%', y: '50%' },
    circle5: { reachable: ['circle6'], topic: 'hard', x: '60%', y: '18%' },
    circle6: { reachable: ['goal'], topic: 'hard', x: '70%', y: '20%' },
    goal: { reachable: ['circle1', 'circle3', 'circle5'], topic: 'goal', x: '80%', y: '25%' }
};

function Quiz() {
    const [possibleCircles, setPossibleCircles] = useState(['start']);
    const [completedCircles, setCompletedCircles] = useState([]);

    const [completedTopics, setCompletedTopics] = useState(0);
    const [szenariosDone, setSzenariosDone] = useState(0);

    const [currentExercise, setCurrentExercise] = useState(null);
    const [completedExercisesIDs, setCompletedExercisesIDs] = useState([]);

    const [exercisesTopic1, setExercisesTopic1] = useState([]);
    const [exercisesTopic2, setExercisesTopic2] = useState([]);
    const [exercisesTopic3, setExercisesTopic3] = useState([]);

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // save questions according to topic
        const firstTopic = quizData.filter((q) => q.difficulty === 'easy');
        const secondTopic = quizData.filter((q) => q.difficulty === 'medium');
        const thirdTopic = quizData.filter((q) => q.difficulty === 'hard');

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

        // check if clicked circle is currently possible
        const isReachable = possibleCircles.includes(circle);
        if (!isReachable) {
            console.log(`Not reachable! Reachable circles are ${possibleCircles.join(', ')}`);
            return;
        }

        /* // is the quiz finished?
        if (circle === 'goal') {
            // TODO: what happens when you win
            console.log('Congratulations, you won !!! :)');
            return;
        } */

        // check if clicked circle is an exercise
        const isExercise = circle !== 'start' && circle !== 'goal' && circle !== 'feedback';

        if (isExercise) {
            // which topic pool to choose exercises from
            const exercises = pathGraph[circle].topic === 'easy' ? exercisesTopic1
                : pathGraph[circle].topic === 'medium' ? exercisesTopic2
                    : exercisesTopic3;

            // if there are still exercises left, choose last exercise of array and delete it
            if (exercises.length > 0) {
                const selected = exercises.pop();

                // update the changed exercises array in state, according to topic
                switch (pathGraph[circle].topic) {
                    case 'easy':
                        setExercisesTopic1(exercises);
                        break;
                    case 'medium':
                        setExercisesTopic2(exercises);
                        break;
                    case 'hard':
                        setExercisesTopic3(exercises);
                        break;
                    default:
                        console.log('some mistake by setting topic exercises');
                }

                console.log('id: ', selected.id, ', topic: ', selected.difficulty, ', type: ', selected.type, ', question: ', selected.question);

                setCurrentExercise(selected); // save which exercise is currently used
                setCompletedExercisesIDs([...completedExercisesIDs, selected.id]); // save its id for progress overview

            } else {
                // TODO: what happens when question pool if one difficult is empty
                console.log('No more questions of topic: ', pathGraph[circle].topic);
            }
        } else {
            // change to what kind of non-exercise to later choose correct popup
            setCurrentExercise(pathGraph[circle].topic);
        }

        // update completed circles and now possible circles
        setCompletedCircles([...completedCircles, circle]);
        setPossibleCircles(pathGraph[circle].reachable);

        setShowPopup(true); // make popup visible
    }

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const renderBoard = () => {
        const circleColors = {
            easy: '#D177B3', medium: '#8377D1', hard: '#77D1CB', start: '#817C9C',
            goal: 'gold', feedback: '#817C9C', szenario: '#817C9C', unreachable: '#54506A'
        };

        const handleCircleHover = (event) => {
            event.target.parentNode.querySelector('circle').style.opacity = '80%';
        };

        const handleCircleLeave = (event) => {
            event.target.parentNode.querySelector('circle').style.opacity = '100%';
        };

        const circles = Object.keys(pathGraph);

        return circles.map((circle) => {
            const isReachable = possibleCircles.includes(circle);
            const isCompleted = completedCircles.includes(circle);
            const color = circleColors[pathGraph[circle].topic];
            /* const borderColor = isReachable ? circleColors[pathGraph[circle].topic] : circleColors.unreachable; */

            return (
                <g key={circle} onClick={() => handleCircleClick(circle)}>
                    <circle
                        cx={pathGraph[circle].x}
                        cy={pathGraph[circle].y}
                        r={circle === 'start' || circle === 'goal' ? '6%' : '3.5%'}
                        fill={isCompleted ? color : '#21202b'}
                        stroke={isReachable ? 'white' : color}
                        strokeWidth='2px'
                        style={{ cursor: isReachable ? 'pointer' : 'default' }}
                        className='circle'
                        onMouseOver={handleCircleHover}
                        onMouseLeave={handleCircleLeave}
                    />
                    <text
                        x={pathGraph[circle].x}
                        y={pathGraph[circle].y}
                        dy="5px"
                        textAnchor="middle" // text horizontally
                        fill="white"
                        fontSize="12px"
                        style={{ cursor: isReachable ? 'pointer' : 'default' }}
                        onMouseOver={handleCircleHover}
                        onMouseLeave={handleCircleLeave}
                    >
                        {circle.toUpperCase() /*name of circle (for now)*/}
                    </text>
                </g>
            );
        });
    };

    return (
        <div className='Quiz'>
            <Header></Header>
            <svg className='flex justify-self-center' width="800px" height="800px">
                {renderBoard()}
            </svg>
            {showPopup && <Popup onClose={handleClosePopup} exercise={currentExercise} completedTopics={completedTopics} />}
        </div>
    )
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

/* function isCirclePossible(circle, current) {
    // check if circle has already been completed
    if (completedCircles.includes(circle)) {
        console.log('already completed');
        return false;
    }

    // if step is current step, it shall also remain coloured
    if (circle === current) {
        console.log('circle = current');
        return true;
    }

    // if step is reachable from current step, it is directly reachable
    if (pathGraph[current].reachable.includes(circle)) {
        console.log('directly reachable');
        return true;
    }

    // check recursively if circle is still reachable from other reachable steps
    for (const nextCircle of pathGraph[current].reachable) {
        if (isCirclePossible(circle, nextCircle)) {
            return true;
        }
    }

    return false;
} */

export default Quiz;