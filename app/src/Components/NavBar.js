import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'

export default class NavBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href=" ">Easy delivery</a>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="suppliers">Suppliers</a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="products">Products</a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }

}