import QuestionExercise from "./QuestionExercise";
import MatchingExercise from "./MatchingExercise";
import SortingExercise from "./SortingExercise";
import bulbIcon from '../data/images/bulb.png';
import swapIcon from '../data/images/swap.png';

const Exercise = ({ exercise, active, onAnswer }) => {

    const renderExerciseType = (exercise) => {
        switch (exercise.type) {
            case 'question':
                return <QuestionExercise exercise={exercise} onAnswer={onAnswer} />;
            case 'match':
                return <MatchingExercise exercise={exercise} />;
            case 'sort':
                return <SortingExercise exercise={exercise} />;
            default:
                return <div> error exercise type </div>;
        };
    }

    const getExerciseNumber = (active) => {
        const numberString = active.substring(active.indexOf('e') + 1);
        return numberString;
    }

    return (
        <div className='Exercise' style={exerciseContainer}>
            <div className="flex row h-full">
                <div style={joker_row}>
                    <h3 className="pb-10">Joker:</h3>
                    <div style={joker} className="img-container">
                        <img src={bulbIcon} alt="Glühbirnen Icon" />
                    </div>
                    <div style={joker} className="img-container">
                        <img src={swapIcon} alt="Glühbirnen Icon" />
                    </div>
                </div>
                <div style={line}></div>
                <div className="flex flex-col justify-center">{renderExerciseType(exercise)}</div>
            </div>
            <div className="flex row justify-between">
                <h3>{getExerciseNumber(active)}/24</h3>
            </div>
        </div>
    )
}

const exerciseContainer = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
}

const joker_row = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '200px'
}

const joker = {
    height: '70px',
    cursor: 'pointer',
    margin: '10px'
}

const line = {
    height: '95%',
    width: '4px',
    backgroundColor: '#21202b',
    borderRadius: '99px',
    marginLeft: '20px',
    marginRight: '30px'
}

export default Exercise;