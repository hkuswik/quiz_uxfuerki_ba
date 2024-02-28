import QuestionExercise from "./QuestionExercise";
import MatchingExercise from "./MatchingExercise";
import SortingExercise from "./SortingExercise";

const Review = ({ reviewContent }) => {
    const exercise = reviewContent.exercise;
    const answersUser = reviewContent.answer;

    const renderContent = () => {
        switch (exercise.type) {
            case 'question':
                return <QuestionExercise exercise={exercise} answerUser={answersUser} />;
            case 'match':
                return <MatchingExercise exercise={exercise} answersUser={answersUser} />;
            case 'sort':
                return <SortingExercise exercise={exercise} answersUser={answersUser} />;
            default:
                return <div> error exercise type </div>;
        };
    };

    return (
        <div>
            {renderContent()}
        </div>
    )
}

export default Review;