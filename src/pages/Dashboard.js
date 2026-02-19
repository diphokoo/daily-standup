import PersonalDetails from '../components/PersonalDetails';
import TodaysStats from '../components/TodaysStats';
import Blockers from '../components/Blockers';
import Graph from '../components/Graph';
import sprintData from '../data/sprintData.json';

function Dashboard() {
  return (
    <div className="p-4">
      <h3 className="mb-4">{sprintData.projectName}</h3>
      <PersonalDetails />
      <TodaysStats />
      <Blockers />
      <Graph />
    </div>
  );
}

export default Dashboard;