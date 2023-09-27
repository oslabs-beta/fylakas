import React, {useState} from 'react';

const ConnectionModal = ({ modalVisible, closeModal }) => {
  if (!modalVisible) return null;

  // State to manage the text field value in the modal
  const [promURL, setPromURL] = useState('');
  
  // On "Connect" button click, make a fetch request to add new endpoint to current user account
  const handlePromURL = () => {
    fetch('api/prom/endpoint', {
      method: 'POST',
      body: JSON.stringify({promURL: promURL}),
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
      if (!response.ok) throw new Error('ERROR: Fetch in ConnectionModal\'s handlePromURL failed');
    })
    // Stop rendering this modal after the request is complete
    closeModal();
  }

  return (
    <div className="modal modal-sheet position-fixed d-flex align-items-center justify-content-center bg-transparent" style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
      <div className="modal-dialog">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-body p-5 pt-0">
            <form>
              <div className="form-floating mb-3">
                Prometheus Server URL:
                <input
                  className="form-control rounded-3"
                  value={promURL}
                  onChange={(e) => setPromURL(e.target.value)}
                ></input>
              </div>
              <div>
                <button onClick={(e) => {
                  e.preventDefault(),
                  handlePromURL();
                }}>Connect</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;