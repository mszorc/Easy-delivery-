import React from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { EditAuthorForm } from "./EditAuthorForm";

let url = "http://localhost:3000/";

export default class AuthorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: []
    };
    this.AddToArray = AddToArray.bind(this);
    this.modalShow = {
      show: false
    };
  }

  async componentDidMount() {
    await axios.get(url + "author").then(res => {
      this.setState({ authors: res.data });
    });
  }

  onRemoveItem = async id => {
    await axios.delete(url + "author/" + id);
    this.setState(state => {
      const authors = state.authors.filter(item => item.id !== id);
      return {
        authors
      };
    });
  };

  setModalShow = event => {
    this.modalShow.show = event;
    this.setState(this);
    //this.setModalShow(this.modalShow);
  };

  render() {
    return (
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>id</th>
            <th>First name</th>
            <th>Last name</th>
          </tr>
        </thead>
        <tbody>
          {this.state.authors.map(author => (
            <tr key={author.id}>
              <td>{author.id}</td>
              <td>{author.firstName}</td>
              <td>{author.lastName}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => this.onRemoveItem(author.id)}
                >
                  Remove
                </button>
                <Button
                  variant="primary"
                  onClick={() => this.setModalShow(true)}
                >
                  Edit
                </Button>
                <EditAuthorForm
                  show={this.modalShow.show}
                  onHide={() => this.setModalShow(false)}
                  id={author.id}
                  firstname={author.firstName}
                  lastname={author.lastName}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export function AddToArray(author) {
  this.setState(state => {
    const authors = state.authors.push(author);
    return {
      authors
    };
  });
}
