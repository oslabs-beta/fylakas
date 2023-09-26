import React, {useState} from 'react';

const PageMode = () => {
  //Initialize theme state
//   const [theme, setTheme] = useState('light');
//   const toggleTheme = (newTheme) => {
//     document.documentElement.setAttribute('data-theme', newTheme); // Set the data-theme attribute on the HTML element
//     setTheme(newTheme); // Update state
//   };
  return (
    <div>
    <button className="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (light)">
        <svg className="bi my-1 theme-icon-active" width="1em" height="1em">
            <use href="#sun-fill"></use>
        </svg>
        <span className="visually-hidden" id="bd-theme-text">
            Toggle theme
        </span>
        ::after
    </button>
    <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
        <li>
          {/* <button type="button" className={`"dropdown-item d-flex align-items-center" ${theme === 'light' ? 'active' : ''}`} onClick={() => toggleTheme('light')} aria-pressed={theme === 'light'}> */}
          <button type="button" className="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="true">
            <svg className="bi me-2 opacity-50 theme-icon" width="1em" height="1em">
                <use href="#sun-fill"></use>
            </svg>
            Light
            <svg className="bi ms-auto d-none" width="1em" height="1em">
                <use href="#check2"></use>
            </svg>
          </button>
        </li>
        <li>
          {/* <button type="button" className={`"dropdown-item d-flex align-items-center active" ${theme === 'dark' ? 'active' : ''}`} onClick={() => toggleTheme('dark')} aria-pressed={theme === 'dark'}> */}
          <button type="button" className="dropdown-item d-flex align-items-center active" data-bs-theme-value="dark" aria-pressed="false">
            <svg className="bi me-2 opacity-50 theme-icon" width="1em" height="1em">
                <use href="#moon-stars-fill"></use>
            </svg>
            Dark
            <svg className="bi ms-auto d-none" width="1em" height="1em">
                <use href="#check2"></use>
            </svg>
          </button>
        </li>
    </ul>
    </div>
  );
};

export default PageMode;