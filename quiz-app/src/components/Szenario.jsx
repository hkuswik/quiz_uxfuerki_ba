import { useContext, useState, useEffect } from 'react';
import QuizContext from './QuizContext';
import start_topic1 from '../data/images/start_topic1.png';
import start_topic2 from '../data/images/start_topic2.png';
import start_topic3 from '../data/images/start_topic3.png';

// popup content when szenario circles are clicked; displays szenario text for current topic
const Szenario = ({ whichSzenario, onUpdate }) => {
    const { topics, colors } = useContext(QuizContext); // get static topic and color variables from context
    const [color, setColor] = useState('');
    const [topic, setTopic] = useState('');
    const [szenarioNr, setSzenarioNr] = useState(1);
    const [szenarioText, setSzenarioText] = useState(":)");
    const [button, setButton] = useState(null);

    useEffect(() => {
        switch (whichSzenario) {
            case 'szenario1':
                setTopic(topics[0]);
                setSzenarioNr('1');
                setColor(colors.pink);
                setButton(start_topic1);
                setSzenarioText(
                    "Du möchtest eine App entwickeln, die deiner Zielgruppe gefällt.\n" +
                    "In diesem Abschnitt übst du einige Grundlagen des User Experience Designs."
                );
                break;
            case 'szenario2':
                setTopic(topics[1]);
                setSzenarioNr('2');
                setColor(colors.purple);
                setButton(start_topic2);
                setSzenarioText(
                    "Um eine möglichst gebrauchstaugliche App zu gewährleisten,\n" +
                    "möchtest du den User-Centered Design (UCD) Prozess anwenden,\n" +
                    "der sich aus Analyse, Konzeption, Entwicklung und Evaluation zusammensetzt.\n" +
                    "Im Folgenden übst du, was es in den einzelnen Phasen zu beachten gilt."
                );
                break;
            default:
                setTopic(topics[2]);
                setSzenarioNr('3');
                setColor(colors.turquoise);
                setButton(start_topic3);
                setSzenarioText(
                    "Du möchtest noch etwas mehr zum Thema Evaluation lernen.\n" +
                    "Du bekommst nun einige Aufgaben zur letzten Phase des User-Centered Design Prozesses."
                );
        };
    }, [whichSzenario, topics, colors]);

    return (
        <div className="flex flex-col items-center justify-between cursor-default" style={{ height: '80vh' }}>
            <div></div>
            <div className="flex flex-col items-center">
                <h2>Szenario {szenarioNr}:</h2>
                <h2 style={{ color: color }} className="font-bold">{topic}</h2>
                <p className="font-medium w-11/12 text-lg mt-16">Versetze dich in folgendes Szenario:</p>
                <p className="w-11/12 mt-3">
                    {szenarioText}
                </p>
            </div>
            <div onClick={() => onUpdate(whichSzenario, topic)} className="img-container self-end mr-4 hover:opacity-85 cursor-pointer">
                <img src={button} className="h-20" alt="Abschnitt starten Button" />
            </div>
        </div>
    );
};

export default Szenario;