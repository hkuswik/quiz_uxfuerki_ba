import { useState } from 'react';
import logo from '../data/images/Wegweiser_logo.png';
import resetBtn from '../data/images/reset-btn.png';
import allQuestionsBtn from '../data/images/AlleFragen.png';
import Popup from './Popup';
import ProgressBar from './ProgressBar';

// the header displays the quiz' name, progressBar, reset button and allQuestions button
const Header = ({ onReset, doneInTopic, correctInTopic }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState('');

    // open popup with content depending on which button was clicked
    const handleBtnClick = (content) => {
        setPopupContent(content);
        setShowPopup(true);
    };

    // close popup automatically if quiz is reset and forward reset call to parent
    const handleReset = () => {
        setShowPopup(false);
        onReset();
    };

    return (
        <div className='header-bg'>
            <div className='header'>
                <div className='flex row w-1/3 justify-start'>
                    <h1>Das</h1>
                    <div id='header-logo' className='img-container'>
                        <img src={logo} alt="Wegweiser.UX-für-KI Logo" />
                    </div>
                    <h1>Quiz</h1>
                </div>
                <div className='flex row justify-around items-center'>
                    <p className='text-white mr-4'>Fortschritt:</p>
                    <ProgressBar doneInTopic={doneInTopic} correctInTopic={correctInTopic} />
                    <div onClick={() => handleBtnClick('reset')} className='img-container h-5 cursor-pointer ml-4 hover:opacity-80'>
                        <img src={resetBtn} alt="Fortschritt zurücksetzen Button" />
                    </div>
                </div>
                <div className='w-1/3 flex justify-end'>
                    <div onClick={() => handleBtnClick('alleFragen')} id='all-quest' className='img-container border-dashed border-white border-2 rounded-lg hover:border-solid hover:cursor-pointer'>
                        <img src={allQuestionsBtn} alt="Alle Fragen Button" />
                    </div>
                </div>
            </div>
            {showPopup &&
                <Popup onClose={() => setShowPopup(false)} content={popupContent} onReset={handleReset} />
            }
        </div>
    );
};

export default Header;