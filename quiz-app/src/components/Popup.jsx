import { useState, useEffect } from 'react';
import Exercise from './Exercise';

const Popup = ({ onClose, content, active, completedTopics, onAnswer, onUpdate }) => {
    const [bgColor, setBgColor] = useState('#F6F5FC');
    const isExercise = active.includes('circle');
    const isSzenario = (content === 'szenario1' || content === 'szenario2' || content === 'szenario3');
    const isSzenarioActive = (active === 'szenario1' || active === 'szenario2' || active === 'szenario3');
    const showUpdateBtn = !isSzenario || (isSzenario && isSzenarioActive);

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
    }, [content])

    /* const handleAnswer = (isCorrect) => {
        console.log('Question was answered correctly: ', isCorrect);
    } */

    const renderPopupContent = (content) => {
        if (isExercise) {
            return <Exercise exercise={content} active={active} onAnswer={onAnswer}/>
        } else {
            switch (content) {
                case 'feedback':
                    return <div> feedback, real topic: {completedTopics}</div>;
                case 'goal':
                    return <div>goal, real topic: {completedTopics + 1}</div>;
                case 'start':
                    return <div>start</div>;
                // TODO: different szenario design if szenario is/isn't active! (no continue button)
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

    const handlePopupClick = (event) => {
        // prevent popup from closing when popup itself is clicked
        event.stopPropagation();
    }

    return (
        <div style={popupContainer} onClick={onClose}>
            <div style={{ ...popupContent, background: bgColor }} onClick={handlePopupClick}>
                <div className="flex row justify-end">
                    <div onClick={onClose} className="close-btn">X</div>
                </div>
                {renderPopupContent(content)}
                <div className="flex row justify-end">
                    {showUpdateBtn && <div className='text-pink-500 font-bold hover:text-pink-400 hover:cursor-pointer' onClick={onUpdate}>Update!!!</div>}
                </div>
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