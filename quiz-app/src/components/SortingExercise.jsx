import { useEffect, useState } from "react";
import check_logo_yes from '../data/images/check-bl.png';
import check_logo_no from '../data/images/check-light.png';

const SortingExercise = ({ exercise, onAnswer }) => {
    const [firstCategory, setFirstCategory] = useState('');
    const [secondCategory, setSecondCategory] = useState('');
    const [firstItems, setFirstItems] = useState([]);
    const [secondItems, setSecondItems] = useState([]);

    const [userSelections, setUserSelections] = useState(new Map());
    const [allSelected, setAllSelected] = useState(false);
    const [checkClicked, setCheckClicked] = useState(false);

    const [isClickable, setIsClickable] = useState(true);
    const [showWarning, setShowWarning] = useState(false);

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
        const first = exercise.belongsInFirst.split(';');
        const second = exercise.belongsInSecond.split(';');
        setFirstItems(first);
        setSecondItems(second);

        const items = first.concat(second);
        shuffleArray(items);

        setUserSelections(items.reduce((userSelectionsMap, item) => {
            // accumulate user selections for each item
            userSelectionsMap[item] = ''; // initialize user selection for each item
            return userSelectionsMap;
        }, {}));
    }

    const handleButtonClick = (item, category) => {
        if (!isClickable) {
            return; // disable clicking when answeres have been logged in
        }

        // save clicked category for corresponding item
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

        // hide warning again when next category was clicked
        showWarning && setShowWarning(false);

        // save new selections
        setUserSelections(newSelections);
    };

    const checkAnswer = (selected) => {
        if (!allSelected) {
            console.log('not all answers selected :(');
        } else {
            setCheckClicked(true);
            setIsClickable(false);
            for (const [item, category] of Object.entries(selected)) {
                if (category === firstCategory && !firstItems.includes(item)) {
                    onAnswer(false);
                    return;
                } else if (category === secondCategory && !secondItems.includes(item)) {
                    onAnswer(false);
                    return;
                }
            }
            onAnswer(true);
        }
    }

    const handleBtnHover = (item, selectedCategory) => {
        if (userSelections[item] !== selectedCategory && isClickable) {
            if (selectedCategory === firstCategory) {
                setFirstBtnHover(item);
            } else {
                setSecondBtnHover(item);
            }
        }
    };

    const handleBtnLeave = (selectedCategory) => {
        if (selectedCategory === firstCategory && isClickable) {
            setFirstBtnHover(null);
        } else {
            setSecondBtnHover(null);
        }
    }

    return (
        <div className='flex flex-col h-full w-full max-w-4xl justify-between'>
            <div className="font-semibold mt-4">{exercise.question}</div>
            <div className="flex flex-col">
                {Object.keys(userSelections).map((item) => (
                    <div key={item} className="flex row justify-between mb-2 items-center">
                        <p style={item_style} className="sm">{item}</p>
                        <div className="flex row">
                            <div
                                onClick={() => handleButtonClick(item, firstCategory)}
                                onMouseOver={() => handleBtnHover(item, firstCategory)}
                                onMouseLeave={() => handleBtnLeave(firstCategory)}
                                style={{
                                    ...button_style,
                                    ...(userSelections[item] === firstCategory ? {} : firstBtnHover === item ? { ...hover_style, outlineColor: color } : {}),
                                    ...(checkClicked
                                        ? { background: userSelections[item] === firstCategory ? firstItems.includes(item) ? correctColor : wrongColor : '#F6F5FC' }
                                        : { background: userSelections[item] === firstCategory ? color : '#F6F5FC' }
                                    ),
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
                                    ...(checkClicked
                                        ? { background: userSelections[item] === secondCategory ? secondItems.includes(item) ? correctColor : wrongColor : '#F6F5FC' }
                                        : { background: userSelections[item] === secondCategory ? color : '#F6F5FC' }
                                    ),
                                }}
                            >
                                {secondCategory}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end h-8">
                {showWarning &&
                    <div className="self-end font-bold mr-32" style={{ color: wrongColor }}>Bitte wähle alle Antworten aus</div>
                }
                {!allSelected &&
                    <div onClick={() => setShowWarning(true)} className="img-container flex">
                        <img src={check_logo_no} className="h-12" alt="Check Logo" />
                    </div>
                }
                {(allSelected && !checkClicked) &&
                    <div onClick={() => checkAnswer(userSelections)} className="img-container hover:opacity-85 cursor-pointer">
                        <img src={check_logo_yes} className="h-12" alt="Check Logo" />
                    </div>
                }
            </div>
        </div >
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
    width: '65%',
    padding: '5px 10px 5px 10px',
}

const button_style = {
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '10px',
    height: '30px',
    marginLeft: '10px',
    fontSize: 'calc(6px + 1vmin)',
    fontWeight: '600'
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