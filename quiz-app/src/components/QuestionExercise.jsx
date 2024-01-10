import { useEffect, useState } from "react";

const QuestionExercise = ({ exercise, onAnswer }) => {
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        randomizeAnswers(exercise);
    }, [exercise]);

    const handleAnswerClick = (selected) => {
        const isCorrect = false;
        onAnswer(isCorrect);
    }

    const randomizeAnswers = (exercise) => {
        const allAnswers = exercise.wrongAnswers.split(';');
        allAnswers.push(exercise.correctAnswer);
        shuffleArray(allAnswers);
        setAnswers(allAnswers);
    }

    return (
        <div className='Question'>
            <div>{exercise.question}</div>

            {answers.map((answer, index) => (
                <div key={index} className='Answer'>{answer}</div>
            ))}

            <div onClick={handleAnswerClick}>Check</div>
        </div>
    )
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

export default QuestionExercise;