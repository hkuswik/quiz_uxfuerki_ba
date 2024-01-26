import { useEffect, useState } from "react";
import start_topic1 from '../data/images/start_topic1.png';
import start_topic2 from '../data/images/start_topic2.png';
import start_topic3 from '../data/images/start_topic3.png';

const topic1 = 'Vertrauen';
const topic2 = 'Diskriminierung';
const topic3 = 'Autonomie';

const Szenario = ({ whichSzenario, onUpdate, showBtn }) => {
    const [color, setColor] = useState('');
    const [szenario, setSzenario] = useState('');
    const [szenarioNr, setSzenarioNr] = useState(1);
    const [button, setButton] = useState(null);

    useEffect(() => {
        switch (whichSzenario) {
            case 'szenario1':
                setSzenario(topic1);
                setSzenarioNr('1');
                setColor('#D177B3');
                setButton(start_topic1);
                break;
            case 'szenario2':
                setSzenario(topic2);
                setSzenarioNr('2');
                setColor('#8377D1');
                setButton(start_topic2);
                break;
            default:
                setSzenario(topic3);
                setSzenarioNr('3');
                setColor('#77D1CB');
                setButton(start_topic3);
        }

    }, [whichSzenario]);

    return (
        <div className="flex flex-col items-center" style={showBtn ? {marginBottom: ''} : {marginBottom: '150px'}}>
            <h2>Szenario {szenarioNr}:</h2>
            <h2 style={{ color: color }} className="font-bold">{szenario}</h2>
            <p className="font-medium w-11/12 text-lg mt-7">Versetze dich in folgendes Szenario:</p>
            <p className="w-11/12 mt-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Eum ducimus porro magni consequatur dolor facere aspernatur
                fugiat quidem velit quas ad quod saepe et natus harum, voluptates
                accusamus, iste deserunt! Lorem, ipsum dolor sit amet consectetur
                adipisicing elit.Eum ducimus porro magni consequatur dolor facere
                aspernatur fugiat quidem velit quas ad quod saepe et natus harum,
                voluptates accusamus, iste deserunt!
            </p>
            {showBtn &&
                <div className="flex row w-full justify-end mt-12">
                    <div onClick={onUpdate} className="img-container hover:opacity-85 cursor-pointer">
                        <img src={button} className="h-20" alt="weiter Button" />
                    </div>
                </div>
            }
        </div>
    )
}

export default Szenario;