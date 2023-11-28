import './Quiz.css';
import { useState, useEffect } from 'react';
import quizData from './../data/questions_onlyUX.json';

const pathGraph = {
    start: { reachable: ['circle1', 'circle15'], difficulty: 'easy', x: '8%', y: '14%' },
    circle1: { reachable: ['circle2'], difficulty: 'easy', x: '20%', y: '11%' },
    circle2: { reachable: ['circle3'], difficulty: 'easy', x: '0%', y: '0%' },
    circle3: { reachable: ['circle4'], difficulty: 'easy', x: '0%', y: '0%' },
    circle4: { reachable: ['circle5'], difficulty: 'easy', x: '0%', y: '0%' },
    circle5: { reachable: ['circle6'], difficulty: 'medium', x: '0%', y: '0%' },
    circle6: { reachable: ['circle7'], difficulty: 'medium', x: '0%', y: '0%' },
    circle7: { reachable: ['circle8'], difficulty: 'medium', x: '0%', y: '0%' },
    circle8: { reachable: ['circle9', 'circle24'], difficulty: 'medium', x: '0%', y: '0%' },
    circle9: { reachable: ['circle10'], difficulty: 'easy', x: '0%', y: '0%' },
    circle10: { reachable: ['circle11'], difficulty: 'easy', x: '0%', y: '0%' },
    circle11: { reachable: ['circle12'], difficulty: 'easy', x: '0%', y: '0%' },
    circle12: { reachable: ['circle13'], difficulty: 'hard', x: '0%', y: '0%' },
    circle13: { reachable: ['circle14'], difficulty: 'easy', x: '0%', y: '0%' },
    circle14: { reachable: ['goal'], difficulty: 'easy', x: '0%', y: '0%' },
    circle15: { reachable: ['circle16'], difficulty: 'easy', x: '15%', y: '27%' },
    circle16: { reachable: ['circle17'], difficulty: 'medium', x: '20%', y: '35%' },
    circle17: { reachable: ['circle18'], difficulty: 'medium', x: '0%', y: '0%' },
    circle18: { reachable: ['circle19', 'circle26'], difficulty: 'medium', x: '0%', y: '0%' },
    circle19: { reachable: ['circle20'], difficulty: 'hard', x: '0%', y: '0%' },
    circle20: { reachable: ['circle21'], difficulty: 'medium', x: '0%', y: '0%' },
    circle21: { reachable: ['circle22'], difficulty: 'medium', x: '0%', y: '0%' },
    circle22: { reachable: ['circle23'], difficulty: 'hard', x: '0%', y: '0%' },
    circle23: { reachable: ['goal'], difficulty: 'hard', x: '0%', y: '0%' },
    circle24: { reachable: ['circle25'], difficulty: 'easy', x: '0%', y: '0%' },
    circle25: { reachable: ['circle22'], difficulty: 'easy', x: '0%', y: '0%' },
    circle26: { reachable: ['circle27'], difficulty: 'easy', x: '0%', y: '0%' },
    circle27: { reachable: ['circle28'], difficulty: 'easy', x: '0%', y: '0%' },
    circle28: { reachable: ['circle29'], difficulty: 'easy', x: '0%', y: '0%' },
    circle29: { reachable: ['circle30'], difficulty: 'easy', x: '0%', y: '0%' },
    circle30: { reachable: ['circle22'], difficulty: 'hard', x: '0%', y: '0%' },
    goal: { reachable: [], questions: [], x: '92%', y: '92%', label: 'Ziel' }
};

function Quiz() {
    const [currentCircle, setCurrentCircle] = useState('start');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [easyQuestions, setEasyQuestions] = useState([]);
    const [mediumQuestions, setMediumQuestions] = useState([]);
    const [hardQuestions, setHardQuestions] = useState([]);

    useEffect(() => {

        const easyQ = quizData.filter((q) => q.difficulty === 'easy');
        const mediumQ = quizData.filter((q) => q.difficulty === 'medium');
        const hardQ = quizData.filter((q) => q.difficulty === 'hard');

        shuffleArray(easyQ);
        shuffleArray(mediumQ);
        shuffleArray(hardQ);

        setEasyQuestions(easyQ);
        setMediumQuestions(mediumQ);
        setHardQuestions(hardQ);
    }, []);



    var radius = "40";
    var stillWalkable = true;

    const renderBoard = () => {
        const circleColors = { easy: '#77d1cb', medium: '#8377d1', hard: '#d177b3', completed: 'grey', goal: 'white' };
        const circles = Object.keys(pathGraph);

        return circles.map((circle) => (
            <g key={circle}>
                <circle
                    key={circle}
                    cx={pathGraph[circle].x}
                    cy={pathGraph[circle].y}
                    r={circle === 'start' || circle === 'goal' ? 60 : 40}
                    fill={
                        circle === 'goal'
                            ? circleColors.goal
                            : circleColors[pathGraph[circle].difficulty]
                    }
                    style={{ cursor: pathGraph[circle].reachable.length === 1 ? 'pointer' : 'default' }}
                />
                <text
                    x={pathGraph[circle].x}
                    y={pathGraph[circle].y}
                    dy="5px"
                    textAnchor="middle" // text horizontally
                    fill="black"
                    fontSize="12px"
                >
                    {circle.toUpperCase() /*name of circle (for now)*/}
                </text>
            </g>
        ));
    };

    return (
        <div className='Quiz'>

            <svg width="1300px" height="800px">
                {renderBoard()}
            </svg>
            <p>lel</p>

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