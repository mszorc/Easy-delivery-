import React from "react";
import AuthorList from "./Components/AuthorList";
import BookList from "./Components/BookList";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="App">
        <div className="container" id="main">
          <Switch>
            <Route path="/authors">
              <AuthorList />
            </Route>
            <Route path="/books" component={BookList} />
            <Route path="/" exact />
          </Switch>
        </div>
      </div>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
