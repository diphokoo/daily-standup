function TodaysStats() {
  return (
    <div className="d-flex gap-3 mb-4">
      <div className="col-md-7 card rounded p-3">
        <h5>Today's Stats</h5>

        <div className="d-flex gap-3 mt-3">
          <div className="flex-fill rounded p-2 loggedInContent">
            <h6>
              Completed
            </h6>
            <h3>
              3
            </h3>
          </div>
          <div className="flex-fill rounded p-2 loggedInContent">
            <h6>  To Do </h6>
            <h3> 2 </h3>          
          </div>
        </div>
      </div>

      <div className="col-md-5 card rounded p-3">
          <h5>Daily Entries</h5>

          <h6 className="mt-3"> Gave updates to the team </h6>

          <p className="text-muted mt-3"> 11:30 AM </p>
      </div>
    </div>
  );
}

export default TodaysStats;