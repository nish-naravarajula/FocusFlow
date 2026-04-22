import Timer from "../components/Timer/Timer";
import SessionsGraph from "../components/Sessions/SessionsGraph";
import SessionHistory from "../components/Sessions/SessionHistory";
import PropTypes from "prop-types";
import "./Focus.css";

const Focus = ({ refreshTrigger, onSessionComplete }) => {
  return (
    <div className="focus-page">
      <div className="focus-left">
        <div className="focus-left-content">
          <SessionsGraph refreshTrigger={refreshTrigger} />
          <SessionHistory refreshTrigger={refreshTrigger} />
        </div>
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
