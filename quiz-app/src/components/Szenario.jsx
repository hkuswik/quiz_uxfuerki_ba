import { useEffect, useState } from "react";
import start_topic1 from '../data/images/weiter_generic.png';
import start_topic2 from '../data/images/weiter_topic2.png';
import start_topic3 from '../data/images/weiter_topic3.png';

const Szenario = ({ whichSzenario, onUpdate, showBtn }) => {
    const [color, setColor] = useState('');
    const [szenario, setSzenario] = useState('');
    const [button, setButton] = useState(null);

    useEffect(() => {
        switch (whichSzenario) {
            case 1:
                setSzenario('Vertrauen');
                setColor('#D177B3');
                setButton(start_topic1);
                break;
            case 2:
                setSzenario('Diskriminierung');
                setColor('#8377D1');
                setButton(start_topic2);
                break;
            default:
                setSzenario('Autonomie');
                setColor('#77D1CB');
                setButton(start_topic3);
        }

    }, [whichSzenario]);

    return (
        <div className="flex flex-col items-center">
            <h2>Szenario {whichSzenario}:</h2>
            <h2><b style={{ color: color }}>{szenario}</b></h2>
            <h3>Versetze dich in folgendes Szenario:</h3>
            <p className="w-11/12 mt-4">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Eum ducimus porro magni consequatur dolor facere aspernatur
                fugiat quidem velit quas ad quod saepe et natus harum, voluptates
                accusamus, iste deserunt! Lorem, ipsum dolor sit amet consectetur
                adipisicing elit.Eum ducimus porro magni consequatur dolor facere
                aspernatur fugiat quidem velit quas ad quod saepe et natus harum,
                voluptates accusamus, iste deserunt!
            </p>
            <div className="flex row w-full justify-end mt-20">
                <div onClick={onUpdate} className="img-container hover:opacity-85 cursor-pointer">
                    <img src={button} className="h-24" alt="weiter Button" />
                </div>
            </div>
        </div>
    )
}

export default Szenario;