import { useState, useEffect } from 'react';
import Exercise from './Exercise';
import Feedback from './Feedback';
import Start from './Start';
import Szenario from './Szenario';

const Popup = ({ onClose, content, active, completedTopics, onAnswer, onUpdate, correctInTopic }) => {
    const [bgColor, setBgColor] = useState('#F6F5FC');
    const isExercise = (content.type === 'question' || content.type === 'match' || content.type === 'sort');

    useEffect(() => {
        switch (content.difficulty) {
            case 'easy':
                setBgColor('#E8BBD9');
                break;
            case 'medium':
                setBgColor('#C1BBE8');
                break;
            case 'hard':
                setBgColor('#BBE8E5');
                break;
            default:
                setBgColor('#F6F5FC');
        }
        console.log(content);
    }, [content])

    /* const handleAnswer = (isCorrect) => {
        console.log('Question was answered correctly: ', isCorrect);
    } */

    const renderPopupContent = (content) => {
        if (isExercise) {
            return <Exercise exercise={content} active={active} onAnswer={onAnswer} onUpdate={onUpdate} />
        } else {
            switch (content) {
                case 'feedback':
                    return <Feedback completedTopic={whichTopic(completedTopics)} correctInTopic={correctInTopic} onUpdate={onUpdate}
                    />;
                case 'goal':
                    return <div>goal, real topic: {completedTopics + 1}</div>;
                case 'start':
                    return <Start onUpdate={onUpdate} />
                // TODO: different szenario design if szenario is/isn't active! (no continue button)
                case 'szenario1':
                case 'szenario2':
                case 'szenario3':
                    const isSzenarioActive = (active === 'szenario1' || active === 'szenario2' || active === 'szenario3');
                    return <Szenario whichSzenario={completedTopics + 1} onUpdate={onUpdate} showBtn={isSzenarioActive} />;
                case 'alleFragen':
                    return <div>Alle Fragen</div>
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

    const handlePopupClick = (event) => {
        // prevent popup from closing when popup itself is clicked
        event.stopPropagation();
    }

    return (
        <div style={popupContainer} onClick={onClose}>
            <div style={{ ...popupContent, background: bgColor }} onClick={handlePopupClick}>
                <div className='flex column justify-end'>
                    <div onClick={onClose} className="text-2xl font-medium cursor-pointer hover:opacity-80">X</div>
                </div>
                {renderPopupContent(content)}
            </div>
        </div>
    )
};

const popupContainer = {
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

const popupContent = {
    padding: '20px',
    borderRadius: '8px',
    width: '900px',
    height: '700px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
};

export default Popup;