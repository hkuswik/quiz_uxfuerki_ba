import { useState } from 'react';
import fortfahrenBtn from '../data/images/fortfahren.png';
import AllQuestions from './AllQuestions';

const Disclaimer = ({ content, onReset }) => {

    const [renderAllQuest, setRenderAllQuest] = useState(false);
    const isAllQuest = content === 'alleFragen'; // else: reset content

    const renderPopupContent = () => {
        if (renderAllQuest) {
            return <AllQuestions />
        } else {
            return (
                <div className='flex flex-col items-center text-center mb-14'>
                    <h2 className='mb-8'><b>Achtung!</b></h2>
                    {isAllQuest &&
                        <h4 className='w-3/4 mb-7'>Wenn du fortfährst, siehst du eine Übersicht aller Fragen mitsamt ihrer Lösungen.</h4>
                    }
                    {!isAllQuest &&
                        <div className='flex flex-col items-center'>
                            <h4 className='w-3/4 mb-5'>Wenn du fortfährst, wird dein gesamter Fortschritt zurückgesetzt - das Quiz beginnt von vorne.</h4>
                            <div className='flex row items-center rounded-lg'>
                                <p className='mr-3'>Fortschritt:</p>
                                <div className='progress-bar'>
                                    <div className='progress-section'></div>
                                    <div className='progress-section'></div>
                                    <div className='progress-section'></div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="img-container hover:opacity-85 cursor-pointer mt-16 self-end mr-8">
                        <img onClick={() => isAllQuest ? setRenderAllQuest(true) : onReset()} src={fortfahrenBtn} className="h-20" alt="fortfahren Button" />
                    </div>
                </div>
            );
        }
    }

    return (
        <div>
            {renderPopupContent()}
        </div>
    );
}

export default Disclaimer;