import { useState, useEffect } from 'react';
import Exercise from './Exercise';
import Feedback from './Feedback';
import Start from './Start';
import Szenario from './Szenario';
import Disclaimer from './Disclaimer';

const topic1 = 'UX Grundlagen';
const topic2 = 'UCD Prozess';
const topic3 = 'Evaluation';

// empty popup component that renders all popup types
const Popup = ({ onClose, content, active, currentTopic, onAnswer, onUpdate, onRepeat,
    onJoker, jokerUsed, correctAmount, jokerAmount, completedAtLeastOnce, onReset }) => {

    const [bgColor, setBgColor] = useState('#F6F5FC');
    const isExercise = (content.type === 'question' || content.type === 'match' || content.type === 'sort');

    // set (lighter) background color depending on topic
    useEffect(() => {
        switch (content.topic) {
            case topic1:
                setBgColor('#E8BBD9');
                break;
            case topic2:
                setBgColor('#C1BBE8');
                break;
            case topic3:
                setBgColor('#BBE8E5');
                break;
            default:
                setBgColor('#F6F5FC');
        };
    }, [content]);

    // renders popup content depending on popup type
    const renderPopupContent = (content) => {
        if (isExercise) {
            return <Exercise
                exercise={content}
                active={active}
                onAnswer={onAnswer}
                onUpdate={onUpdate}
                onJoker={onJoker}
                jokerUsed={jokerUsed}
            />
        } else {
            switch (content) {
                case 'feedback':
                    return <Feedback
                        currentTopic={currentTopic}
                        correctAmount={correctAmount}
                        jokerAmount={jokerAmount}
                        onUpdate={onUpdate}
                        onRepeat={onRepeat}
                        completedAtLeastOnce={completedAtLeastOnce}
                    />;
                case 'start':
                case 'help':
                    return <Start
                        popup_type={content}
                        onUpdate={onUpdate}
                    />
                case 'szenario1':
                case 'szenario2':
                case 'szenario3':
                    const isSzenarioActive = (active === 'szenario1' || active === 'szenario2' || active === 'szenario3');
                    return <Szenario
                        whichSzenario={content}
                        onUpdate={onUpdate}
                        showBtn={isSzenarioActive}
                    />;
                case 'alleFragen':
                case 'reset':
                    return <Disclaimer content={content} onReset={onReset} />
                default:
                    return <div> error non-exercise type </div>;
            };
        };
    };

    // prevent popup from closing when popup itself is clicked
    const handlePopupClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div style={popupContainer} onClick={onClose}>
            <div style={{ ...popupContent, background: bgColor }} className='popup-size' onClick={handlePopupClick}>
                <div className='flex row justify-end'>
                    <div onClick={onClose} id='close-btn' className="font-medium cursor-pointer hover:opacity-80">X</div>
                </div>
                {renderPopupContent(content)}
                <div></div>
            </div>
        </div>
    );
};

// styles
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
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
};

export default Popup;