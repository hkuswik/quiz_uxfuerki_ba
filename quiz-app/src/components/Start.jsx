import { useState } from 'react';
import weiter_logo from '../data/images/weiter_generic.png'
import starten_logo from '../data/images/Quiz_starten.png';
import bulbIcon from '../data/images/bulb.png';
import swapIcon from '../data/images/swap.png';

const topic1 = 'Vertrauen';
const topic2 = 'Diskriminierung';
const topic3 = 'Autonomie';

// popup content when start circle is clicked; displays welcome text and explains some main features
const Start = ({ onUpdate, popup_type }) => {
    const [content, setContent] = useState(1);

    // render content to distinguish between first (welcome text) and second part (explanations) of popup content
    const renderContent = (content) => {
        if (content === 2 || popup_type === 'help') {
            return (
                <div className='flex flex-col h-full justify-between'>
                    <div></div>
                    {popup_type === 'help' &&
                        <div className="flex flex-col items-center self-center text-center w-5/6">
                            <p className="pb-3">
                                Im <b>Wegweiser.UX-für-KI Quiz</b> kannst du dich selbstständig zu den Themen <b className="pink">{topic1}
                                </b>, <b className="lila">{topic2}</b> und <b className="türkis">{topic3}</b> testen.
                                Zu jedem Thema erhältst du zunächst ein kurzes <b>Szenario</b>, in das du dich reinversetzen sollst.
                                Zum Abschluss jedes Wegabschnitts erhältst du ein kurzes <b>Feedback</b>.
                            </p>
                        </div>
                    }
                    <div>
                        <div className='flex row justify-between items-center mr-5 ml-5' style={{marginBottom: (popup_type === 'help') ? '20px' : '80px'}}>
                            <div className='flex flex-col w-4/12 items-center'>
                                <div className='progress-bar'>
                                    <div className='progress-section'>
                                        <div className='progress' style={{ width: '100%', backgroundColor: '#D177B3', opacity: '40%' }}></div>
                                        <div className='progress' style={{ width: '60%', backgroundColor: '#D177B3', }}></div>
                                    </div>
                                    <div className='progress-section'>
                                        <div className='progress' style={{ width: '100%', backgroundColor: '#8377D1', opacity: '40%' }}></div>
                                        <div className='progress' style={{ width: '80%', backgroundColor: '#8377D1' }}></div>
                                    </div>
                                    <div className='progress-section'>
                                        <div className='progress' style={{ width: '40%', backgroundColor: '#77D1CB', opacity: '40%' }}></div>
                                        <div className='progress' style={{ width: '20%', backgroundColor: '#77D1CB' }}></div>
                                    </div>
                                </div>
                            </div>
                            <p className='w-7/12'>
                                Der <b>Fortschrittsbalken</b> zeigt an, wie weit du jeweils in den drei Themenabschnitten <b className="pink">{topic1}
                                </b>, <b className="lila">{topic2}</b> und <b className="türkis">{topic3}</b> fortgeschritten bist.
                                Die dunklere Farbe zeigt, wieviele der Fragen du <b>korrekt</b> beantwortet hast.
                            </p>
                        </div>
                        <div className='flex row justify-between items-center mr-5 ml-5'>
                            <div className='flex flex-col w-4/12 items-center'>
                                <div className='flex row'>
                                    <div style={joker}>
                                        <img src={swapIcon} className="h-12" alt="Frage wechseln Icon" />
                                    </div>
                                    <div style={joker}>
                                        <img src={bulbIcon} className="h-16" alt="Glühbirnen Icon" />
                                    </div>
                                </div>
                            </div>
                            <p className='w-7/12'>
                                Du hast zwei Joker zur Verfügung, mit denen du entweder die <b>Frage tauschen</b> oder einen <b>Tipp erhalten</b> kannst.
                                Du kannst bei jeder Aufgabe genau <b>einen Joker</b> einsetzen. In der Quiz-Übersicht siehst du, bei welchen Fragen du Joker verwendet hast.
                            </p>
                        </div>
                    </div>
                    {popup_type === 'start' &&
                        <div className="img-container self-end mr-4">
                            <img src={starten_logo} className="h-20 hover:opacity-85 cursor-pointer" onClick={onUpdate} alt="Quiz starten Logo" />
                        </div>
                    }
                    {popup_type === 'help' && <div></div>}
                </div >
            );
        } else {
            return (
                <div className='flex flex-col h-full justify-between'>
                    <div></div>
                    <div className='flex flex-col items-center text-center'>
                        <h2>Willkommen</h2>
                        <h2>beim</h2>
                        <h2 className='font-semibold'>Wegweiser.UX-für-KI Quiz</h2>
                        <div className="w-9/12 mt-8">
                            <p className="pb-3">
                                Du kannst dich hier selbstständig zu den Themen <b className="pink">{topic1}
                                </b>, <b className="lila">{topic2}</b> und <b className="türkis">{topic3}</b> testen.
                            </p>
                            <p>
                                Zu jedem Thema erhältst du zunächst ein kurzes <b>Szenario</b>, in das du dich reinversetzen sollst.
                                Zum Abschluss jedes Wegabschnitts erhältst du ein kurzes <b>Feedback</b>.
                            </p>
                        </div>
                    </div>
                    <div className="img-container self-end mr-4">
                        <img src={weiter_logo} className="h-20 hover:opacity-85 cursor-pointer" onClick={() => setContent(2)} alt="weiter Logo" />
                    </div>
                </div>
            );
        };
    };

    return (
        <div style={{ height: '80vh' }}>
            {renderContent(content)}
        </div>
    );
};

const joker = {
    height: '120px',
    width: '120px',
    margin: '10px',
    borderRadius: '80px',
    borderWidth: '1px',
    borderColor: '#21202B',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'white'
};

export default Start;