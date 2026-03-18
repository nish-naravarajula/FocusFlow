import Timer from "../components/Timer/Timer";
import SessionsGraph from "../components/Sessions/SessionsGraph";
import PropTypes from "prop-types";
import "./Focus.css";

const Focus = ({ refreshTrigger, onSessionComplete }) => {
  return (
    <div className="focus-page">
      <div className="focus-left">
        <SessionsGraph refreshTrigger={refreshTrigger} />
      </div>

      <div className="focus-right">
        <div className="timer-circle">
          <Timer onSessionComplete={onSessionComplete} />
        </div>
      </div>
    </div>
  );
};

Focus.propTypes = {
  refreshTrigger: PropTypes.number,
  onSessionComplete: PropTypes.func.isRequired,
};

Focus.defaultProps = {
  refreshTrigger: 0,
};

export default Focus;
