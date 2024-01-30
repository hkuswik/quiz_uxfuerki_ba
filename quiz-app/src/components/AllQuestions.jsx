import { useState } from 'react';
import quizData from '../data/questions_onlyUX.json';

const topic1 = 'easy';
const topic2 = 'medium';
const topic3 = 'hard';

const correctColor = '#7AD177';
const wrongColor = '#D24141';

const AllQuestions = () => {
    // save exercies according to topic
    const firstTopic = quizData.filter((q) => q.difficulty === topic1);
    const secondTopic = quizData.filter((q) => q.difficulty === topic2);
    const thirdTopic = quizData.filter((q) => q.difficulty === topic3);

    // save all exercises in one array in topic order
    const allExercises = firstTopic.concat(secondTopic).concat(thirdTopic);

    // save state for first exercise
    const [exercise, setExercise] = useState(allExercises[0]);

    const renderExercise = (exercise) => {
        const color = getColor(exercise.difficulty);

        switch (exercise.type) {
            case 'question':
                const answers = exercise.wrongAnswers.split(';');
                answers.push(exercise.correctAnswer);
                shuffleArray(answers);

                return (
                    <div className='ml-10 mr-10'>
                        <div style={{ ...question_style, background: color }}>{exercise.question}</div>
                        <div className='flex row flex-wrap justify-center mb-24'>
                            {answers.map((answer, index) => {
                                return (
                                    <div key={index} style={{
                                        ...answer_style,
                                        background: answer === exercise.correctAnswer ? correctColor : '#D4D2DD'
                                    }}>
                                        {answer}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'match':
                return (
                    <div>quest</div>
                );
            case 'sort':
                return (
                    <div>quest</div>
                );
            default:
                return <div>some error rendering :/</div>;
        };
    };

    const getColor = (topic) => {
        switch (topic) {
            case 'easy':
                return '#D177B3';
            case 'medium':
                return '#8377D1';
            default:
                return '#77D1CB';
        };
    };

    const handleLeftClick = () => {
        const index = allExercises.indexOf(exercise);
        if (index === 0) {
            setExercise(allExercises[allExercises.length - 1]);
            return;
        };
        setExercise(allExercises[index - 1]);
    };

    const handleRightClick = () => {
        const index = allExercises.indexOf(exercise);
        if (index === allExercises.length - 1) {
            setExercise(allExercises[0]);
            return;
        };
        setExercise(allExercises[index + 1]);
    };

    return (
        <div>
            {renderExercise(exercise)}
            <div className="flex row justify-between items-end relative bottom-0">
                <div className='flex w-14 justify-start'>
                    <h5 style={{ color: getColor(exercise.difficulty) }}>{exercise.difficulty}</h5>
                </div>
                <div className='flex row justify-self-center'>
                    <div onClick={() => handleLeftClick()} style={left_arrow} className='hover:opacity-70'></div>
                    <div onClick={() => handleRightClick()} style={right_arrow} className='hover:opacity-70'></div>
                </div>
                <div className='flex w-14 justify-end'>
                    <h5>{allExercises.indexOf(exercise) + 1}/{allExercises.length}</h5>
                </div>
            </div>
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

const left_arrow = {
    width: '0',
    height: '0',
    borderTop: '30px solid transparent',
    borderBottom: '30px solid transparent',
    borderRight: '40px solid #21202B',
    cursor: 'pointer'
};

const right_arrow = {
    width: '0',
    height: '0',
    borderTop: '30px solid transparent',
    borderBottom: '30px solid transparent',
    borderLeft: '40px solid #21202B',
    marginLeft: '40px',
    cursor: 'pointer'
};

const question_style = {
    fontWeight: '600',
    width: '100%',
    height: 'auto',
    padding: '20px',
    marginBottom: '50px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: '8px'
}

const answer_style = {
    height: 'auto',
    minHeight: '150px',
    width: '360px',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '8px',
    margin: '10px',
}

export default AllQuestions;