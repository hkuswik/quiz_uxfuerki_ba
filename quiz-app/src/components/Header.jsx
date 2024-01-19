import { useState } from 'react';
import logo from '../data/images/Wegweiser_logo.png';
import resetBtn from '../data/images/reset-btn.png';
import allQuestionsBtn from '../data/images/AlleFragen.png';
import Popup from './Popup';

// TODO: add correct reset button
// TODO: add progressBar (design + functionality)
// TODO: add disclaimers for allQuestions / resetting progress

const Header = ({ onReset }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleBtnClick = () => {
        console.log('Alle Fragen Button wurde geklickt!');
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
                    <p>long progressbar</p>
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