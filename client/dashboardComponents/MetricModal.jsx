return (
    <div className="modal modal-sheet position-static d-block bg-body-secondary p-4 py-md-5" tabindex="-1">
      <div className="modal-dialog">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-body p-5 pt-0">
            <form>
                <div className="form-floating mb-3">
                  Metric Name:
                  <input className="form-control rounded-3"></input>
                </div>
                <div className="form-floating mb-3">
                  Metric Type:
                  <ul className="dropdown-menu position-static d-grid gap-1 p-2 rounded-3 mx-0 shadow w-220px" data-bs-theme="light">

                  </ul>
                </div>
                <div className="form-floating mb-3">
                  Context:
                  <ul className="dropdown-menu position-static d-grid gap-1 p-2 rounded-3 mx-0 shadow w-220px" data-bs-theme="light">

                  </ul>
                </div>
                <div className="form-floating mb-3">
                  Group By:
                  <ul className="dropdown-menu position-static d-grid gap-1 p-2 rounded-3 mx-0 shadow w-220px" data-bs-theme="light">

                  </ul>
                </div>
                <div>
                  <button>Save</button>
                  <button>Close</button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
);