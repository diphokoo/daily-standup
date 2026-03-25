import PersonalDetails from '../components/PersonalDetails';
import TodaysStats from '../components/TodaysStats';
import Blockers from '../components/Blockers';
import Graph from '../components/Graph';
import PageHeader from '../components/PageHeader';

function Dashboard() {
  return (
    <div className="p-4">
      <PageHeader page="Dashboard" />
      <PersonalDetails />
      <TodaysStats />
      <Blockers />
      <Graph />
    </div>
  );
}

export default Dashboard;
