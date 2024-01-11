import QuestionExercise from "./QuestionExercise";
import MatchingExercise from "./MatchingExercise";
import SortingExercise from "./SortingExercise";
import bulbIcon from '../data/images/bulb.png';
import swapIcon from '../data/images/swap.png';
import { useState } from "react";

const Exercise = ({ exercise, active, onAnswer, onUpdate }) => {
    const [checkClicked, setCheckClicked] = useState(false);

    const renderExerciseType = (exercise) => {
        switch (exercise.type) {
            case 'question':
                return <QuestionExercise exercise={exercise} onAnswer={handleAnswer}/>;
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

    const handleAnswer = (isCorrect) => {
        setCheckClicked(true);
        onAnswer(isCorrect);
    }

    return (
        <div style={exerciseContainer}>
            <div className="flex row h-full">
                <div style={joker_row}>
                    <h3 className="pb-10">Joker:</h3>
                    <div style={joker} className="img-container hover:opacity-80">
                        <img src={bulbIcon} className="h-16" alt="Glühbirnen Icon" />
                    </div>
                    <div style={joker} className="img-container hover:opacity-80">
                        <img src={swapIcon} className="h-12" alt="Glühbirnen Icon" />
                    </div>
                </div>
                <div style={line}></div>
                <div className="flex flex-col">{renderExerciseType(exercise)}</div>
            </div>
            <div className="flex row justify-between">
                <h3>{getExerciseNumber(active)}/24</h3>
                {checkClicked && <div className="text-blue-500 cursor-pointer hover:text-blue-400 font-bold" onClick={onUpdate}>Weiter im Quiz</div>}
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
    width: '150px'
}

const joker = {
    height: '100px',
    width: '100px',
    cursor: 'pointer',
    margin: '10px',
    backgroundColor: 'white',
    borderRadius: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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