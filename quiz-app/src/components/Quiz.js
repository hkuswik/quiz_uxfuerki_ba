import '../css/Quiz.css';
import { useState, useEffect } from 'react';
import quizData from './../data/questions_onlyUX';
import Header from './Header';
import Popup from './Popup';

const pathGraph = {
    start: { reachable: ['circle1'], difficulty: 'start', x: '8%', y: '14%' },
    circle1: { reachable: ['circle2'], difficulty: 'easy', x: '20%', y: '11%' },
    circle2: { reachable: ['circle3'], difficulty: 'easy', x: '30%', y: '11%' },
    circle3: { reachable: ['circle4'], difficulty: 'medium', x: '40%', y: '13%' },
    circle4: { reachable: ['circle5'], difficulty: 'medium', x: '50%', y: '16%' },
    circle5: { reachable: ['circle6'], difficulty: 'hard', x: '60%', y: '18%' },
    circle6: { reachable: ['goal'], difficulty: 'hard', x: '70%', y: '20%' },
    goal: { reachable: [], difficulty: 'goal', x: '80%', y: '25%' }
};

function Quiz() {
    const [currentCircle, setCurrentCircle] = useState('start');
    const [completedCircles, setCompletedCircles] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [completedQuestionsIDs, setCompletedQuestionsIDs] = useState([]);
    const [questionsTopic1, setQuestionsTopic1] = useState([]);
    const [questionsTopic2, setQuestionsTopic2] = useState([]);
    const [questionsTopic3, setQuestionsTopic3] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentExercise, setCurrentExercise] = useState(null);

    useEffect(() => {
        // save questions according to difficulty
        const easy = quizData.filter((q) => q.difficulty === 'easy');
        const medium = quizData.filter((q) => q.difficulty === 'medium');
        const hard = quizData.filter((q) => q.difficulty === 'hard');

        // randomize the order
        shuffleArray(easy);
        shuffleArray(medium);
        shuffleArray(hard);

        setQuestionsTopic1(easy);
        setQuestionsTopic2(medium);
        setQuestionsTopic3(hard);
    }, []);

    const handleCircleClick = (circle) => {
        console.log('circle clicked: ', circle);

        // is circle even reachable from current circle?
        const isReachable = pathGraph[currentCircle].reachable.includes(circle);
        if (!isReachable) {
            // TODO: maybe some effect when you click on wrong circle?
            console.log(`Not reachable from ${currentCircle}`);
            return;
        }

        // is the quiz finished?
        if (circle === 'goal') {
            // TODO: what happens when you win
            setCurrentCircle(circle);
            console.log('Congratulations, you won !!! :)');
            return;
        }

        // which difficulty pool to choose question from
        const questions = pathGraph[circle].difficulty === 'easy' ? questionsTopic1
            : pathGraph[circle].difficulty === 'medium' ? questionsTopic2
                : questionsTopic3;

        // if there are still questions left, ask last question of array and delete it
        if (questions.length > 0) {
            const selected = questions.pop();
            setSelectedQuestion(selected); // save which question is currently used
            setCompletedQuestionsIDs([...completedQuestionsIDs, selected.id]); // save its id for progress

            // save new questions array in state, according to difficulty
            switch (pathGraph[circle].difficulty) {
                case 'easy':
                    setQuestionsTopic1(questions);
                    break;
                case 'medium':
                    setQuestionsTopic2(questions);
                    break;
                case 'hard':
                    setQuestionsTopic3(questions);
                    break;
                default:
                    console.log('some mistake by setting difficulty questions');
            }

            // TODO: what happens in question depending on type
            switch (selected.type) {
                case 'question':
                    console.log('question: ' + selected.question);
                    break;
                case 'match':
                    console.log('match: ' + selected.question);
                    break;
                case 'sort':
                    console.log('sort: ' + selected.question);
                    break;
                default:
                    console.log('some mistake by selecting question type');
            }

            setCurrentExercise(selected);
            setShowPopup(true);

        } else {
            // TODO: what happens when question pool if one difficult is empty
            console.log('No more questions of difficulty: ', pathGraph[circle].difficulty);
        }

        setCompletedCircles([...completedCircles, currentCircle]); // save which circle was walked
        setCurrentCircle(circle);

        
    }

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const renderBoard = () => {
        const circleColors = { start: '#817C9C', easy: '#D177B3', medium: '#8377D1', hard: '#77D1CB', goal: '#817C9C', unreachable: '#B7B4C7' };

        const handleCircleHover = (event) => {
            event.target.parentNode.querySelector('circle').style.opacity = '80%';
        };

        const handleCircleLeave = (event) => {
            event.target.parentNode.querySelector('circle').style.opacity = '100%';
        };

        const circles = Object.keys(pathGraph);

        return circles.map((circle) => {
            const isReachable = pathGraph[currentCircle].reachable.includes(circle);
            const isStillPossible = isCirclePossible(circle, currentCircle);
            const fillColor = isStillPossible ? circleColors[pathGraph[circle].difficulty] : circleColors.unreachable;

            return (
                <g key={circle} onClick={() => handleCircleClick(circle)}>
                    <circle
                        cx={pathGraph[circle].x}
                        cy={pathGraph[circle].y}
                        r={circle === 'start' || circle === 'goal' ? '6%' : '3.5%'}
                        fill={fillColor}
                        stroke={circle === currentCircle ? '#EE7B30' : 'none'}
                        strokeWidth={circle === currentCircle ? '4px' : 'none'}
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
                        fill="#21202b"
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
            <svg style={svgBoard} width="800px" height="800px">
                {renderBoard()}
            </svg>
            {showPopup && <Popup onClose={handleClosePopup} exercise={currentExercise}/>}
        </div>
    )

    function isCirclePossible(circle, current) {
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
    }
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const svgBoard = {
    display: 'flex',
    justifySelf: 'center'
}

export default Quiz;