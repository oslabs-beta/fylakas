import React from 'react';

const CurrentHealthTab = () => {

  return (
    <a className="nav-link d-flex align-items-center gap-2" href="#">
      {/* <svg className="bi">
        <use xlink:href="#graph-up"></use>
      </svg> */}
      <i class="bi bi-clipboard-heart-fill"></i>
      Current Health
    </a>
  );
};

export default CurrentHealthTab;