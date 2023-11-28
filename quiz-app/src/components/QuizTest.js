import { useState, useEffect } from 'react';

import quizData from './../data/questions_onlyUX.json';

function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [easyQuestions, setEasyQuestions] = useState([]);
  const [mediumQuestions, setMediumQuestions] = useState([]);
  const [hardQuestions, setHardQuestions] = useState([]);

  useEffect(() => {

      const easyQ= quizData.filter((q) => q.difficulty === 'easy');
      const mediumQ = quizData.filter((q) => q.difficulty === 'medium');
      const hardQ = quizData.filter((q) => q.difficulty === 'hard');

      shuffleArray(easyQ);
      shuffleArray(mediumQ);
      shuffleArray(hardQ);

      setEasyQuestions(easyQ);
      setMediumQuestions(mediumQ);
      setHardQuestions(hardQ);
  }, []);

  var radius = "40";
  var stillWalkable = true;

  const renderBoard = () => {
      const circleColors = { easy: 'green', medium: 'orange', hard: 'red', completed: 'grey' };
      const circles = ['start', ...Array(6).fill(null).map((_, index) => index), 'goal'];
      circles.map((circle, index) => (
          <circle
              key={index}
              cx={index * 70 + 35}
              cy={30}
              r={circle === 'start' || circle === 'goal' ? 20 : 15}
              fill={
                  index < currentQuestionIndex
                      ? circleColors.completed
                      : circle === 'start' || circle === 'goal'
                          ? circleColors.completed
                          : circleColors[quizData[index].difficulty]
              }
              stroke="black"
              style={{ cursor: index === currentQuestionIndex ? 'pointer' : 'default' }}
          />
      ));
  };

  return (
      <div className='Quiz'>

          {/* <div>
              {easyQuestions.map(({ id, type, question }) => (
                  <div key={id}>
                      {type}: {question}
                  </div>
              ))}
          </div> */}
          {/* <svg width="500" height="500">
              <circle style={circle} cx="50" cy="50" r={radius} fill={stillWalkable ? easy : notPossible}></circle>
              <circle style={circle} cx="200" cy="50" r={radius} fill={stillWalkable ? medium : notPossible}></circle>
              <circle style={circle} cx="50" cy="200" r={radius} fill={stillWalkable ? hard : notPossible}></circle>
          </svg> */}
          <div>
              <svg width="500" height="100">
                  {renderBoard()}
              </svg>
          </div>

      </div>
  )
}

// Function to shuffle an array in-place
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// Function to randomize questions based on difficulty
const randomizeQuestions = (questions) => {
  const easyQuestions = questions.filter((q) => q.difficulty === 'easy');
  const mediumQuestions = questions.filter((q) => q.difficulty === 'medium');
  const hardQuestions = questions.filter((q) => q.difficulty === 'hard');

  shuffleArray(easyQuestions);
  shuffleArray(mediumQuestions);
  shuffleArray(hardQuestions);

  return [...easyQuestions, ...mediumQuestions, ...hardQuestions];
};

const QuizTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState({ easy: 0, medium: 0, hard: 0 });

  useEffect(() => {
    // Randomize questions when starting the quiz
    const randomizedQuestions = randomizeQuestions(quizData);
    // Set the randomized questions as the quiz data
    const data = randomizedQuestions;
  }, []);

  const handleAnswerSubmit = (userAnswer) => {
    const currentQuestion = quizData[currentQuestionIndex];

    if (currentQuestion.type === 'question') {
      const isCorrect = userAnswer === currentQuestion.correctOption;
      // Handle scoring or other logic based on correctness

      setProgress((prevProgress) => ({
        ...prevProgress,
        [currentQuestion.difficulty]: prevProgress[currentQuestion.difficulty] + 1,
      }));
    }

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    // Reset progress when all questions of a difficulty level are used
    const totalQuestions = quizData.filter((item) => item.difficulty === 'easy').length +
      quizData.filter((item) => item.difficulty === 'medium').length +
      quizData.filter((item) => item.difficulty === 'hard').length;

    if (progress.easy === totalQuestions / 3 && progress.medium === totalQuestions / 3 && progress.hard === totalQuestions / 3) {
      setProgress({ easy: 0, medium: 0, hard: 0 });
    }
  }, [progress, quizData]);

  const renderProgressPath = () => {
    const colors = { easy: 'green', medium: 'orange', hard: 'red' };

    return quizData.map((item, index) => (
      <circle
        key={item.id}
        cx={index * 40 + 20}  // Adjust the positioning as needed
        cy={30}
        r={15}
        fill={colors[item.difficulty]}
        stroke="black"
      />
    ));
  };

  const renderCurrentQuestion = () => {
    const currentQuestion = quizData[currentQuestionIndex];

    if (!currentQuestion) {
      return <p>Congratulations! You've completed the quiz.</p>;
    }

    switch (currentQuestion.type) {
      case 'question':
        return (
          <div>
            <p>{currentQuestion.question}</p>
            {currentQuestion.options.map((option) => (
              <button key={option} onClick={() => handleAnswerSubmit(option)}>
                {option}
              </button>
            ))}
          </div>
        );
      case 'matching':
        // Implement matching component logic
        return <p>Implement Matching Component</p>;
      case 'sorting':
        // Implement sorting component logic
        return <p>Implement Sorting Component</p>;
      default:
        return null;
    }
  };

  return (
    <div>
      <svg width="500" height="100">
        {renderProgressPath()}
      </svg>
        {renderCurrentQuestion()}
    </div>
  );
};

export default QuizTest;