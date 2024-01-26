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

    // save terms
    const terms = correctPairs.map(pair => pair[0]);

    // create Object so save which definition is matched with which term
    const [selected, setSelected] = useState(
        terms.reduce((t, term) => ({ ...t, [term]: null }), {})
    );

    // save shuffled definitions
    const shuffledPairs = shuffleArray(correctPairs);
    const shuffledDefinitions = shuffledPairs.map(pair => pair[1]);
    console.log('shuffled def: ', shuffledDefinitions);
    const [definitions, setDefinitions] = useState(shuffledDefinitions);

    const initialCol = {
        notUsedDefs: {
            id: 'noch nicht verwendet',
            list: shuffledDefinitions
        },
        container1: {
            id: terms[0],
            list: []
        },
        container2: {
            id: terms[1],
            list: []
        }
    }
    const [cols, setCols] = useState(initialCol);

    const handleOnDragEnd = (result) => {
        console.log('result: ', result);
        if (!result.destination) return;
        const items = definitions;
        const [reorderedItems] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItems);

        setDefinitions(items);
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
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='notUsed'>
                    {provided => (
                        <ul {...provided.droppableProps} ref={provided.innerRef} style={col_style}>
                            {definitions.map((defText, index) => {
                                return (
                                    <Draggable
                                        key={defText}
                                        draggableId={defText}
                                        index={index}
                                    >
                                        {provided => (
                                            <li
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                            >
                                                {defText}
                                            </li>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
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

    console.log('def text: ', defText);
    console.log('def index: ', index);

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

const DropContainer = ({ col: { list, id } }) => {

    console.log('list: ', list);

    return (
        <Droppable droppableId={id}>
            {provided => (
                <div>
                    <h4>{id}</h4>
                    <div className='bg-teal-100 m-5 min-w-11 min-h-9' {...provided.droppableProps} ref={provided.innerRef}>
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

const col_style = {
    background: 'lightblue',
    margin: '5px',
    minWidth: '100px',
    minHeight: '100px'
}

export default MatchingExercise;