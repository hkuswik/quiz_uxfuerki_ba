import { Tooltip } from "react-tooltip";

const topic1 = 'UX Grundlagen';
const topic2 = 'UCD Prozess';
const topic3 = 'Evaluation';

// displays how many exercises are done in each topic and how many of those were correct
const ProgressBar = ({ doneInTopic, correctInTopic }) => {
    const exercisesPerTopic = 8;

    // calculate percentage of completion (for topic)
    const calculateSectionWidth = (topic) => {
        return (doneInTopic[topic] / exercisesPerTopic) * 100;
    };

    // calculate percentage of correctly completed for topic
    const calculateCorrect = (topic) => {
        return (correctInTopic[topic] / exercisesPerTopic) * 100;
    };

    return (
        <div className='progress-bar' data-tooltip-id="progress-tooltip"
            data-tooltip-content="zeigt, wieviele Aufgaben du (korrekt) beantwortet hast"
        >
            <div className='progress-section'>
                <div className='progress'
                    style={{
                        width: `${calculateSectionWidth(topic1)}%`,
                        backgroundColor: '#D177B3',
                        opacity: '50%',
                    }}></div>
                <div className='progress'
                    style={{
                        width: `${calculateCorrect(topic1)}%`,
                        backgroundColor: '#D177B3',
                    }}
                ></div>
            </div>
            <div className='progress-section'>
                <div className='progress'
                    style={{
                        width: `${calculateSectionWidth(topic2)}%`,
                        backgroundColor: '#8377D1',
                        opacity: '50%',
                    }}
                ></div>
                <div className='progress'
                    style={{
                        width: `${calculateCorrect(topic2)}%`,
                        backgroundColor: '#8377D1',
                    }}
                ></div>
            </div>
            <div className='progress-section'>
                <div className='progress'
                    style={{
                        width: `${calculateSectionWidth(topic3)}%`,
                        backgroundColor: '#77D1CB',
                        opacity: '50%',
                    }}
                ></div>
                <div className='progress'
                    style={{
                        width: `${calculateCorrect(topic3)}%`,
                        backgroundColor: '#77D1CB',
                    }}
                ></div>
            </div>
            <Tooltip id="progress-tooltip" style={{backgroundColor: '#F6F5FC', color: '#21202B'}}/>
        </div>
    );
};

export default ProgressBar;