import { useEffect, useState } from "react";
import check_logo_yes from '../data/images/check-bl.png';
import check_logo_no from '../data/images/check-light.png';

const topic1 = 'UX Grundlagen';
const topic2 = 'UCD Prozess';
const topic3 = 'Evaluation';

const correctColor = '#7AD177';
const wrongColor = '#D24141';

// popup content when exercise is of type 'question'
const QuestionExercise = ({ exercise, onAnswer }) => {
    const [answers, setAnswers] = useState([]);
    const [hovered, setHovered] = useState("");
    const [selected, setSelected] = useState("");

    const [checkClicked, setCheckClicked] = useState(false);
    const [isClickable, setIsClickable] = useState(true);
    const [showWarning, setShowWarning] = useState(false);

    const [color, setColor] = useState('');

    // prepare answers and set design color depending on topic
    useEffect(() => {
        randomizeAnswers(exercise);

        switch (exercise.topic) {
            case topic1:
                setColor('#D177B3');
                break;
            case topic2:
                setColor('#8377D1');
                break;
            case topic3:
                setColor('#77D1CB');
                break;
            default:
                setColor('#817C9C');
        };
    }, [exercise]);

    // saves all answers and randomizes them
    const randomizeAnswers = (exercise) => {
        const allAnswers = exercise.wrongAnswers.split(';');
        allAnswers.push(exercise.correctAnswer);
        shuffleArray(allAnswers);
        setAnswers(allAnswers);
    };

    // checks if selected answer is correct
    const checkAnswer = () => {
        if (selected !== "") {
            setCheckClicked(true);
            setIsClickable(false); // can't change answer anymore
            if (selected === exercise.correctAnswer) {
                onAnswer(true);
            } else {
                onAnswer(false);
            };
        };
    };

    // save which answer is currently hovered over
    const handleAnswerHover = (answerBox) => { isClickable && setHovered(answerBox); };
    // resets hovered answer
    const handleAnswerLeave = () => { isClickable && setHovered(""); };

    // logic for selecting an answer
    const handleAnswerSelect = (selected) => {
        isClickable && setSelected(selected);
        showWarning && setShowWarning(false); // hide warning again when an answer was clicked
    };
    // unselects answer by re-click on selected answer
    const handleAnswerUnselect = () => { isClickable && setSelected(""); };

    return (
        <div className='flex flex-col h-full justify-between m-5'>
            <div style={question_style}>{exercise.question}</div>
            <div className='flex row flex-wrap justify-center'>
                {answers.map((answer, index) => {

                    const answerStyles = {
                        ...(answer === selected ? { ...answer_style, background: color } : answer_style),
                        ...(answer === hovered ? { ...hover_style, outlineColor: color } : {}),
                        ...(checkClicked ?
                            {
                                background:
                                    selected === answer
                                        ? answer === exercise.correctAnswer ? correctColor : wrongColor
                                        : answer === exercise.correctAnswer ? correctColor : '#F6F5FC'
                            }
                            : {}),
                        ...(checkClicked ? answer === selected ? { outline: '2px dashed white' } : {} : {})
                    };

                    return (
                        <div
                            key={index}
                            style={answerStyles}
                            className="sm"
                            onMouseOver={() => handleAnswerHover(answer)}
                            onMouseLeave={handleAnswerLeave}
                            onClick={() =>
                                selected === "" ? handleAnswerSelect(answer)
                                    : selected === answer ? handleAnswerUnselect(answer)
                                        : handleAnswerSelect(answer)}
                        >
                            {answer}
                        </div>
                    );
                })}
            </div>
            <div className="flex row justify-between items-end h-8">
                <div></div>
                {showWarning &&
                    <div className="font-bold" style={{ color: wrongColor }}>Bitte wähle eine Antwort aus</div>
                }
                {(selected === "") &&
                    <div onClick={() => setShowWarning(true)} className="img-container flex">
                        <img src={check_logo_no} className="w-9" alt="Check Logo" />
                    </div>
                }
                {(selected !== "" && !checkClicked) &&
                    <div onClick={() => checkAnswer(selected)} className="img-container hover:opacity-85 cursor-pointer">
                        <img src={check_logo_yes} className="w-9" alt="Check Logo" />
                    </div>
                }
            </div>
        </div>
    );
};

// helper function: shuffles array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
};

// styles
const question_style = {
    background: '#F6F5FC',
    fontWeight: '600',
    width: '100%',
    height: 'auto',
    padding: '1.5vh',
    marginTop: '1.5vh',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: '8px'
};

const answer_style = {
    background: '#F6F5FC',
    height: 'auto',
    minHeight: '20vh',
    width: '45%',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '8px',
    margin: '10px'
};

const hover_style = {
    outline: '2px dashed',
    cursor: 'pointer'
};

export default QuestionExercise;