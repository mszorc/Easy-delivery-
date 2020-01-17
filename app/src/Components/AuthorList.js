import React from "react";
import axios from "axios";

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
      <ul>
        {this.state.authors.map(function(author, id) {
          return (
            <li key={id}>
              {author.id}{" "}
              <button
                className="btn btn-primary"
                onClick={() => DeleteAuthor(author)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    );
  }
}

export function AddToArray(author) {
  console.log(author.id);
  this.state.authors.push(author);
  this.setState(this);
}

export async function DeleteAuthor(author) {
  //await axios.delete(url + "author/" + author.id);
  this.state.authors.pop(author);
  this.setState(this);
}
