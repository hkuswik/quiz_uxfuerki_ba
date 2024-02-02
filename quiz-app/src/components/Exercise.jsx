import QuestionExercise from "./QuestionExercise";
import MatchingExercise from "./MatchingExercise";
import SortingExercise from "./SortingExercise";
import bulbIcon from '../data/images/bulb.png';
import swapIcon from '../data/images/swap.png';
import fortfahrenIcon from '../data/images/continue_logo.png';
import avatarLila from '../data/images/avatar_lila.png';
import avatarTürkis from '../data/images/avatar_türkis.png';
import avatarPink from '../data/images/avatar_pink.png';
import { useEffect, useState } from "react";

// popup content for exercises; displays joker row, exercise number and renders specific exercise type
const Exercise = ({ exercise, active, onAnswer, onUpdate, onJoker, jokerUsed }) => {
    const [checkClicked, setCheckClicked] = useState(false);
    const [exerciseNr, setExerciseNr] = useState(null);

    const [tip, setTip] = useState(null);
    const [tipAvatar, setTipAvatar] = useState(null);
    const [showTipPopup, setShowTipPopup] = useState(false);

    useEffect(() => {
        // set checkClicked to false for every new exercise
        setCheckClicked(false);
        // set correct tip for every new exercise
        setTip(exercise.tip);

        // set correct avatar (with correct color elements) depending on exercise topic
        switch (exercise.difficulty) {
            case 'easy':
                setTipAvatar(avatarPink);
                break;
            case 'medium':
                setTipAvatar(avatarLila);
                break;
            case 'hard':
                setTipAvatar(avatarTürkis);
                break;
            default:
                console.log('error setting avatar');
        };
    }, [exercise]);

    useEffect(() => {
        // exerciseNr only possible if active circle is an exercise
        if (active.includes('circle')) {
            // calculate current exerciseNr (if check clicked: -1, since active gets already updated onAnswer)
            if (checkClicked) {
                setExerciseNr(active.substring(active.indexOf('e') + 1) - 1);
            } else {
                setExerciseNr(active.substring(active.indexOf('e') + 1));
            }
        };
    }, [checkClicked, active]);

    // render correct exercise type
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
    };

    // when answers is logged in, set checkClicked to true and forward it
    const handleAnswer = (isCorrect) => {
        setCheckClicked(true);
        onAnswer(isCorrect);
    };

    // logic for clicking a joker (only 1 joker is allowed per exercise)
    const handleJokerClick = (joker) => {
        if (jokerUsed === 'swap') { // if already used 'swap', nothing happens onClick
            return;
        } else if (jokerUsed === 'tip') { 
            // if already used 'tip', user can reclick on 'tip' and see tip again (but not 'swap' anymore)
            if (joker === 'tip') {
                setShowTipPopup(true);
            };
        } else { // no joker yet used 
            if (joker === 'tip') {
                onJoker('tip');
                setShowTipPopup(true);
            } else {
                onJoker('swap'); // swapping happens in Quiz.jsx
            };
        };
    };

    // prevent popup from closing when popup itself is clicked
    const handleTipClick = (event) => {
        event.stopPropagation();
    };

    // styles for tip and swap joker (inside scope because needs to know if check was clicked)
    const tip_joker = {
        ...joker,
        ...({
            backgroundColor:
                checkClicked
                    ? '#D4D2DD'
                    : jokerUsed !== null
                        ? jokerUsed === 'swap'
                            ? '#D4D2DD'
                            : 'white'
                        : 'white'
        })
    };
    const swap_joker = {
        ...joker,
        ...({ backgroundColor: checkClicked || jokerUsed !== null ? '#D4D2DD' : 'white' })
    };

    return (
        <div style={exerciseContainer}>
            <div className="flex row h-full mr-5">
                <div style={joker_row}>
                    <h4 className="pb-4">Joker:</h4>
                    <div onClick={() => handleJokerClick('tip')} style={tip_joker} className={(!(jokerUsed === 'swap') && !checkClicked ? 'hover:opacity-85 cursor-pointer' : '')}>
                        <img src={bulbIcon} className="h-16" alt="Glühbirnen Icon" />
                    </div>
                    <div onClick={() => handleJokerClick('swap')} style={swap_joker} className={((jokerUsed === null) && !checkClicked ? 'hover:opacity-85 cursor-pointer' : '')}>
                        <img src={swapIcon} className="h-12" alt="Frage wechseln Icon" />
                    </div>
                </div>
                <div style={line}></div>
                <div className="flex flex-col" style={{ width: '750px' }}>{renderExerciseType(exercise)}</div>
            </div>
            <div className="flex row justify-between items-end h-12 relative bottom-0">
                <h4>{exerciseNr}/24</h4>
                {checkClicked &&
                    <div className="img-container">
                        <img src={fortfahrenIcon} className=" h-11 hover:opacity-85 cursor-pointer" onClick={onUpdate} alt="mit Quiz fortfahren" />
                    </div>
                }
            </div>
            {showTipPopup &&
                <div style={tipPopupContainer} onClick={() => setShowTipPopup(false)}>
                    <div style={tipPopupContent} onClick={handleTipClick}>
                        <div className="flex row justify-end mr-4 mt-3">
                            <div onClick={() => setShowTipPopup(false)} className="relative right-0 text-2xl font-medium cursor-pointer hover:opacity-80">X</div>
                        </div>
                        <div className="flex row justify-center h-full">
                            <div className="img-container flex flex-col h-full justify-center">
                                <img src={tipAvatar} className="h-30 mt-20" alt="Avatar Tipp Joker" />
                            </div>
                            <div className="flex flex-col h-full justify-center">
                                <div className="speech-bubble mb-36 -ml-6">
                                    <div className="text-center">{tip}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

// styles
const exerciseContainer = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
};

const joker_row = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '150px'
};

const joker = {
    height: '120px',
    width: '120px',
    margin: '10px',
    borderRadius: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
};

const line = {
    height: '650px',
    width: '4px',
    backgroundColor: '#21202b',
    borderRadius: '99px',
    marginLeft: '20px',
    marginRight: '30px'
};

const tipPopupContainer = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const tipPopupContent = {
    backgroundColor: 'white',
    height: '500px',
    width: '650px',
    marginLeft: '150px',
    borderRadius: '10px',
    boxShadow: '2px 3px 5px #999',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
};

export default Exercise;