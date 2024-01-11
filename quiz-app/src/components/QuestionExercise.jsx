import { useEffect, useState } from "react";

const QuestionExercise = ({ exercise, onAnswer }) => {
    const [answers, setAnswers] = useState([]);
    const [hovered, setHovered] = useState(null);
    const [selected, setSelected] = useState(null);
    const [color, setColor] = useState('#817C9C');
    const [checkClicked, setCheckClicked] = useState(false);

    useEffect(() => {
        randomizeAnswers(exercise);

        switch (exercise.difficulty) {
            case 'easy':
                setColor('#D177B3');
                break;
            case 'medium':
                setColor('#8377D1');
                break;
            case 'hard':
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
            if (selected === exercise.correctAnswer) {
                console.log('jey answer was correct :)');
                onAnswer(true);
                
            } else {
                console.log('oh no answer was wrong');
                onAnswer(false);
                
            }

        }
    }

    const handleAnswerHover = (answer_box) => {
        setHovered(answer_box);
    }

    const handleAnswerLeave = () => {
        setHovered(null);
    }

    const handleAnswerSelect = (selected) => {
        setSelected(selected);
        // maybe add: check button different color if answer was selected (login = possible)
    }

    const handleAnswerUnselect = () => {
        setSelected(null);
        // maybe add: check button different color if answer was selected (login = possible)
    }

    return (
        <div className='flex flex-col h-full justify-center'>
            <div style={question_style}>{exercise.question}</div>
            <div className='flex row flex-wrap justify-center'>
                {answers.map((answer, index) => {

                    const answerStyles = {
                        ...(answer === selected ? { ...answer_style, background: color } : answer_style),
                        ...(answer === hovered ? { ...hover_style, outlineColor: color } : {})
                    };


                    return (
                        <div
                            key={index}
                            style={answerStyles}
                            onMouseOver={() => handleAnswerHover(answer)}
                            onMouseLeave={handleAnswerLeave}
                            onClick={() =>
                                selected === null ? handleAnswerSelect(answer) :
                                    (selected === answer ? handleAnswerUnselect(answer) : handleAnswerSelect(answer))}
                        >
                            {answer}
                        </div>
                    );
                })}
            </div>
            {!checkClicked && <div className="text-green-600 font-bold cursor-pointer hover:text-green-500" onClick={() => checkAnswer(selected)}>Check!!!</div>}
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
    fontWeight: '400',
    width: '100%',
    height: '20%',
    padding: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: '8px'
}

const answer_style = {
    background: '#F6F5FC',
    height: '40%',
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