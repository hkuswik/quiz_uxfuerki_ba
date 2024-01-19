import weiter_logo from '../data/images/weiter_generic.png'

const topic1 = 'Vertrauen';
const topic2 = 'Diskriminierung';
const topic3 = 'Autonomie';

const Start = ({ onUpdate }) => {

    // TODO: add 2nd start popup (explanations for joker/progressBar)

    return (
        <div className="flex flex-col items-center text-center">
            <h2>Willkommen</h2>
            <h2>beim</h2>
            <h2 className='font-semibold'>Wegweiser.UX-für-KI Quiz</h2>
            <div className="w-9/12 mt-8">
                <p className="pb-3">
                    Du kannst dich hier selbstständig zu den Themen <b className="pink">{topic1}</b>, <b
                        className="lila">{topic2}</b> und <b className="türkis">{topic3}</b> testen.
                </p>
                <p>
                    Zu jedem Thema erhältst du zunächst ein kurzes <b>Szenario</b>, in das du dich reinversetzen sollst.
                    Zum Abschluss jedes Wegabschnitts erhältst du ein kurzes <b>Feedback</b>.
                </p>
            </div>
            <div className="img-container self-end pt-14 ">
                <img src={weiter_logo} className="h-20 hover:opacity-85 cursor-pointer" onClick={onUpdate} alt="weiter Logo" />
            </div>
        </div>
    )
}

export default Start;