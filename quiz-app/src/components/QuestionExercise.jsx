import { useContext, useState, useEffect } from 'react';
import QuizContext from './QuizContext';
import check_btn from '../data/images/überprüfen_btn.png';

// popup content when exercise is of type 'question'
const QuestionExercise = ({ exercise, onAnswer, answerUser = null }) => {
    const { topics, colors } = useContext(QuizContext); // get static topic and color variables

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
            case topics[0]:
                setColor(colors.pink);
                break;
            case topics[1]:
                setColor(colors.purple);
                break;
            case topics[2]:
                setColor(colors.turquoise);
                break;
            default:
                setColor(colors.grey);
        };
    }, [exercise, topics, colors]);

    useEffect(() => {
        if (answerUser !== null) {
            setCheckClicked(true);
            setIsClickable(false);
        }
    }, [answerUser]);

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
                onAnswer(true, selected);
            } else {
                onAnswer(false, selected);
            };
        } else {
            setShowWarning(true);
        }
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
                        ...(checkClicked
                            ? answerUser === null
                                ? {
                                    background: selected === answer
                                        ? answer === exercise.correctAnswer ? colors.correct : colors.wrong
                                        : answer === exercise.correctAnswer ? colors.correct : '#F6F5FC'
                                }
                                : {
                                    background: answerUser === answer
                                        ? answer === exercise.correctAnswer ? colors.correct : colors.wrong
                                        : answer === exercise.correctAnswer ? colors.correct : '#F6F5FC'
                                }
                            : {}),
                        ...(checkClicked
                            ? answerUser === null
                                ? answer === selected ? { outline: '2px dashed white' } : {}
                                : answer === answerUser ? { outline: '2px dashed white' } : {}
                            : {})
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
            <div className="flex row justify-between h-12 items-center">
                <div className="w-28"></div>
                {showWarning &&
                    <div className="font-bold" style={{ color: colors.wrong }}>Bitte wähle eine Antwort aus</div>
                }
                {!checkClicked &&
                    <div onClick={() => checkAnswer(selected)}
                        className={selected !== "" ? "img-container cursor-pointer hover:opacity-80" : "img-container opacity-40"}
                    >
                        <img src={check_btn} className="w-28" alt="Überprüfen Button" />
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
    minHeight: '15vh',
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