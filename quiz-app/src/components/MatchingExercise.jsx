const MatchingExercise = ({exercise}) => {

    return (
        <div>
            <p>matching: {exercise.question}</p>
            <p>{exercise.difficulty}</p>
        </div>
    );
};

export default MatchingExercise;