import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import check_logo_yes from '../data/images/check-bl.png';
import check_logo_no from '../data/images/check-light.png';

const correctColor = '#7AD177';
const wrongColor = '#D24141';

const MatchingExercise = ({ exercise, onAnswer }) => {
    const [allMatched, setAllMatched] = useState(false);
    const [checkClicked, setCheckClicked] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const [color, setColor] = useState('#817C9C');
    const [containerColor, setContainerColor] = useState('#F1F0F4');

    useEffect(() => {
        switch (exercise.difficulty) {
            case 'easy':
                setColor('#D177B3');
                setContainerColor('#EECCE3');
                break;
            case 'medium':
                setColor('#8377D1');
                setContainerColor('#D1CCEE');
                break;
            case 'hard':
                setColor('#77D1CB');
                setContainerColor('#CCEEEC');
                break;
            default:
                setColor('#817C9C');
        }
    }, [exercise]);

    // split correct pairs and save them
    const correctPairs = Object.values(exercise)
        .filter(value => typeof value === 'string' && value.includes(';'))
        .map(pair => pair.split(';'));

    // save shuffled definitions
    const shuffledDefinitions = correctPairs.map(pair => pair[1]).sort(() => Math.random() - 0.5);

    // save terms
    const terms = correctPairs.map(pair => pair[0]);

    // create Object to save which definition is matched with which term
    const [selected, setSelected] = useState(
        terms.reduce((t, term) => ({ ...t, [term]: null }), {})
    );

    // save initial assignment of containers (all in default)
    const initialContainers = {
        containerDefault: { id: 'default', list: shuffledDefinitions },
        container1: { id: terms[0], list: [] },
        container2: { id: terms[1], list: [] },
        container3: { id: terms[2], list: [] },
        container4: { id: terms[3], list: [] }
    }
    const [containers, setContainers] = useState(initialContainers);

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

    const checkAnswers = () => {
        const selectedPairs = Object.entries(selected);

        let isCorrect = true;
        let newDefaultList = [];
        for (const [term, definition] of selectedPairs) {
            const correctDefinition = correctPairs.find(pair => pair[0] === term)[1];
            if (definition !== correctDefinition) {
                isCorrect = false;
                // move wrongly matched definition to default container
                newDefaultList.push(definition)
            };
        };

        setContainers(prevContainers => ({
            ...prevContainers,
            'containerDefault': { id: 'default', list: newDefaultList }
        }));

        setCheckClicked(true);
        onAnswer(isCorrect);
    };

    return (
        <div>
            <div className="font-semibold mb-4">{exercise.question}</div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <div className='flex row justify-between items-center'>
                    <div className='flex flex-col'>
                        {Object.values(containers).filter((container, index) => index > 0).map(filteredContainer => (
                            <DropContainer
                                key={filteredContainer.id}
                                container={filteredContainer}
                                color={color}
                                selected={selected}
                                correct={correctPairs}
                                checkClicked={checkClicked}
                            />
                        ))}
                    </div>
                    <div className='flex flex-col'>
                        <DropContainer
                            key={Object.values(containers)[0].id}
                            container={Object.values(containers)[0]}
                            color={color}
                            containerColor={containerColor}
                            selected={selected}
                            correct={correctPairs}
                            checkClicked={checkClicked}
                        />
                    </div>
                </div>
            </DragDropContext>
            <div className="flex justify-end mt-5">
                {showWarning &&
                    <div className="self-end font-bold mr-32" style={{ color: wrongColor }}>Bitte wähle alle Antworten aus</div>
                }
                {!allMatched &&
                    <div onClick={() => setShowWarning(true)} className="img-container flex">
                        <img src={check_logo_no} className="w-8 self-end" alt="Check Logo" />
                    </div>
                }
                {(allMatched && !checkClicked) &&
                    <div onClick={() => checkAnswers()} className="img-container hover:opacity-85 cursor-pointer">
                        <img src={check_logo_yes} className="w-8 justify-self-end" alt="Check Logo" />
                    </div>
                }
            </div>
        </div>
    );
};

// component for draggable definitions
const Definition = ({ defText, index, color, selected, correct, checkClicked, isDefault }) => {

    const matchIsCorrect = () => {
        const matchedTerm = Object.keys(selected).find(term => selected[term] === defText);
        const correctDef = correct.find(pair => pair[0] === matchedTerm)[1];
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
                                ? isDefault
                                    ? { background: wrongColor }
                                    : matchIsCorrect()
                                        ? { background: correctColor }
                                        : { background: '#F1F0F4' }
                                : { outlineColor: color }
                            )
                        }}
                        className={checkClicked ? '' : 'hover:outline-dashed hover:outline-2'}>
                        {!checkClicked && defText}
                        {checkClicked && !isDefault && !matchIsCorrect() &&
                            // search for correct def for term that this def was wrongly matched with
                            correct.find(pair => pair[0] === Object.keys(selected).find(t => selected[t] === defText))[1]
                        }
                        {checkClicked && isDefault && !matchIsCorrect() && defText}
                        {checkClicked && matchIsCorrect() && defText}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

// component for droppable container
const DropContainer = ({ container: { list, id }, color, containerColor, selected, correct, checkClicked }) => {
    const isDefault = id === 'default';

    return (
        <Droppable droppableId={id}>
            {provided => (
                <div className='flex flex-col items-center'>
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
                                correct={correct}
                                checkClicked={checkClicked}
                                isDefault={isDefault}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};

const dropContainer_style = {
    width: '350px',
    height: 'auto',
    minHeight: '80px',
    marginBottom: '15px',
    padding: '2px',
    borderRadius: '10px',
    background: '#F1F0F4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const term_style = {
    borderRadius: '10px 10px 0 0',
    width: '280px',
    textAlign: 'center',
    padding: '3px',
}

const defaultContainer_style = {
    width: '350px',
    height: '550px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '10px',
    padding: '5px'
}

const draggable_style = {
    background: 'white',
    width: '300px',
    height: 'auto',
    padding: '4px',
    margin: '5px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '10px',
    fontSize: '15px',
}

export default MatchingExercise;