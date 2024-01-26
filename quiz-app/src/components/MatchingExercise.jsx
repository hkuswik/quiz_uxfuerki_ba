import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MatchingExercise = ({ exercise, onAnswer }) => {
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
        containerDefault: { id: 'Definitionen:', list: shuffledDefinitions },
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
        if (id === 'Definitionen:') return 'containerDefault';
        return `container${terms.indexOf(id) + 1}`;
    };

    useEffect(() => {
        console.log('containers: ', containers);
    }, [containers]);

    useEffect(() => {
        console.log('selected: ', selected);
    }, [selected]);

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
            <DragDropContext onDragEnd={handleOnDragEnd}>
                {Object.values(containers).map(container => (
                    <DropContainer key={container.id} container={container} />
                ))}
            </DragDropContext>
            <button onClick={checkAnswers} className='mt-20'>Check!</button>
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

const Definition = ({ defText, index }) => {

    return (
        <Draggable draggableId={defText} index={index}>
            {provided => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {defText}
                </div>
            )}
        </Draggable>
    );
};

const DropContainer = ({ container: { list, id } }) => {

    console.log('id: ', id);

    return (
        <Droppable droppableId={id}>
            {provided => (
                <div>
                    <p>{id}</p>
                    <div className='bg-teal-100 m-2 w-44 min-h-9' {...provided.droppableProps} ref={provided.innerRef}>
                        {list.map((defText, index) => (
                            <Definition key={defText} defText={defText} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    )
}

export default MatchingExercise;