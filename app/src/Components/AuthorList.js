import React from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

let url = "http://localhost:3000/";

export default class AuthorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: []
    };
    this.AddToArray = AddToArray.bind(this);
    this.DeleteAuthor = DeleteAuthor.bind(this);
  }

  async componentDidMount() {
    await axios.get(url + "author").then(res => {
      console.log(res);
      this.setState({ authors: res.data });
    });
  }

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
          {this.state.authors.map(function(author, id) {
            return (
              <tr key={id}>
                <td>{author.id}</td>
                <td>{author.firstName}</td>
                <td>{author.lastName}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => DeleteAuthor(author)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

export function AddToArray(author) {
  console.log(author.id);
  this.state.authors.push(author);
  this.setState(this);
}

export async function DeleteAuthor(author) {
  await axios.delete(url + "author/" + author.id);
  //this.state.authors.pop(author);
  //this.setState(this);
}
