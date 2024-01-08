import QuestionExercise from "./QuestionExercise";
import MatchingExercise from "./MatchingExercise";
import SortingExercise from "./SortingExercise";

const Popup = ({ onClose, content, completedTopics }) => {

    const renderPopupContent = (content) => {
        if (content.type === 'question' || content.type === 'match' || content.type === 'sort') {
            switch (content.type) {
                case 'question':
                    return <QuestionExercise exercise={content} />;
                case 'match':
                    return <MatchingExercise exercise={content} />;
                case 'sort':
                    return <SortingExercise exercise={content} />;
                default:
                    return <div> error exercise type </div>;
            };
        } else {
            switch (content) {
                case 'feedback':
                    return <div> feedback, real topic: {completedTopics}</div>;
                case 'goal':
                    return <div>goal, real topic: {completedTopics + 1}</div>;
                case 'start':
                    return <div>start</div>;
                case 'szenario1':
                case 'szenario2':
                case 'szenario3':
                    return <div>szenarioo, numero {completedTopics + 1}</div>;
                default:
                    return <div> error non-exercise type </div>;
            }
        }
    };

    const whichTopic = (completed) => {
        switch (completed) {
            case 0:
                return 'Topic 1';
            case 1:
                return 'Topic 2';
            case 2:
                return 'Topic 3';
            case 3:
                return 'all done! :)';
            default:
                return 'Error wrong Topic completed number...';
        }
    }

    return (
        <div style={style} onClick={onClose}>
            <div style={popupContentStyle}>
                {renderPopupContent(content)}
                <button className="bg-pink-500" onClick={onClose}>Close</button>
                <p>{completedTopics} also {whichTopic(completedTopics)}</p>
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