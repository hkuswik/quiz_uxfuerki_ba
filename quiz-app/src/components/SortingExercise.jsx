import { useEffect, useState } from "react";
import check_logo_yes from '../data/images/check-bl.png';
import check_logo_no from '../data/images/check-light.png';

const topic1 = 'UX Grundlagen';
const topic2 = 'UCD Prozess';
const topic3 = 'Evaluation';

const correctColor = '#7AD177';
const wrongColor = '#D24141';

// popup content when exercise is of type 'sort'
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

    // save categories, call prepare function and set design color according to topic
    useEffect(() => {
        prepareItems(exercise);
        setFirstCategory(exercise.firstContainer);
        setSecondCategory(exercise.secondContainer);

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

    // save all items that have to be sorted and shuffle them
    const prepareItems = (exercise) => {
        const first = exercise.belongsInFirst.split(';');
        const second = exercise.belongsInSecond.split(';');
        setFirstItems(first);
        setSecondItems(second);

        const items = first.concat(second);
        shuffleArray(items);

        // create map in which selections for each item are saved
        setUserSelections(items.reduce((userSelectionsMap, item) => {
            // accumulate user selections for each item
            userSelectionsMap[item] = ''; // initialize user selection for each item with empty string
            return userSelectionsMap;
        }, {}));
    };

    // logic for clicking on category button (and sorting item to that category)
    const handleButtonClick = (item, category) => {
        if (!isClickable) return; // disable clicking when answers have been logged in

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

        // hide warning again when next category is clicked
        showWarning && setShowWarning(false);

        // save new selections
        setUserSelections(newSelections);
    };

    // checks if selections were correct after check button is clicked
    const checkAnswer = (selected) => {
        if (!allSelected) {
            console.log('not all answers selected :(');
        } else {
            setCheckClicked(true);
            setIsClickable(false); // disable clicking functionality
            // iterate through selected map and check if selected category for item corresponds to correct category
            for (const [item, category] of Object.entries(selected)) {
                if (category === firstCategory && !firstItems.includes(item)) {
                    onAnswer(false);
                    return; // set false and return as soon as an item is sorted wrongly
                } else if (category === secondCategory && !secondItems.includes(item)) {
                    onAnswer(false);
                    return;
                }
            };
            onAnswer(true); // true if no item was sorted wrong
        };
    };

    // sets hovered button depending on if a category is already selected and which button is the hovered one
    const handleBtnHover = (item, selectedCategory) => {
        if (userSelections[item] !== selectedCategory && isClickable) { // no hover effect if already selected or not clickable
            if (selectedCategory === firstCategory) {
                setFirstBtnHover(item);
            } else {
                setSecondBtnHover(item);
            };
        };
    };

    // resets the hovered button
    const handleBtnLeave = (selectedCategory) => {
        if (selectedCategory === firstCategory) {
            setFirstBtnHover(null);
        } else {
            setSecondBtnHover(null);
        };
    };

    return (
        <div className='flex flex-col h-full w-full justify-around'>
            <div className="font-semibold">{exercise.question}</div>
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
            <div className="flex row justify-between items-end h-8">
                <div></div>
                {showWarning &&
                    <div className="font-bold" style={{ color: wrongColor }}>Bitte wähle alle Antworten aus</div>
                }
                {!allSelected &&
                    <div onClick={() => setShowWarning(true)} className="img-container flex">
                        <img src={check_logo_no} className="w-9" alt="Check Logo" />
                    </div>
                }
                {(allSelected && !checkClicked) &&
                    <div onClick={() => checkAnswer(userSelections)} className="img-container hover:opacity-85 cursor-pointer">
                        <img src={check_logo_yes} className="w-9" alt="Check Logo" />
                    </div>
                }
            </div>
        </div >
    );
};

// helper function: shuffles given array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

// styles
const item_style = {
    background: 'white',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    width: '65%',
    padding: '5px 10px 5px 10px',
};

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
};

const hover_style = {
    outline: '2px dashed',
    cursor: 'pointer'
};

export default SortingExercise;