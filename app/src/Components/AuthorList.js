import React from "react";
import axios from "axios";

let url = "http://localhost:3000/";

export default class AuthorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: []
    };
    AddToArray = AddToArray.bind(this);
  }
  componentDidMount() {
    axios.get(url + "author").then(res => {
      console.log(res);
      this.setState({ authors: res.data });
    });
  }

  render() {
    return (
      <ul>
        {this.state.authors.map(function(author, id) {
          return <li key={id}>{author.lastName}</li>;
        })}
      </ul>
    );
  }
}

export function AddToArray(author) {
  this.state.authors.push(author);
}
