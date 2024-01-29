import wdh_topic1 from '../data/images/wiederholen_topic1.png';
import wdh_topic2 from '../data/images/wiederholen_topic2.png';
import wdh_topic3 from '../data/images/wiederholen_topic3.png';
import weiter_topic2 from '../data/images/weiter_topic2.png';
import weiter_topic3 from '../data/images/weiter_topic3.png';
import new_topic from '../data/images/new_topic.png';
import zurück_plattform from '../data/images/lernplattform_button.png';
import { useState, useEffect } from 'react';

const topic1 = 'Vertrauen';
const topic2 = 'Diskriminierung';
const topic3 = 'Autonomie';

const Feedback = ({ currentTopic, completedAtLeastOnce, onUpdate, correctAmount, jokerAmount, onRepeat }) => {
    const [button1, setButton1] = useState(null);
    const [button2, setButton2] = useState(null);
    const [topic, setTopic] = useState('Topic');
    const [classColor, setClassColor] = useState('');

    useEffect(() => {
        selectButtons(currentTopic);
    });

    const selectButtons = (currentTopic) => {
        if (currentTopic === 1) {
            setButton1(wdh_topic1);
            setButton2(weiter_topic2);
            setTopic(topic1);
            setClassColor('pink');
        } else if (currentTopic === 2) {
            setButton1(wdh_topic2);
            setButton2(weiter_topic3);
            setTopic(topic2);
            setClassColor('lila');
        } else {
            setButton1(wdh_topic3);
            setButton2(new_topic);
            setTopic(topic3);
            setClassColor('türkis');
        }

        // after quiz has been completed at least once, can always choose which topic next
        if (completedAtLeastOnce) {
            setButton2(new_topic);
        }
    }

    return (
        <div className='flex flex-col items-center text-center'>
            {completedAtLeastOnce &&
                <h4 className="mb-5"><b>Glückwunsch!</b> Du hast alle Abschnitte abgeschlossen!</h4>
            }
            <h4 className='mb-4'>Du hast den Abschnitt</h4>
            <h2 className={classColor}>{topic}</h2>
            <h4 className='w-10/12 mt-4'>abgeschlossen! Du hast <b>{correctAmount}/8 Fragen</b> richtig beantwortet und <b>{jokerAmount} Joker</b> verwendet.</h4>
            <div className="flex row justify-between w-10/12 items-center mt-14 mb-20">
                <div onClick={onRepeat} className="img-container hover:opacity-85 cursor-pointer">
                    <img src={button1} className="h-16" alt="Abschnitt wiederholen Button" />
                </div>
                <div className="img-container hover:opacity-85 cursor-pointer">
                    <img src={zurück_plattform} className="h-44" alt="zurück zur Plattform Button" />
                </div>
                <div onClick={onUpdate} className="img-container hover:opacity-85 cursor-pointer">
                    <img src={button2} className="h-16" alt="weiter Button" />
                </div>
            </div>
        </div>
    )
}

export default Feedback;