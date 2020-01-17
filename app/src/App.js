import React from "react";
import AuthorList from "./Components/AuthorList";
import BookList from "./Components/BookList";
import NavBar from "./Components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Button } from "react-bootstrap";
import { AuthorFormModal } from "./Components/AuthorFormModal";

function App() {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <NavBar />
        </header>
        <Switch>
          <Route path="/authors" component={AuthorList} />
          <Route path="/books" component={BookList} />
          <Route path="/" exact />
        </Switch>
        <Button variant="primary" onClick={() => setModalShow(true)}>
          Launch vertically centered modal
        </Button>
        <AuthorFormModal show={modalShow} onHide={() => setModalShow(false)} />
      </div>
    </Router>
  );
}

export default App;
