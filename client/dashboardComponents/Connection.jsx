import React from 'react';

const ConnectionModal = ({ modalVisible, closeModal }) => {
  if (!modalVisible) return null;


  return (
      <div className="modal modal-sheet position-static d-block bg-body-secondary p-4 py-md-5" tabindex="-1">
        <div className="modal-dialog">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-body p-5 pt-0">
              <form>
                  <div className="form-floating mb-3">
                    Prometheus Server URL:
                    <input className="form-control rounded-3"></input>
                  </div>
                  <div>
                    <button onClick={closeModal}>Connect</button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ConnectionModal;