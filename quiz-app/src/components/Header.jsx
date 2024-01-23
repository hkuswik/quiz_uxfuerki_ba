import { useState } from 'react';
import logo from '../data/images/Wegweiser_logo.png';
import resetBtn from '../data/images/reset-btn.png';
import allQuestionsBtn from '../data/images/AlleFragen.png';
import Popup from './Popup';

// TODO: add disclaimers for allQuestions / resetting progress
const ProgressBar = ({ doneInTopic, correctInTopic }) => {

    const exercisesPerTopic = 8;

    // calculate percentage of completion (for topic)
    const calculateSectionWidth = (topic) => {
        console.log('topicProgress: ', (doneInTopic[topic] / exercisesPerTopic) * 100);
        return (doneInTopic[topic] / exercisesPerTopic) * 100;
    };

    return (
        <div style={progress_bar}>
            <div style={progress_section}>
                <div style={{
                    ...progress,
                    width: `${calculateSectionWidth(1)}%`,
                    backgroundColor: '#D177B3',
                }}></div>
            </div>
            <div style={progress_section}>
                <div style={{
                    ...progress,
                    width: `${calculateSectionWidth(2)}%`,
                    backgroundColor: '#8377D1',
                }}></div>
            </div>
            <div style={progress_section}>
                <div style={{
                    ...progress,
                    width: `${calculateSectionWidth(3)}%`,
                    backgroundColor: '#77D1CB',
                }}></div>
            </div>
        </div>
    )
};

const progress_bar = {
    display: 'flex',
    height: '25px',
    width: '250px',
    backgroundColor: '#54506A',
    borderRadius: '10px',
    overflow: 'hidden',
    justifyContent: 'space-between'
}

const progress_section = {
    width: '82px',
    height: '100%',
    backgroundColor: '#D4D2DD',
}

const progress = {
    height: '100%',
    transition: 'width 0.3s ease'
}

const Header = ({ onReset, doneInTopic, correctInTopic }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleBtnClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div style={header_bg}>
            <div style={header_style}>
                <div className='flex row justify-around'>
                    <h1>Das</h1>
                    <div className='img-container h-24 cursor-pointer'>
                        <img src={logo} alt="Wegweiser.UX-für-KI Logo" />
                    </div>
                    <h1>Quiz</h1>
                </div>
                <div className='flex row justify-around items-center'>
                    <p className='text-white mr-4'>Fortschritt:</p>
                    <ProgressBar doneInTopic={doneInTopic} correctInTopic={correctInTopic} />
                    <div onClick={onReset} className='img-container h-5 cursor-pointer ml-4 hover:opacity-85'>
                        <img src={resetBtn} alt="Fortschritt zurücksetzen Button" />
                    </div>
                </div>
                <div onClick={handleBtnClick}
                    className='img-container h-20 border-dashed border-white border-2 rounded-lg hover:border-solid hover:cursor-pointer'>
                    <img src={allQuestionsBtn} alt="Alle Fragen Button" />
                </div>
            </div>
            {showPopup && <Popup onClose={handleClosePopup} content={'alleFragen'} active={''} />}
        </div>
    )
}

const header_style = {
    width: '1490px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    justifySelf: 'center',
    padding: '10px',
    alignItems: 'center'
}

const header_bg = {
    position: 'fixed',
    top: '0',
    display: 'flex',
    flexDirection: 'row',
    height: '125px',
    backgroundColor: '#2D2C36',
    width: '100%',
    justifyContent: 'center'
}

export default Header;