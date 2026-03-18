import SessionsGraph from "../components/Sessions/SessionsGraph";
import SessionHistory from "../components/Sessions/SessionHistory";
import StreakDisplay from "../components/Sessions/StreakDisplay";
import PropTypes from "prop-types";
import "./Home.css";

const Home = ({ refreshTrigger }) => {
  return (
    <div className="home-page">
      <div className="home-left">
        <h2>Tasks</h2>
        <div className="task-placeholder">
          <p className="placeholder-note">Vee&apos;s task list goes here</p>
        </div>
      </div>

      <div className="home-center">
        <SessionsGraph refreshTrigger={refreshTrigger} />
        <div className="history-box">
          <h2>Session History</h2>
          <SessionHistory refreshTrigger={refreshTrigger} />
        </div>
      </div>

      <div className="home-right">
        <h2>Stats</h2>
        <StreakDisplay refreshTrigger={refreshTrigger} />
        <div className="task-status">
          <p className="placeholder-note">Vee&apos;s Late/TODO/Done list</p>
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  refreshTrigger: PropTypes.number,
};

Home.defaultProps = {
  refreshTrigger: 0,
};

export default Home;
