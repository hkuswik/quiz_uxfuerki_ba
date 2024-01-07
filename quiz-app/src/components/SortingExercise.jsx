const SortingExercise = ({exercise}) => {

    return (
        <div>
            <p>sorting: {exercise.question}</p>
            <p>{exercise.difficulty}</p>
        </div>
    );
};

export default SortingExercise;