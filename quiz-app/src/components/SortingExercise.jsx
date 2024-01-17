const SortingExercise = ({exercise, onAnswer}) => {

    // TODO: functionality
    return (
        <div>
            <p>sorting: {exercise.question}</p>
            <p>{exercise.difficulty}</p>
            <div className="flex row justify-end">
                <div className='text-pink-500 font-bold hover:text-pink-400 hover:cursor-pointer' onClick={() => onAnswer(true)}>Correct Answer!!!</div>
            </div>
        </div>
    );
};

export default SortingExercise;