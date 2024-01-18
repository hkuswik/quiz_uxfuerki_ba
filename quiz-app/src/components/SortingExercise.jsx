import { useEffect, useState } from "react";
import check_logo_yes from '../data/images/check-bl.png';
import check_logo_no from '../data/images/check-light.png';

const SortingExercise = ({ exercise, onAnswer }) => {
    const [firstCategory, setFirstCategory] = useState('');
    const [secondCategory, setSecondCategory] = useState('');
    const [userSelections, setUserSelections] = useState(new Map());
    const [allSelected, setAllSelected] = useState(false);
    const [checkClicked, setCheckClicked] = useState(false);
    const [isClickable, setIsClickable] = useState(true);

    const [firstBtnHover, setFirstBtnHover] = useState(null);
    const [secondBtnHover, setSecondBtnHover] = useState(null);

    const [color, setColor] = useState('#817C9C');
    const correctColor = '#7AD177';
    const wrongColor = '#D24141';

    useEffect(() => {
        prepareItems(exercise);
        setFirstCategory(exercise.firstContainer);
        setSecondCategory(exercise.secondContainer);

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

    const prepareItems = (exercise) => {
        const items = exercise.belongsInFirst.split(';').concat(exercise.belongsInSecond.split(';'));
        shuffleArray(items);
        setUserSelections(items.reduce((userSelectionsMap, item) => {
            // accumulate user selections for each item
            userSelectionsMap[item] = ''; // initialize user selection for each item
            return userSelectionsMap;
        }, {}));
    }

    const handleButtonClick = (item, category) => {
        const newSelections = { ...userSelections, [item]: category };
        
        // check if user has selected a category for each item
        let allDone = true;
        Object.keys(newSelections).forEach((item) => {
            if (newSelections[item] === "") {
                allDone = false;
                return; // exit loop as soon as an empty value is found
            }
        });
        setAllSelected(allDone);

        setUserSelections(newSelections);
    };

    const checkAnswer = (selected) => {
        if (!allSelected) {
            // TODO: handle what happens when you haven't selected all answers
            // maybe text: 'select all answers'?
            console.log('not all answers selected :(');
        } else {
            setCheckClicked(true);
            setIsClickable(false);
            // TODO: answer correct?
            onAnswer(true);
        }
    }

    const handleBtnHover = (item, selectedCategory) => {
        if (userSelections[item] !== selectedCategory) {
            if (selectedCategory === firstCategory) {
                setFirstBtnHover(item);
            } else {
                setSecondBtnHover(item);
            }
        }
    };

    const handleBtnLeave = (selectedCategory) => {
        if (selectedCategory === firstCategory) {
            setFirstBtnHover(null);
        } else {
            setSecondBtnHover(null);
        }
    }

    // TODO: functionality
    return (
        <div className='flex flex-col h-full w-full max-w-4xl justify-around'>
            <div>{exercise.question}</div>
            <div className="flex flex-col">
                {Object.keys(userSelections).map((item) => (
                    <div key={item} className="flex row justify-between mb-2">
                        <p style={item_style} className="sm">{item}</p>
                        <div className="flex row">
                            <div
                                onClick={() => handleButtonClick(item, firstCategory)}
                                onMouseOver={() => handleBtnHover(item, firstCategory)}
                                onMouseLeave={() => handleBtnLeave(firstCategory)}
                                style={{
                                    ...button_style,
                                    ...(userSelections[item] === firstCategory ? {} : firstBtnHover === item ? { ...hover_style, outlineColor: color } : {}),
                                    background: userSelections[item] === firstCategory ? color : '#F6F5FC'
                                }}
                            >
                                {firstCategory}
                            </div>
                            <div
                                onClick={() => handleButtonClick(item, secondCategory)}
                                onMouseOver={() => handleBtnHover(item, secondCategory)}
                                onMouseLeave={() => handleBtnLeave(secondCategory)}
                                style={{
                                    ...button_style,
                                    ...(userSelections[item] === secondCategory ? {} : secondBtnHover === item ? { ...hover_style, outlineColor: color } : {}),
                                    background: userSelections[item] === secondCategory ? color : '#F6F5FC'
                                }}
                            >
                                {secondCategory}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end h-8">
                {(!allSelected) &&
                    <div className="img-container flex">
                        <img src={check_logo_no} className="h-12" alt="Check Logo" />
                    </div>
                }
                {(allSelected && !checkClicked) &&
                    <div onClick={() => checkAnswer(userSelections)} className="img-container hover:opacity-85 cursor-pointer">
                        <img src={check_logo_yes} className="h-12" alt="Check Logo" />
                    </div>
                }
            </div>
        </div>
    );
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const item_style = {
    background: 'white',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '300px',
    width: '50%',
    padding: '0 10px 0 10px',
}

const button_style = {
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '200px',
    padding: '0 5px 0 5px',
    marginLeft: '10px',
    fontSize: 'calc(6px + 1vmin)'
}

const hover_style = {
    outline: '2px dashed',
    cursor: 'pointer'
}

/**
  "id": 2,
  "type": "sort",
  "difficulty": "easy",
  "question": "Ordne zu, ob folgende Aussagen richtig oder falsch sind.",
  "firstContainer": "Richtig",
  "secondContainer": "Falsch",
  "belongsInFirst": "Fragebögen sind aufwändiger als Interviews;bei Interviews entsteht eine große Datenmenge",
  "belongsInSecond": "für Interviews benötigt man eine größere Stichprobe als für Fragebögen; Interviews sind reliabler als Fragebögen",
  "tip": "…"
 */

export default SortingExercise;