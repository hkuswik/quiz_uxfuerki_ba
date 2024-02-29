import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import check_btn from '../data/images/überprüfen_btn.png';

const topic1 = 'UX Grundlagen';
const topic2 = 'UCD Prozess';
const topic3 = 'Evaluation';

const correctColor = '#7AD177';
const wrongColor = '#D24141';

// popup content when exercise is of type 'match'
const MatchingExercise = ({ exercise, onAnswer, answersUser = null }) => {
    const [allMatched, setAllMatched] = useState(false);
    const [checkClicked, setCheckClicked] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const [containers, setContainers] = useState({});
    const [color, setColor] = useState('');
    const [containerColor, setContainerColor] = useState('');

    const [correctPairs, setCorrectPairs] = useState([]);
    const [terms, setTerms] = useState([]);
    const [selected, setSelected] = useState({});

    // set all variables when new exercise is given as prop
    useEffect(() => {
        // set design colors depending on topic
        switch (exercise.topic) {
            case topic1:
                setColor('#D177B3');
                setContainerColor('#EECCE3');
                break;
            case topic2:
                setColor('#8377D1');
                setContainerColor('#D1CCEE');
                break;
            case topic3:
                setColor('#77D1CB');
                setContainerColor('#CCEEEC');
                break;
            default:
                setColor('#817C9C');
        };

        // split correct pairs and save them
        const newCorrectPairs = Object.values(exercise)
            .filter(value => typeof value === 'string' && value.includes(';'))
            .map(pair => pair.split(';'));
        // save terms
        const newTerms = newCorrectPairs.map(pair => pair[0]);
        // shuffle definitions
        const shuffledDefinitions = newCorrectPairs.map(pair => pair[1]).sort(() => Math.random() - 0.5);
        // save initial assignment of containers (all elements in default)
        const initialContainers = {
            containerDefault: { id: 'default', list: shuffledDefinitions },
            container1: { id: newTerms[0], list: [] },
            container2: { id: newTerms[1], list: [] },
            container3: { id: newTerms[2], list: [] },
            container4: { id: newTerms[3], list: [] }
        };

        // create Object to save which definition is matched with which term and save in State
        setSelected(newTerms.reduce((t, term) => ({ ...t, [term]: null }), {}));

        // save all other variables in State as well
        setContainers(initialContainers);
        setTerms(newTerms);
        setCorrectPairs(newCorrectPairs);
    }, [exercise]);

    // for review, create containers with answers user has selected
    useEffect(() => {
        // make sure saved answers aren't null
        if (answersUser !== null) {
            const containerKeys = ['container1', 'container2', 'container3', 'container4',];
            const reviewContainers = { containerDefault: { id: 'default', list: [] } };
            // iterate through user answers and save terms (keys) as ids and definitions (values) in lists
            Object.keys(answersUser).forEach((key, index) => {
                const containerKey = containerKeys[index];
                reviewContainers[containerKey] = {
                    id: key,
                    list: [answersUser[key]]
                };
            });
            // set selected to saved users answers and update state
            setSelected(answersUser);
            setContainers(reviewContainers);
            setCheckClicked(true);
        };
    }, [answersUser]);

    // functionality for dragging an item
    const handleOnDragEnd = (result) => {
        const source = result.source;
        const destination = result.destination;
        const draggedDefId = result.draggableId;

        // make sure destination is valid
        if (destination === undefined || destination === null) return;

        // make sure item is actually being moved
        if (source.droppableId === destination.droppableId && destination.index === source.index) return;

        // remove warning after next movement
        showWarning && setShowWarning(false);

        // set start and end variables
        const startName = getContainerNameFromId(source.droppableId);
        const endName = getContainerNameFromId(destination.droppableId);
        const startContainer = containers[startName];
        const endContainer = containers[endName];

        // if start and end ids are equal, container is the same
        if (startName === endName) {
            // move item within list
            const itemsList = startContainer.list;
            const [reorderdedList] = itemsList.splice(source.index, 1);
            itemsList.splice(destination.index, 0, reorderdedList);

            // update state
            setContainers(prevContainers => ({
                ...prevContainers,
                [startName]: { id: startContainer.id, list: itemsList }
            }));
            return;
        } else { // item is moved; have to update multiple containers
            // return if there is already an item in a container that is not the default container
            if (endName !== 'containerDefault' && endContainer.list.length !== 0) return;

            // create new start list without item
            const newStartList = startContainer.list.filter(item => item !== draggedDefId);

            // create new end list and insert item
            const newEndList = endContainer.list;
            newEndList.splice(destination.index, 0, draggedDefId);

            // update state
            setContainers(prevContainers => ({
                ...prevContainers,
                [startName]: { id: startContainer.id, list: newStartList },
                [endName]: { id: endContainer.id, list: newEndList }
            }));

            // remove dragged item from it's current matched term (if there is one) in selected
            const currentMatchedTerm = Object.keys(selected).find(term => selected[term] === draggedDefId);
            if (typeof currentMatchedTerm !== "undefined") {
                setSelected(prevSelected => ({
                    ...prevSelected,
                    [currentMatchedTerm]: null
                }));
            };

            // update selected with new match if new container isn't default
            if (endName !== 'containerDefault') {
                setSelected(prevSelected => ({
                    ...prevSelected,
                    [endContainer.id]: draggedDefId
                }));
            };

            // if startContainer = defaultContainer and it had only 1 item left; all items are now matched
            if (startName === 'containerDefault' && startContainer.list.length <= 1) setAllMatched(true);

            // if an item is put back in the defaultContainer, not all items are matched
            if (endName === 'containerDefault' && endContainer.list.length >= 0) setAllMatched(false);
        };
    };

    // helper function: gets id and returns name of drop container
    const getContainerNameFromId = (id) => {
        if (id === 'default') return 'containerDefault';
        return `container${terms.indexOf(id) + 1}`;
    };

    // checks if all definitions are matched with corresponding terms
    const checkAnswers = () => {
        if (!allMatched) {
            setShowWarning(true);
            return;
        };

        const selectedPairs = Object.entries(selected);

        let isCorrect = true;
        // iterate through all matches and set isCorrect to false if a match is wrong
        for (const [term, definition] of selectedPairs) {
            const correctDefinition = correctPairs.find(pair => pair[0] === term)[1];
            if (definition !== correctDefinition) {
                isCorrect = false;
            };
        };

        setCheckClicked(true);
        onAnswer(isCorrect, selected);
    };

    return (
        <div className='flex flex-col h-full w-full justify-around'>
            <div className="font-semibold mb-4">{exercise.question}</div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                {Object.keys(containers).length > 0 &&
                    <div className='flex flex-col h-full w-full justify-around'>
                        <div className='flex row flex-wrap w-full justify-around'>
                            {Object.values(containers).filter((container, index) => index > 0).map(filteredContainer => (
                                <DropContainer
                                    key={filteredContainer.id}
                                    exercise={exercise}
                                    container={filteredContainer}
                                    color={color}
                                    selected={selected}
                                    correctPairs={correctPairs}
                                    checkClicked={checkClicked}
                                />
                            ))}
                        </div>
                        <div>
                            <DropContainer
                                key={Object.values(containers)[0].id}
                                exercise={exercise}
                                container={Object.values(containers)[0]}
                                color={color}
                                containerColor={containerColor}
                                selected={selected}
                                correctPairs={correctPairs}
                                checkClicked={checkClicked}
                            />
                        </div>
                    </div>
                }
            </DragDropContext>
            <div className="flex row justify-between items-center">
                <div className='w-28'></div>
                {showWarning &&
                    <div className="font-bold" style={{ color: wrongColor }}>Bitte ordne alle Antworten zu</div>
                }
                {!checkClicked &&
                    <div onClick={() => checkAnswers()}
                        className={allMatched ? "img-container cursor-pointer hover:opacity-80" : "img-container opacity-40"}
                    >
                        <img src={check_btn} className="w-28" alt="Überprüfen Button" />
                    </div>
                }
            </div>
        </div>
    );
};

// component for draggable definitions
const Definition = ({ defText, index, color, selected, correctPairs, checkClicked }) => {
    // check if match was correct (to have correctColor after clicking on check)
    const matchIsCorrect = () => {
        const matchedTerm = Object.keys(selected).find(term => selected[term] === defText);
        const correctDef = correctPairs.find(pair => pair[0] === matchedTerm)[1];
        return correctDef === defText;
    };

    return (
        <Draggable draggableId={defText} index={index} isDragDisabled={checkClicked}>
            {provided => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <div
                        style={{
                            ...draggable_style,
                            ...(checkClicked
                                ? matchIsCorrect()
                                    ? { background: correctColor }
                                    : { background: wrongColor }
                                : { outlineColor: color }
                            )
                        }}
                        className={checkClicked ? '' : 'hover:outline-dashed hover:outline-2'}>
                        {defText}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

// component for droppable container
const DropContainer = ({ container: { list, id }, color, containerColor, selected, correctPairs, checkClicked }) => {
    // check if container is defaultContainer (has different style)
    const isDefault = id === 'default';

    return (
        <Droppable droppableId={id}>
            {provided => (
                <div className='drop-container flex flex-col items-center' style={isDefault ? { width: '100%' } : { width: '45%' }}>
                    <p style={!isDefault ? { ...term_style, background: color } : {}}>{!isDefault && id}</p>
                    <div
                        style={isDefault ? { ...defaultContainer_style, background: containerColor } : dropContainer_style}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {list.map((defText, index) => (
                            <Definition
                                key={defText}
                                defText={defText}
                                index={index}
                                color={color}
                                selected={selected}
                                correctPairs={correctPairs}
                                checkClicked={checkClicked}
                            />
                        ))}
                        {isDefault && checkClicked &&
                            <div>
                                <div className='text-center font-semibold text-sm'>Lösungen:</div>
                                {correctPairs.map((pair, index) => (
                                    <div key={index}>
                                        <p className='sm p-1'><b>{pair[0]}:</b> {pair[1]}</p>
                                    </div>
                                ))}
                            </div>
                        }
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};

// styles
const dropContainer_style = {
    width: '100%',
    height: 'auto',
    minHeight: '80px',
    borderRadius: '10px',
    background: '#F1F0F4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const term_style = {
    borderRadius: '10px 10px 0 0',
    textAlign: 'center',
    padding: '3px 10px 3px 10px',
};

const defaultContainer_style = {
    width: '100%',
    height: 'auto',
    minHeight: '20vh',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    padding: '5px'
};

const draggable_style = {
    background: 'white',
    width: '23em',
    height: 'auto',
    padding: '4px',
    margin: '5px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '10px',
    fontSize: '12px',
};

export default MatchingExercise;