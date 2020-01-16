import React from 'react';
import AuthorList from './Components/AuthorList';
import BookList from './Components/BookList';
import NavBar from './Components/NavBar';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import AddAuthorForm from './Components/AddAuthorForm';

function App() {

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <NavBar />
        </header>
        <Switch>
          <Route path="/authors" component={AuthorList} />
          <Route path="/books" component={BookList} />
          <Route path="/" exact/>
        </Switch>
        
        <AddAuthorForm />
      </div>
    </Router>
  );
}

export default App;
