import QuestionExercise from "./QuestionExercise";
import MatchingExercise from "./MatchingExercise";
import SortingExercise from "./SortingExercise";
import bulbIcon from '../data/images/bulb.png';
import swapIcon from '../data/images/swap.png';
import fortfahrenIcon from '../data/images/continue_logo.png';
import { useEffect, useState } from "react";

const Exercise = ({ exercise, active, onAnswer, onUpdate }) => {

    // TODO: add joker behaviour
    // TODO: joker NOT clickable when answer clicked (& no hover-effect)
    // TODO: stop little movement of content when buttons change

    const [checkClicked, setCheckClicked] = useState(false);
    const [exerciseNr, setExerciseNr] = useState(null);

    useEffect(() => {
        // set checkClicked to false for every new exercise
        setCheckClicked(false);
    }, [exercise]);

    useEffect(() => {
        // exerciseNr only possible if active circle is an exercise
        if (active.includes('circle')) {
            // calculate current exerciseNr (if check clicked -1, since active has been already updated)
            if (checkClicked) {
                setExerciseNr(active.substring(active.indexOf('e') + 1) - 1);
            } else {
                setExerciseNr(active.substring(active.indexOf('e') + 1));
            }
        }
    }, [checkClicked, active]);

    const renderExerciseType = (exercise) => {
        switch (exercise.type) {
            case 'question':
                return <QuestionExercise exercise={exercise} onAnswer={handleAnswer} />;
            case 'match':
                return <MatchingExercise exercise={exercise} onAnswer={handleAnswer} />;
            case 'sort':
                return <SortingExercise exercise={exercise} onAnswer={handleAnswer} />;
            default:
                return <div> error exercise type </div>;
        };
    }

    const handleAnswer = (isCorrect) => {
        setCheckClicked(true);
        onAnswer(isCorrect);
    }

    return (
        <div style={exerciseContainer}>
            <div className="flex row h-full mr-6">
                <div style={joker_row}>
                    <h4 className="pb-4">Joker:</h4>
                    <div style={joker} className="img-container hover:opacity-85">
                        <img src={bulbIcon} className="h-16" alt="Glühbirnen Icon" />
                    </div>
                    <div style={joker} className="img-container hover:opacity-85">
                        <img src={swapIcon} className="h-12" alt="Glühbirnen Icon" />
                    </div>
                </div>
                <div style={line}></div>
                <div className="flex flex-col" style={{width: '750px'}}>{renderExerciseType(exercise)}</div>
            </div>
            <div className="flex row justify-between items-end h-12 relative bottom-0">
                <h4>{exerciseNr}/24</h4>
                {checkClicked &&
                    <div className="img-container">
                        <img src={fortfahrenIcon} className=" h-11 hover:opacity-85 cursor-pointer" onClick={onUpdate} alt="mit Quiz fortfahren" />
                    </div>
                }
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
    height: '100%',
    width: '4px',
    backgroundColor: '#21202b',
    borderRadius: '99px',
    marginLeft: '20px',
    marginRight: '30px'
}

export default Exercise;