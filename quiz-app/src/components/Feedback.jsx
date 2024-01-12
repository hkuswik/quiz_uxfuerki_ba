import wdh_topic1 from '../data/images/wiederholen_topic1.png';
import wdh_topic2 from '../data/images/wiederholen_topic2.png';
import wdh_topic3 from '../data/images/wiederholen_topic3.png';
import weiter_topic2 from '../data/images/weiter_topic2.png';
import weiter_topic3 from '../data/images/weiter_topic3.png';
import weiter_generic from '../data/images/weiter_generic.png';
import zurück_plattform from '../data/images/lernplattform_button.png';
import { useState, useEffect } from 'react';

const Feedback = ({ completedTopic, onUpdate, correctInTopic }) => {
    const [button1, setButton1] = useState(null);
    const [button2, setButton2] = useState(null);
    const [topic, setTopic] = useState('Topic');
    const [classColor, setClassColor] = useState('');
    const [amountCorrect, setAmountCorrect] = useState(0);
    /* const [amountJoker, setAmountJoker] = useState(0); */

    useEffect(() => {
        selectButtons(completedTopic);
    });

    const selectButtons = (completedTopic) => {
        if (completedTopic === 'Topic 1') {
            setButton1(wdh_topic1);
            setButton2(weiter_topic2);
            setTopic('Vertrauen');
            setClassColor('pink');
            setAmountCorrect(correctInTopic.get(1));
        } else if (completedTopic === 'Topic 2') {
            setButton1(wdh_topic2);
            setButton2(weiter_topic3);
            setTopic('Diskriminierung');
            setClassColor('lila');
            setAmountCorrect(correctInTopic.get(2));
        } else {
            setButton1(wdh_topic3);
            setButton2(weiter_generic);
            setTopic('Autonomie');
            setClassColor('türkis');
            setAmountCorrect(correctInTopic.get(3));
        }
        console.log('correct: 1: ', correctInTopic.get(1),
            ', 2: ', correctInTopic.get(2), ', 3: ', correctInTopic.get(3));
        console.log('topic: ', completedTopic);
    }

    return (
        <div className='flex flex-col items-center'>
            <div className='font-normal'>Du hast den Abschnitt</div>
            <div className={classColor} style={{ fontSize: 'calc(30px + 1vmin)' }}>{topic}</div>
            <div className='font-normal'>abgeschlossen! Du hast <b className=''>{amountCorrect}/8 Fragen</b> richtig beantwortet und <b> Joker</b> verwendet.</div>
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