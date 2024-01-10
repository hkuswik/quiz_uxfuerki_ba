import wdh_topic1 from '../data/images/wiederholen_topic1.png';
import wdh_topic2 from '../data/images/wiederholen_topic2.png';
import wdh_topic3 from '../data/images/wiederholen_topic3.png';
import weiter_topic2 from '../data/images/weiter_topic2.png';
import weiter_topic3 from '../data/images/weiter_topic3.png';
import weiter_generic from '../data/images/weiter_generic.png';
import zurück_plattform from '../data/images/lernplattform_button.png';
import { useState, useEffect } from 'react';

const Feedback = ({ completedTopic, onUpdate }) => {
    const [button1, setButton1] = useState(null);
    const [button2, setButton2] = useState(null);

    useEffect(() => {
        selectButtons(completedTopic);
    }, [completedTopic]);

    const selectButtons = (completedTopic) => {
        if (completedTopic === 'Topic 1') {
            setButton1(wdh_topic1);
            setButton2(weiter_topic2);
        } else if (completedTopic === 'Topic2') {
            setButton1(wdh_topic2);
            setButton2(weiter_topic3);
        } else {
            setButton1(wdh_topic3);
            setButton2(weiter_generic);
        }
    }

    return (
        <div className='flex flex-col items-center'>
            <div>Du hast den Abschnitt</div>
            <div>...</div>
            <div>abgeschlossen! Du hast Fragen richtig beantwortet und Joker verwendet.</div>
            <div className="flex row justify-between w-9/12 items-center mt-6">
                <div className="img-container hover:opacity-85 cursor-pointer">
                    <img src={button1} className="h-16" alt="Abschnitt wiederholen Button" />
                </div>
                <div className="img-container hover:opacity-85 cursor-pointer">
                    <img src={zurück_plattform} className="h-36" alt="zurück zur Plattform Button" />
                </div>
                <div onClick={onUpdate} className="img-container hover:opacity-85 cursor-pointer">
                    <img src={button2} className="h-16" alt="weiter Button" />
                </div>
            </div>
        </div>
    )
}

export default Feedback;