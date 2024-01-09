import { useState } from 'react';
import logo from '../data/images/wegweiser_flat.png';
import allQuestionsBtn from '../data/images/AlleFragen.png';
import Popup from './Popup';

function Header({ onReset }) {
    const [showPopup, setShowPopup] = useState(false);

    const handleBtnClick = () => {
        console.log('Alle Fragen Button wurde geklickt!');
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div style={header_style}>
            <div className='flex row justify-around'>
                <h1>Das</h1>
                <div className='img-container h-24 cursor-pointer'>
                    <img src={logo} alt="Wegweiser.UX-für-KI Logo" />
                </div>
                <h1>Quiz</h1>
            </div>
            <div className='flex row justify-around'>
                <p className='text-white pr-2'>Fortschritt:</p>
                <p>long progressbar</p>
                <button onClick={onReset} className='pl-2 text-white hover:text-gray-400'>reset-btn</button>
            </div>
            <div onClick={handleBtnClick}
                className='img-container h-20 border-dashed border-white border-2 rounded-lg hover:border-solid hover:cursor-pointer'>
                <img src={allQuestionsBtn} alt="Alle Fragen Button" />
            </div>
            {/* <p>Header space</p>
            <div style={joker_group}>
                <p>Joker:</p>
                <div style={joker}></div>
                <div style={joker}></div>
                <div style={joker}></div>
                <div style={joker}></div>
            </div> */}

            {showPopup && <Popup onClose={handleClosePopup} />}
        </div>
    )
}

const header_style = {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '100%',
    maxWidth: '1490px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '125px',
    padding: '10px',
    backgroundColor: '#2D2C36',
    alignItems: 'center'
}

/* const joker_group = {
    display: 'flex',
    flexDirection: 'row'
}

const joker = {
    backgroundColor: '#d177b3',
    borderRadius: '50px', //camelCase instead of kebab-case
    width: '30px',
    height: '30px',
    marginLeft: '10px',
    marginTop: '15px'
} */

export default Header;