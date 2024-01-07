import QuestionExercise from "./QuestionExercise";
import MatchingExercise from "./MatchingExercise";
import SortingExercise from "./SortingExercise";

const Popup = ({ onClose, exercise }) => {

    const renderPopupContent = (exercise) => {
        switch (exercise.type) {
            case 'question':
                return <QuestionExercise exercise={exercise} />;
            case 'match':
                return <MatchingExercise exercise={exercise} />;
            case 'sort':
                return <SortingExercise exercise={exercise} />;
            default:
                return <div> something else </div>;
        };
    };

    return (
        <div style={style} onClick={onClose}>
            <div style={popupContentStyle}>
                {renderPopupContent(exercise)}
                <button className="bg-pink-500" onClick={onClose}>Close</button>
            </div>
        </div>
    )
};

const style = {
    background: 'rgba(0, 0, 0, 0.5)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const popupContentStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    width: '100%',
};

export default Popup;