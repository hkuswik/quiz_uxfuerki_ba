import './Quiz.css';
import Header from './Header';
import { useState, useEffect } from 'react';
import quizData from './../data/questions_onlyUX';

const pathGraph = {
    start: { reachable: ['circle1', 'circle2'], difficulty: 'easy', x: '8%', y: '14%' },
    circle1: { reachable: ['circle3'], difficulty: 'easy', x: '20%', y: '11%' },
    circle2: { reachable: ['goal'], difficulty: 'hard', x: '18%', y: '28%' },
    circle3: { reachable: ['circle4'], difficulty: 'medium', x: '30%', y: '11%' },
    circle4: { reachable: ['goal'], difficulty: 'easy', x: '40%', y: '13%' },
    goal: { reachable: [], difficulty: 'goal', x: '35%', y: '40%' }
};

function Quiz() {
    const [currentCircle, setCurrentCircle] = useState('start');
    const [completedQuestionsIDs, setCompletedQuestionsIDs] = useState([]);
    const [easyQuestions, setEasyQuestions] = useState([]);
    const [mediumQuestions, setMediumQuestions] = useState([]);
    const [hardQuestions, setHardQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {

        // save questions according to difficulty
        const easy = quizData.filter((q) => q.difficulty === 'easy');
        const medium = quizData.filter((q) => q.difficulty === 'medium');
        const hard = quizData.filter((q) => q.difficulty === 'hard');

        // randomize the order
        shuffleArray(easy);
        shuffleArray(medium);
        shuffleArray(hard);

        setEasyQuestions(easy);
        setMediumQuestions(medium);
        setHardQuestions(hard);
    }, []);

    const handleCircleClick = (circle) => {

        // is circle even reachable from current circle?
        const isReachable = pathGraph[currentCircle].reachable.includes(circle);
        if (!isReachable) {
            // TODO: maybe some effect when you click on wrong circle?
            console.log(`Not reachable from ${currentCircle}`);
            return;
        }

        // is the quiz quiz finished?
        if (circle === 'goal') {
            // TODO: what happens when you win
            console.log('Congratulations, you won !!! :)');
            return;
        }

        // which difficulty pool to choose question from
        const questions = pathGraph[circle].difficulty === 'easy' ? easyQuestions
            : pathGraph[circle].difficulty === 'medium' ? mediumQuestions
                : hardQuestions;

        // if there are still questions left, ask last question of array and delete it
        if (questions.length > 0) {
            const selected = questions.pop();
            setSelectedQuestion(selected); // save which question is currently used
            setCompletedQuestionsIDs([...completedQuestionsIDs, selected.id]); // save its id for progress

            // save new questions array in state, according to difficulty
            switch (pathGraph[circle].difficulty) {
                case 'easy':
                    setEasyQuestions(questions);
                case 'medium':
                    setMediumQuestions(questions);
                case 'hard':
                    setHardQuestions(questions);
            }

            // TODO: what happens in question depending on type
            switch (selected.type) {
                case 'question':
                    console.log('question: ' + selected.question);
                case 'matching':
                    console.log('matching: ' + selected.question);
                case 'sorting':
                    console.log('sorting: ' + selected.question);
            }
        } else {
            // TODO: what happens when question pool of one difficult is empty
            console.log('No more questions of difficulty: ', pathGraph[circle].difficulty);
        }

        setCurrentCircle(circle);
    }

    const renderBoard = () => {
        const circleColors = { easy: '#77d1cb', medium: '#8377d1', hard: '#d177b3', goal: 'gold', completed: '#817c9c', unreachable: '#d4d2dd' };

        const handleCircleHover = (event) => {
            event.target.parentNode.querySelector('circle').style.opacity = '80%';
        };

        const handleCircleLeave = (event) => {
            event.target.parentNode.querySelector('circle').style.opacity = '100%';
        };

        const circles = Object.keys(pathGraph);

        return circles.map((circle) => {
            const isReachable = pathGraph[currentCircle].reachable.includes(circle);
            const fillColor = isReachable ? circleColors[pathGraph[circle].difficulty] : circleColors.unreachable;

            return (
                <g key={circle} onClick={() => handleCircleClick(circle)}>
                    <circle
                        key={circle}
                        cx={pathGraph[circle].x}
                        cy={pathGraph[circle].y}
                        r={circle === 'start' || circle === 'goal' ? '6%' : '3.5%'}
                        fill={fillColor}
                        stroke={circle === currentCircle ? 'white' : 'none'}
                        strokeWidth={circle === currentCircle ? '6px' : 'none'}
                        style={{ cursor: 'pointer' }}
                        onMouseOver={handleCircleHover}
                        onMouseLeave={handleCircleLeave}
                    />
                    <text
                        x={pathGraph[circle].x}
                        y={pathGraph[circle].y}
                        dy="5px"
                        textAnchor="middle" // text horizontally
                        fill="black"
                        fontSize="12px"
                        style={{ cursor: 'pointer' }}
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
            <svg style={svgBoard} width="1300px" height="800px">
                {renderBoard()}
            </svg>
            <p>maybe Footer later</p>
        </div>
    )
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