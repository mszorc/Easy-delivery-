import React from "react";
import "bootstrap/dist/css/bootstrap.css";

export default class NavBar extends React.Component {
  render() {
    return (
      <nav
        className="navbar sticky-top navbar-expand-sm navbar-toggleable-sm navbar-dark"
        role="navigation"
      >
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              Easy delivery
            </a>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse"
            aria-expanded="false"
            aria-controls="navbarCollapse"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item active">
                <a className="nav-link" href="books">
                  Books
                </a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="authors">
                  Authors
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
