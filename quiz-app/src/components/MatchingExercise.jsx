import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MatchingExercise = ({ exercise, onAnswer }) => {
    // split correct pairs and save them
    const correctPairs = [
        [...exercise.correctPair1.split(';')],
        [...exercise.correctPair2.split(';')],
        [...exercise.correctPair3.split(';')],
        [...exercise.correctPair4.split(';')],
    ];

    // save shuffled definitions
    const shuffledPairs = shuffleArray(correctPairs);
    const shuffledDefinitions = shuffledPairs.map(pair => pair[1]);

    // save terms
    const terms = correctPairs.map(pair => pair[0]);

    // create Object to save which definition is matched with which term
    const [selected, setSelected] = useState(
        terms.reduce((t, term) => ({ ...t, [term]: null }), {})
    );

    const initialContainers = {
        containerDefault: {
            id: 'Definitionen:',
            list: shuffledDefinitions
        },
        container1: {
            id: terms[0],
            list: []
        },
        container2: {
            id: terms[1],
            list: []
        },
        container3: {
            id: terms[2],
            list: []
        },
        container4: {
            id: terms[3],
            list: []
        }
    }
    const [containers, setContainers] = useState(initialContainers);

    const handleOnDragEnd = (result) => {
        console.log('result: ', result);
        const source = result.source;
        const destination = result.destination;

        // make sure destination is valid
        if (destination === undefined || destination === null) return;

        // make sure item is actually being moved
        if (
            source.droppableId === destination.droppableId &&
            destination.index === source.index
        ) return;

        // set start and end variables
        const startId = source.droppableId;
        const endId = destination.droppableId;
        const startContainer = containers[getContainerNameFromId(startId)];
        const endContainer = containers[getContainerNameFromId(endId)];

        console.log('start container: ', startContainer);
        console.log('end container: ', endContainer);
        console.log('startid === endid? ', startId === endId);

        // if start and end ids are equal, container is the same
        if (startId === endId) {
            // move item within list
            const itemsList = startContainer.list;
            const [reorderdedList] = itemsList.splice(result.source.index, 1);
            itemsList.splice(result.destination.index, 0, reorderdedList);
            // update state
            setContainers(prevContainers => ({
                ...prevContainers,
                [getContainerNameFromId(startId)]: { id: startId, list: itemsList }
            }));
            return;
        } else {
            // multiple containers have to be updated if start and end ids aren't the same
            // create new start list without item
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