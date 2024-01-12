import weiter_logo from '../data/images/weiter_generic.png'

const Start = ({ onUpdate }) => {

    return (
        <div className="flex flex-col items-center text-center">
            <h2>Willkommen</h2>
            <h2>beim</h2>
            <h2><b>Wegweiser.UX-für-KI Quiz</b></h2>
            <div className="w-9/12 mt-5">
                <p className="pb-3">
                    Du kannst dich hier selbstständig zu den Themen <b className="pink">Vertrauen</b>, <b
                        className="lila">Diskriminierung</b> und <b className="türkis">Autonomie</b> testen.
                </p>
                <p>
                    Zu jedem Thema erhältst du zunächst ein kurzes <b>Szenario</b>, in das du dich reinversetzen sollst.
                    Zum Abschluss jedes Wegabschnitts erhältst du ein kurzes <b>Feedback</b>.
                </p>
            </div>
            <div className="img-container self-end pt-10 pr-5">
                <img src={weiter_logo} className="h-20 hover:opacity-85 cursor-pointer" onClick={onUpdate} alt="weiter Logo" />
            </div>
        </div>
    )
}

export default Start;