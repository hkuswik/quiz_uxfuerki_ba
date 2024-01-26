import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import check_logo_yes from '../data/images/check-bl.png';
import check_logo_no from '../data/images/check-light.png';

const MatchingExercise = ({ exercise, onAnswer }) => {
    const [allSelected, setAllSelected] = useState(false);
    const [checkClicked, setCheckClicked] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const [color, setColor] = useState('#817C9C');
    const correctColor = '#7AD177';
    const wrongColor = '#D24141';

    useEffect(() => {
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
            }))

            // remove dragged item from it's current matched term (if there is one) in selected
            const currentMatchedTerm = Object.keys(selected).find(term => selected[term] === draggedDefId);
            if (typeof currentMatchedTerm !== "undefined") {
                setSelected(prevSelected => ({
                    ...prevSelected,
                    [currentMatchedTerm]: null
                }))
            }

            // update selected with new match if new container isn't default
            if (endName !== 'containerDefault') {
                setSelected(prevSelected => ({
                    ...prevSelected,
                    [endContainer.id]: draggedDefId
                }))
            }

            return;
        }
    }

    // helper function: gets id and returns name of drop container
    const getContainerNameFromId = (id) => {
        if (id === 'default') return 'containerDefault';
        return `container${terms.indexOf(id) + 1}`;
    };

    const handleWarning = () => {
        setShowWarning(true);
    }

    const checkAnswers = () => {
        const selectedPairs = Object.entries(selected);

        let isCorrect = true;

        for (const [term, definition] of selectedPairs) {
            const correctDefinition = correctPairs.find(pair => pair[0] === term)[1];
            if (definition !== correctDefinition) {
                isCorrect = false;
                break; // exit loop if any pair is incorrect
            }
        }

        console.log('answer was correct: ', isCorrect);
    };

    return (
        <div>
            <div className="font-semibold mb-5">{exercise.question}</div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <div className='flex row justify-between items-center'>
                    <div className='flex flex-col'>
                        {Object.values(containers).filter((container, index) => index > 0).map(filteredContainer => (
                            <DropContainer key={filteredContainer.id} container={filteredContainer} color={color} />
                        ))}
                    </div>
                    <div className='flex flex-col'>
                        <DropContainer key={Object.values(containers)[0].id} container={Object.values(containers)[0]} color={color} />
                    </div>
                </div>
            </DragDropContext>
            <div className="flex justify-end">
                {showWarning &&
                    <div className="self-end font-bold mr-28" style={{ color: wrongColor }}>Bitte wähle alle Antworten aus</div>
                }
                {!allSelected &&
                    <div onClick={() => handleWarning()} className="img-container flex">
                        <img src={check_logo_no} className="w-9 self-end" alt="Check Logo" />
                    </div>
                }
                {(allSelected && !checkClicked) &&
                    <div onClick={() => checkAnswers()} className="img-container hover:opacity-85 cursor-pointer">
                        <img src={check_logo_yes} className="w-9 justify-self-end" alt="Check Logo" />
                    </div>
                }
            </div>
        </div>
    );
};

// helper function: shuffles array and returns it
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const Definition = ({ defText, index, color }) => {

    return (
        <Draggable draggableId={defText} index={index}>
            {provided => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <div style={{ ...draggable_style, outlineColor: color }} className={'hover:outline-dashed hover:outline-2'}>
                        {defText}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

const DropContainer = ({ container: { list, id }, color }) => {

    const isDefault = id === 'default';

    return (
        <Droppable droppableId={id}>
            {provided => (
                <div>
                    <p>{!isDefault && id}</p>
                    <div style={isDefault ? defaultContainer_style : { ...dropContainer_style, outlineColor: color }}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {list.map((defText, index) => (
                            <Definition key={defText} defText={defText} index={index} color={color} />
                        ))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};

const dropContainer_style = {
    width: '300px',
    height: '80px',
    marginBottom: '10px',
    padding: '5px',
    borderRadius: '10px',
    background: '#F6F5FC',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const defaultContainer_style = {
    width: '300px',
    height: '400px',
    background: '#D4D2DD',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: '10px'
}

const draggable_style = {
    background: 'white',
    width: '200px',
    height: 'auto',
    padding: '2px',
    margin: '5px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '10px'
}

export default MatchingExercise;