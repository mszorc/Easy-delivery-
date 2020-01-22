import React from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { EditAuthorForm } from "./EditAuthorForm";
import { AddAuthorForm } from "./AddAuthorForm";

let url = "http://localhost:3000/";

export default class AuthorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      authors: [],
      books: [],
      author_books: [],
      data: [],
      sort: {
        column: null,
        direction: "desc"
      },
      showModal: null
    };
    //this.RemoveBooksFromArray = RemoveBooksFromArray.bind(this);
    this.AddToArray = AddToArray.bind(this);
    this.EditInArray = EditInArray.bind(this);
    this.initialState = this.state;
  }

  async componentDidMount() {
    await axios.get(url + "author").then(res => {
      this.setState({ authors: res.data });
    });
    await axios.get(url + "book").then(res => {
      this.setState({ books: res.data });
    });
    await axios.get(url + "author_book").then(res => {
      this.setState({ author_books: res.data });
    });
  }

  onRemoveItem = async id => {
    for (let i = 0; i < this.state.data.length; i++) {
      for (let j = 0; j < this.state.data[i].author_books.length; j++) {
        if (this.state.data[i].author_books[j].authorId === id) {
          await axios.delete(
            url + "author_book/" + this.state.data[i].author_books[j].id
          );
        }
      }
    }
    this.state.data.splice(
      this.state.data.find(x => x.id === id),
      1
    );
    await axios.delete(url + "author/" + id);
    this.setState(state => {
      const authors = state.authors.filter(item => item.id !== id);
      return {
        authors
      };
    });
  };

  onSort = column => e => {
    const direction = this.state.sort.column
      ? this.state.sort.direction === "asc"
        ? "desc"
        : "asc"
      : "desc";
    const sortedData = this.state.data.sort((a, b) => {
      if (
        column === "firstName" ||
        column === "lastName" ||
        column === "dateOfBirth" ||
        column === "id"
      ) {
        var nameA;
        var nameB;
        if (column === "id") {
          nameA = a.id; // ignore upper and lowercase
          nameB = b.id; // ignore upper and lowercase
        }
        if (column === "firstName") {
          nameA = a.firstName.toUpperCase(); // ignore upper and lowercase
          nameB = b.firstName.toUpperCase(); // ignore upper and lowercase
        }
        if (column === "lastName") {
          nameA = a.lastName.toUpperCase(); // ignore upper and lowercase
          nameB = b.lastName.toUpperCase(); // ignore upper and lowercase
        }
        if (column === "dateOfBirth") {
          nameA = a.dateOfBirth.toUpperCase(); // ignore upper and lowercase
          nameB = b.dateOfBirth.toUpperCase(); // ignore upper and lowercase
        }
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }
      return 0;
    });

    if (direction === "desc") {
      sortedData.reverse();
    }

    this.setState({
      authors: sortedData,
      sort: {
        column,
        direction
      }
    });
  };

  setShowModal(id, event) {
    let st = null;
    if (id => -1) {
      st = "modal" + id;
    }
    this.setState({ showModal: st });
  }

  handleChange = event => {
    this.setState({ search: event.target.value, data: [] });
  };

  prepareData() {
    const { search, authors, books, author_books, data } = this.state;
    const lowercasedSearch = search.toLowerCase();
    const searchedAuthors = authors.filter(item => {
      return Object.keys(item).some(key =>
        item[key]
          .toString()
          .toLowerCase()
          .includes(lowercasedSearch)
      );
    });

    for (let i = 0; i < searchedAuthors.length; i++) {
      data[i] = {
        id: searchedAuthors[i].id,
        firstName: searchedAuthors[i].firstName,
        lastName: searchedAuthors[i].lastName,
        dateOfBirth: searchedAuthors[i].dateOfBirth,
        imageUrl: searchedAuthors[i].imageUrl,
        books: [],
        author_books: []
      };
    }

    for (let i = 0; i < data.length; i++) {
      const author_booksFiltered = author_books.filter(
        x => x.authorId === data[i].id
      );
      for (let k = 0; k < author_booksFiltered.length; k++) {
        var book = books.find(x => x.id === author_booksFiltered[k].bookId);
        data[i].books.push(book);
        data[i].author_books.push(author_booksFiltered[k]);
      }
    }
  }

  render() {
    this.prepareData();
    return (
      <>
        <Button variant="primary" onClick={() => this.setShowModal(-1)}>
          Add author
        </Button>
        <AddAuthorForm
          show={this.state.showModal === "modal" + -1}
          onHide={() => this.setShowModal(0)}
        />
        <input
          value={this.state.search}
          onChange={this.handleChange}
          placeholder="Search"
        />
        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>id</th>
              <th>Image</th>
              <th>
                <button onClick={this.onSort("firstName")}>Sort</button>
                First name
              </th>
              <th>
                <button onClick={this.onSort("firstName")}>Sort</button>Last
                name
              </th>
              <th>
                <button onClick={this.onSort("firstName")}>Sort</button>Date of
                birth
              </th>
              <th>Books</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(author => (
              <tr key={author.id}>
                <td>{author.id}</td>
                <td>
                  <img src={author.imageUrl} alt={author.imageUrl} />
                </td>
                <td>{author.firstName}</td>
                <td>{author.lastName}</td>
                <td>{author.dateOfBirth}</td>
                <td>
                  {author.books.map(book => (
                    <li key={book.id}>{book.title}</li>
                  ))}
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => this.onRemoveItem(author.id)}
                  >
                    Remove
                  </button>
                  <Button
                    variant="primary"
                    onClick={() => this.setShowModal(author.id)}
                  >
                    Edit
                  </Button>
                  <EditAuthorForm
                    show={this.state.showModal === "modal" + author.id}
                    onHide={() => this.setShowModal(0)}
                    id={author.id}
                    firstname={author.firstName}
                    lastname={author.lastName}
                    dateOfBirth={author.dateOfBirth}
                    imageUrl={author.imageUrl}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
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

export function EditInArray(author) {
  // this.setState(state => {
  //   var data = state.data.find(x => x.id === author.id);
  //   data = {
  //     firstName: author.firstName,
  //     lastName: author.lastName,
  //     dateOfBirth: author.dateOfBirth,
  //     imageUrl: author.imageUrl
  //     //   books: books
  //   };
  //   return {
  //     data
  //   };
  // });
}

// export function RemoveBooksFromArray(author) {
//   this.setState(state => {
//     const newBooks = (state.authors[author.id].books = author.booksIntersect);
//     return {
//       newBooks
//     };
//   });
// }
