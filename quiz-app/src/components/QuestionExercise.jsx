const QuestionExercise = ({ exercise, onAnswer }) => {

    const handleAnswerClick = (selected) => {
        const isCorrect = false;
        onAnswer(isCorrect);
    }

    return (
        <div className='Question'>
            <p>{exercise.question}</p>
            <p onClick={handleAnswerClick}>{exercise.difficulty}</p>
            <div className='Answer'></div>
            <div className='Answer'></div>
            <div className='Answer'></div>
            <div className='Answer'></div>
        </div>
    )
}

/* const style = {
    .Question {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-content: center;
        align-self: center;
        width: 70%;
    }
    
    .Answer {
        width: 500px;
        height: 300px;
        background-color: #8377d1;
        margin: 30px;
        border-radius: 10px;
        cursor: pointer;
    }
    
    .Answer:hover {
        background-color: #9185d3;
    }
} */

export default QuestionExercise;