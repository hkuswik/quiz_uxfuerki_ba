import wdh_topic1 from '../data/images/wiederholen_topic1.png';
import wdh_topic2 from '../data/images/wiederholen_topic2.png';
import wdh_topic3 from '../data/images/wiederholen_topic3.png';
import weiter_topic2 from '../data/images/weiter_topic2.png';
import weiter_topic3 from '../data/images/weiter_topic3.png';
import new_topic from '../data/images/new_topic.png';
import zurück_plattform from '../data/images/lernplattform_button.png';
import { useContext, useState, useEffect } from 'react';
import QuizContext from './QuizContext';

// popup content for feedback circles; displays what topic was finished, how many exercises were correct and how many jokers were used
const Feedback = ({ currentTopic, completedAtLeastOnce, onUpdate, correctAmount, jokerAmount, onRepeat }) => {
    const { topics } = useContext(QuizContext); // get static topic variables

    const [button1, setButton1] = useState(null);
    const [button2, setButton2] = useState(null);
    const [topic, setTopic] = useState('Topic');
    const [classColor, setClassColor] = useState('');

    useEffect(() => { selectButtons(currentTopic); });

    // display correct buttons depending on current topic
    const selectButtons = (currentTopic) => {
        setTopic(currentTopic); // set displayed topic
        if (currentTopic === topics[0]) {
            setButton1(wdh_topic1);
            setButton2(weiter_topic2);
            setClassColor('pink');
        } else if (currentTopic === topics[1]) {
            setButton1(wdh_topic2);
            setButton2(weiter_topic3);
            setClassColor('lila');
        } else {
            setButton1(wdh_topic3);
            setButton2(new_topic);
            setClassColor('türkis');
        }

        // 'new topic' button after quiz has been completed at least once (can always choose next topic now)
        if (completedAtLeastOnce) setButton2(new_topic);
    }

    return (
        <div className='flex flex-col items-center text-center justify-center'>
            {completedAtLeastOnce &&
                <h4 className="mb-5"><b>Glückwunsch!</b> Du hast alle Abschnitte abgeschlossen!</h4>
            }
            <h4 className='mb-4'>Im Abschnitt</h4>
            <h2 className={classColor}>{topic}</h2>
            <h4 className='w-10/12 mt-4'>hast du <b>{correctAmount}/8 Fragen</b> richtig beantwortet und <b>{jokerAmount} Joker</b> verwendet.</h4>
            <div className="flex row justify-between w-10/12 items-center mt-16">
                <div onClick={() => onRepeat(currentTopic)} className="img-container hover:opacity-85 cursor-pointer">
                    <img src={button1} className="h-16" alt="Abschnitt wiederholen Button" />
                </div>
                <div className="img-container hover:opacity-85 cursor-pointer">
                    <img src={zurück_plattform} className="h-44" alt="zurück zur Plattform Button" />
                </div>
                <div onClick={() => onUpdate()} className="img-container hover:opacity-85 cursor-pointer">
                    <img src={button2} className="h-16" alt="weiter Button" />
                </div>
            </div>
        </div>
    )
}

export default Feedback;