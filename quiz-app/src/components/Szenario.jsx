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
                    "Der EU AI Act ist ein umfassendes Regelwerk der Europäischen Union, das den Umgang mit Künstlicher Intelligenz (KI) regelt.\n" +
                    "Ziel ist es, die Sicherheit, Transparenz und Verantwortlichkeit von KI-Systemen zu gewährleisten und gleichzeitig Innovationen zu fördern.\n" +
                    "Der EU AI Act kategorisiert KI-Systeme nach ihrem Risikopotential und legt spezifische Anforderungen und Pflichten für die verschiedenen Kategorien fest.\n" +
                    "Du erhältst nun einige Aufgaben dazu, um dein Wissen über die Grundlagen des EU AI Acts zu testen."
                );
                break;
            case 'szenario2':
                setTopic(topics[1]);
                setSzenarioNr('2');
                setColor(colors.purple);
                setButton(start_topic2);
                setSzenarioText(
                    "In diesem Bereich betrachten wir, wie verschiedene Länder und Regionen die Regulierung von Künstlicher Intelligenz angehen.\n" +
                    "Jedes Land hat unterschiedliche Ansätze und Prioritäten, um die Chancen und Risiken von KI zu managen. Der Vergleich hilft, die Stärken und Schwächen der verschiedenen Regulierungsansätze zu verstehen.\n" +
                    "Du erhältst nun einige Aufgaben dazu, um dein Wissen über die internationalen Unterschiede in der KI-Regulierung zu testen."
                );
                break;
            default:
                setTopic(topics[2]);
                setSzenarioNr('3');
                setColor(colors.turquoise);
                setButton(start_topic3);
                setSzenarioText(
                    "Dieser Bereich bezieht sich auf die konkreten Maßnahmen und Verfahren, die zur Einhaltung des Gesetzes erforderlich sind.\n" +
                    "Du erhältst nun einige Aufgaben dazu, um dein Wissen über die praktischen Aspekte der Implementierung und Überwachung des EU AI Acts zu testen."
                );
        };
    }, [whichSzenario, topics, colors]);

    return (
        <div className="flex flex-col items-center justify-between cursor-default" style={{ height: '80vh' }}>
            <div></div>
            <div className="flex flex-col items-center">
                <h2>Szenario {szenarioNr}:</h2>
                <h2 style={{ color: color }} className="font-bold">{topic}</h2>
                {/* <p className="font-medium w-11/12 text-lg mt-16">Versetze dich in folgendes Szenario:</p> */}
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