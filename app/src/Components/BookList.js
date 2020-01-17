import React from "react";
import axios from "axios";

let url = "http://localhost:3000/";

export default class BookList extends React.Component {
  state = {
    books: []
  };

  async componentDidMount() {
    await axios.get(url + "book").then(res => {
      console.log(res);
      this.setState({ books: res.data });
    });
  }

  render() {
    return (
      <ul>
        {this.state.books.map(function(book, id) {
          return <li key={id}>{book.title}</li>;
        })}
      </ul>
    );
  }
}
