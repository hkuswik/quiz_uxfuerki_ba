const MatchingExercise = ({exercise, onAnswer}) => {

    return (
        <div>
            <p>matching: {exercise.question}</p>
            <p>{exercise.difficulty}</p>
            <div className="flex row justify-end">
                <div className='text-pink-500 font-bold hover:text-pink-400 hover:cursor-pointer' onClick={() => onAnswer(true)}>Answer!!!</div>
            </div>
        </div>
    );
};

export default MatchingExercise;