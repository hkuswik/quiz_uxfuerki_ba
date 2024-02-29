import QuestionExercise from "./QuestionExercise";
import MatchingExercise from "./MatchingExercise";
import SortingExercise from "./SortingExercise";
import arrow_left from '../data/images/arrow_left.png';
import arrow_right from '../data/images/arrow_right.png';

const Review = ({ reviewContent, onReviewClick }) => {
    const exercise = reviewContent.exercise;
    const answersUser = reviewContent.answer;
    const exerciseNr = reviewContent.circle.substring(reviewContent.circle.indexOf('e') + 1);

    const renderContent = () => {
        switch (exercise.type) {
            case 'question':
                return <QuestionExercise exercise={exercise} answerUser={answersUser} />;
            case 'match':
                return (
                    <div className="h-full ml-5 mr-5 justify-center">
                        <MatchingExercise exercise={exercise} answersUser={answersUser} />
                    </div>
                );
            case 'sort':
                return (
                    <div className="h-full ml-5 mr-5">
                        <SortingExercise exercise={exercise} answersUser={answersUser} />
                    </div>
                );
            default:
                return <div> error exercise type </div>;
        };
    };

    return (
        <div className="flex flex-col h-full justify-between">
            <div></div>
            <div className="h-3/4">{renderContent()}</div>
            <div className="flex row justify-between items-center ml-2 relative bottom-0">
                <h4 className="w-20">{exerciseNr}/24</h4>
                <div className='flex row justify-self-center'>
                    <div className="img-container flex flex-col h-full justify-center">
                        <img src={arrow_left} onClick={() => onReviewClick('left')}
                            className="h-10 hover:opacity-70 cursor-pointer mr-3" alt="Pfeil nach links"
                        />
                    </div>
                    <div className="img-container flex flex-col h-full justify-center">
                        <img src={arrow_right} onClick={() => onReviewClick('right')}
                            className="h-10 hover:opacity-70 cursor-pointer" alt="Pfeil nach rechts"
                        />
                    </div>
                </div>
                <div className="w-20"></div>
            </div>
        </div>
    )
}

export default Review;