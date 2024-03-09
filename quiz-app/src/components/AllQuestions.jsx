import { useContext, useState } from 'react';
import QuizContext from './QuizContext';
import quizData from '../data/exercises_UX_byTopic.json';
import arrow_left from '../data/images/arrow_left.png';
import arrow_right from '../data/images/arrow_right.png';

// popup content that displays all exercises with their correct solutions
const AllQuestions = () => {
    const { topics, colors } = useContext(QuizContext); // get static topic and color variables

    // save exercies according to topic
    const firstTopic = quizData.filter((q) => q.topic === topics[0]);
    const secondTopic = quizData.filter((q) => q.topic === topics[1]);
    const thirdTopic = quizData.filter((q) => q.topic === topics[2]);

    // save all exercises in one array in topic order, start with first
    const allExercises = firstTopic.concat(secondTopic).concat(thirdTopic);
    const [exercise, setExercise] = useState(allExercises[0]);

    // render exercise depending on exercise type
    const renderExercise = (exercise) => {
        const color = getColor(exercise.topic); // color for design elements depending on topic

        switch (exercise.type) {
            case 'question':
                // save answers and shuffle them
                const answers = exercise.wrongAnswers.split(';');
                answers.push(exercise.correctAnswer);
                shuffleArray(answers);

                return (
                    <div className='flex flex-col ml-8 mr-8'>
                        <div style={{ ...question_style, background: color }}>{exercise.question}</div>
                        <div className='flex row flex-wrap justify-center mb-3'>
                            {answers.map((answer, index) => {
                                return (
                                    <div key={index} style={{
                                        ...answer_style,
                                        background: answer === exercise.correctAnswer ? colors.correct : colors.lightgrey
                                    }}>
                                        {answer}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'match':
                // save matches in 2-dimensional array and shuffle them
                const matches = [
                    exercise.correctPair1.split(';'),
                    exercise.correctPair2.split(';'),
                    exercise.correctPair3.split(';'),
                    exercise.correctPair4.split(';'),
                ]
                shuffleArray(matches);

                return (
                    <div className='flex flex-col ml-8 mr-8'>
                        <div className="font-semibold mb-3 rounded-lg p-3 text-center" style={{ background: color }}>{exercise.question}</div>
                        <div className='flex flex-row flex-wrap justify-center'>
                            {matches.map((match, index) => (
                                <div key={index} className='flex flex-col items-center justify-center m-2'>
                                    <div style={term_style}>{match[0]}</div>
                                    <div style={definition_style}>{match[1]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'sort':
                // save categories; save and shuffle items
                const firstCategory = exercise.firstContainer;
                const secondCategory = exercise.secondContainer;
                const items = exercise.belongsInFirst.split(';').concat(exercise.belongsInSecond.split(';'));
                shuffleArray(items);

                return (
                    <div className='flex flex-col ml-8 mr-8'>
                        <div className="font-semibold mb-4 rounded-lg p-3" style={{ background: color }}>{exercise.question}</div>
                        <div className="flex flex-col mb-3">
                            {items.map((item) => (
                                <div key={item} className="flex row justify-between mb-2 items-center">
                                    <p style={item_style} className="sm">{item}</p>
                                    <div className="flex row">
                                        <div style={{
                                            ...button_style,
                                            background: exercise.belongsInFirst.includes(item) ? colors.correct : colors.lightgrey
                                        }}>
                                            {firstCategory}
                                        </div>
                                        <div style={{
                                            ...button_style,
                                            background: exercise.belongsInSecond.includes(item) ? colors.correct : colors.lightgrey
                                        }}>
                                            {secondCategory}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div></div>
                    </div>
                );
            default:
                return <div>some error rendering :/</div>;
        };
    };

    // helper function: returns color depending on topic
    const getColor = (topic) => {
        switch (topic) {
            case topics[0]:
                return colors.pink;
            case topics[1]:
                return colors.purple;
            default:
                return colors.turquoise;
        };
    };

    // switching to previous exercise on left click (or to the last one if first one is reached)
    const handleLeftClick = () => {
        const index = allExercises.indexOf(exercise); // index of current exercise
        if (index === 0) {
            setExercise(allExercises[allExercises.length - 1]);
            return;
        };
        setExercise(allExercises[index - 1]);
    };

    // switching to next exercise on right click (or first one if last one is reached)
    const handleRightClick = () => {
        const index = allExercises.indexOf(exercise); // index of current exercise
        if (index === allExercises.length - 1) {
            setExercise(allExercises[0]);
            return;
        };
        setExercise(allExercises[index + 1]);
    };

    return (
        <div className='flex flex-col h-full w-full ml-4 mr-4 justify-between'>
            <div></div>
            {renderExercise(exercise)}
            <div className="flex row justify-between items-end justify-self-end">
                <div className='flex w-1/3 justify-start'>
                    <h5 style={{ color: getColor(exercise.topic) }}>{exercise.topic}</h5>
                </div>
                <div className='flex row justify-self-center'>
                    <div className="img-container flex flex-col h-full justify-center">
                        <img src={arrow_left} onClick={() => handleLeftClick()}
                            className="h-10 hover:opacity-70 cursor-pointer mr-3" alt="Pfeil nach links"
                        />
                    </div>
                    <div className="img-container flex flex-col h-full justify-center">
                        <img src={arrow_right} onClick={() => handleRightClick()}
                            className="h-10 hover:opacity-70 cursor-pointer" alt="Pfeil nach rechts"
                        />
                    </div>
                </div>
                <div className='flex w-1/3 justify-end'>
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

// question exercise styles
const question_style = {
    fontWeight: '600',
    width: '100%',
    height: 'auto',
    padding: '20px',
    marginBottom: '1vh',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
}

const answer_style = {
    height: 'auto',
    minHeight: '150px',
    width: '40%',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '8px',
    margin: '8px',
}

// sorting exercise styles
const item_style = {
    background: '#D4D2DD',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    width: '65%',
    padding: '5px 10px 5px 10px',
}

const button_style = {
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '10px',
    height: '30px',
    marginLeft: '10px',
    fontSize: 'calc(6px + 1vmin)',
    fontWeight: '600',
}

// matching exercise style
const term_style = {
    borderRadius: '10px',
    width: '24vw',
    maxWidth: '370px',
    textAlign: 'center',
    padding: '3px',
    background: '#D4D2DD',
    boxShadow: '2px 2px 7px #999',
}

const definition_style = {
    background: 'white',
    width: '24vw',
    maxWidth: '370px',
    height: '150px',
    padding: '7px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    fontSize: '16px',
    boxShadow: '2px 2px 7px #999',
}

export default AllQuestions;