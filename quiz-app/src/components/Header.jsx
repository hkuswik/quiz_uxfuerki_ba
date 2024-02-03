import { useState } from 'react';
import logo from '../data/images/Wegweiser_logo.png';
import resetBtn from '../data/images/reset-btn.png';
import allQuestionsBtn from '../data/images/AlleFragen.png';
import Popup from './Popup';

const topic1 = 'easy';
const topic2 = 'medium';
const topic3 = 'hard';

// the header displays the quiz' name, progressBar, reset button and allQuestions button
const Header = ({ onReset, doneInTopic, correctInTopic }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState(null);

    // open popup with content depending on which button was clicked
    const handleBtnClick = (content) => {
        setPopupContent(content);
        setShowPopup(true);
    };

    // close popup automatically if quiz is reset and forward reset call to Quiz.jsx
    const handleReset = () => {
        setShowPopup(false);
        onReset();
    };

    return (
        <div className='header-bg'>
            <div className='header'>
                <div className='flex row justify-around'>
                    <h1>Das</h1>
                    <div id='header-logo' className='img-container cursor-pointer'>
                        <img src={logo} alt="Wegweiser.UX-für-KI Logo" />
                    </div>
                    <h1>Quiz</h1>
                </div>
                <div className='flex row justify-around items-center'>
                    <p className='text-white mr-4'>Fortschritt:</p>
                    <ProgressBar doneInTopic={doneInTopic} correctInTopic={correctInTopic} />
                    <div onClick={() => handleBtnClick('reset')} className='img-container h-5 cursor-pointer ml-4 hover:opacity-85'>
                        <img src={resetBtn} alt="Fortschritt zurücksetzen Button" />
                    </div>
                </div>
                <div onClick={() => handleBtnClick('alleFragen')} id='all-quest' className='img-container border-dashed border-white border-2 rounded-lg hover:border-solid hover:cursor-pointer'>
                    <img src={allQuestionsBtn} alt="Alle Fragen Button" />
                </div>
            </div>
            {showPopup &&
                <Popup onClose={() => setShowPopup(false)} content={popupContent} onReset={handleReset} />
            }
        </div>
    );
};

// displays how many exercises are done in each topic and how many of those were correct
const ProgressBar = ({ doneInTopic, correctInTopic }) => {
    const exercisesPerTopic = 8;

    // calculate percentage of completion (for topic)
    const calculateSectionWidth = (topic) => {
        return (doneInTopic[topic] / exercisesPerTopic) * 100;
    };

    // calculate percentage of correctly completed for topic
    const calculateCorrect = (topic) => {
        return (correctInTopic[topic] / exercisesPerTopic) * 100;
    };

    return (
        <div className='progress-bar'>
            <div className='progress-section'>
                <div className='progress'
                    style={{
                        width: `${calculateSectionWidth(topic1)}%`,
                        backgroundColor: '#D177B3',
                        opacity: '50%',
                    }}></div>
                <div className='progress'
                    style={{
                        width: `${calculateCorrect(topic1)}%`,
                        backgroundColor: '#D177B3',
                    }}
                ></div>
            </div>
            <div className='progress-section'>
                <div className='progress'
                    style={{
                        width: `${calculateSectionWidth(topic2)}%`,
                        backgroundColor: '#8377D1',
                        opacity: '50%',
                    }}
                ></div>
                <div className='progress'
                    style={{
                        width: `${calculateCorrect(topic2)}%`,
                        backgroundColor: '#8377D1',
                    }}
                ></div>
            </div>
            <div className='progress-section'>
                <div className='progress'
                    style={{
                        width: `${calculateSectionWidth(topic3)}%`,
                        backgroundColor: '#77D1CB',
                        opacity: '50%',
                    }}
                ></div>
                <div className='progress'
                    style={{
                        width: `${calculateCorrect(topic3)}%`,
                        backgroundColor: '#77D1CB',
                    }}
                ></div>
            </div>
        </div>
    );
};

export default Header;