import { useEffect, useState } from "react";
import check_logo_yes from '../data/images/check-bl.png';
import check_logo_no from '../data/images/check-light.png';

const topic1 = 'easy';
const topic2 = 'medium';
const topic3 = 'hard';

const QuestionExercise = ({ exercise, onAnswer }) => {
    const [answers, setAnswers] = useState([]);
    const [hovered, setHovered] = useState(null);
    const [selected, setSelected] = useState(null);
    const [checkClicked, setCheckClicked] = useState(false);
    const [isClickable, setIsClickable] = useState(true);
    const [showWarning, setShowWarning] = useState(false);

    const [color, setColor] = useState('#817C9C');
    const correctColor = '#7AD177';
    const wrongColor = '#D24141';

    useEffect(() => {
        randomizeAnswers(exercise);

        switch (exercise.difficulty) {
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
        }
    }, [exercise]);

    const randomizeAnswers = (exercise) => {
        const allAnswers = exercise.wrongAnswers.split(';');
        allAnswers.push(exercise.correctAnswer);
        shuffleArray(allAnswers);
        setAnswers(allAnswers);
    }

    const checkAnswer = () => {
        if (selected === null) {
            // TODO: handle what happens when you haven't selected an answer
            // maybe text: 'select an answer'?
            console.log('no answer selected :(');
        } else {
            setCheckClicked(true);
            setIsClickable(false);
            if (selected === exercise.correctAnswer) {
                console.log('jey answer was correct :)');
                onAnswer(true);
            } else {
                console.log('oh no answer was wrong');
                onAnswer(false);
            }
        }
    }

    const handleWarning = () => {
        setShowWarning(true);
    }

    const handleAnswerHover = (answer_box) => {
        isClickable && setHovered(answer_box);
    }

    const handleAnswerLeave = () => {
        isClickable && setHovered(null);
    }

    const handleAnswerSelect = (selected) => {
        isClickable && setSelected(selected);

        // hide warning again when an answer was clicked
        showWarning && setShowWarning(false);
    }

    const handleAnswerUnselect = () => {
        isClickable && setSelected(null);
    }

    return (
        <div className='flex flex-col h-full justify-around'>
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
                            onMouseOver={() => handleAnswerHover(answer)}
                            onMouseLeave={handleAnswerLeave}
                            onClick={() =>
                                selected === null ? handleAnswerSelect(answer)
                                    : selected === answer ? handleAnswerUnselect(answer)
                                        : handleAnswerSelect(answer)}
                        >
                            {answer}
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end h-8">
                {showWarning &&
                    <div className="self-end font-bold mr-24" style={{ color: wrongColor }}>Bitte wähle eine Antwort aus</div>
                }
                {(selected === null) &&
                    <div onClick={() => handleWarning()} className="img-container flex">
                        <img src={check_logo_no} className="h-12" alt="Check Logo" />
                    </div>
                }
                {(selected !== null && !checkClicked) &&
                    <div onClick={() => checkAnswer(selected)} className="img-container hover:opacity-85 cursor-pointer">
                        <img src={check_logo_yes} className="h-12" alt="Check Logo" />
                    </div>
                }
            </div>
        </div>
    )
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const question_style = {
    background: '#F6F5FC',
    fontWeight: '600',
    width: '100%',
    height: 'auto',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: '8px'
}

const answer_style = {
    background: '#F6F5FC',
    height: '150px',
    width: '300px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '8px',
    margin: '10px',
}

const hover_style = {
    outline: '2px dashed',
    cursor: 'pointer'
}

export default QuestionExercise;