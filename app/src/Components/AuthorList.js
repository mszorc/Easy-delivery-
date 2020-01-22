import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { EditAuthorForm } from "./EditAuthorForm";

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
    this.AddToArray = AddToArray.bind(this);
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

  setShowModal(id, event) {
    let st = null;
    if (id > 0) {
      st = "modal" + id;
    }
    this.setState({ showModal: st });
  }

  handleChange = event => {
    this.setState({ search: event.target.value, data: [] });
  };

  onSort = column => e => {
    const direction = this.state.sort.column
      ? this.state.sort.direction === "asc"
        ? "desc"
        : "asc"
      : "desc";
    const sortedData = this.state.authors.sort((a, b) => {
      if (column === "firstName") {
        const nameA = a.firstName.toUpperCase(); // ignore upper and lowercase
        const nameB = b.firstName.toUpperCase(); // ignore upper and lowercase
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

  prepareData() {
    const { search, authors, books, author_books, data } = this.state;
    const lowercasedSearch = search.toLowerCase();
    console.log(lowercasedSearch);
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
        <input
          value={this.state.search}
          onChange={this.handleChange}
          placeholder="Search"
        />

        <div className="container" id="header">
          <div className="row justify-content-md-around">
            <div className="col-12 col-md-3 order-md-1">
              <Button id="add_author" variant="primary">
                Add author
              </Button>
            </div>
            <div className="col-12 col-md-3 order-md-2">
              <div id="sort">
                <Button
                  id="sort_button"
                  variant="primary"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Sort by:
                </Button>
                <div className="dropdown-menu">
                  <p id="id">Id (default)</p>
                  <p id="first_name">First name</p>
                  <p id="last_name">Last name</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3 order-md-3">
              <input
                id="searchbox"
                type="text"
                placeholder="Filter"
                aria-label="Filter"
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="row justify-content-around" id="record_container">
          {this.state.data.map(author => (
            <div className="container col-12 col-md-6 col-lg-4" key={author.id}>
              <div className="record row">
                <div className="col-12">
                  {author.id}
                  {author.firstName}
                  {author.lastName}
                </div>
                <div className="image col-12 col-sm-auto">
                  <img
                    src="https://www.film.gildia.pl/_n_/literatura/tworcy/andrzej_sapkowski/pani_jeziora/okladka-200.jpg"
                    alt="Author"
                  ></img>
                </div>
                <div className="col-12 col-sm">
                  {author.books.map(book => (
                    <li key={book.id}>{book.title}</li>
                  ))}
                </div>
                <div className="buttons col-12">
                  <Button
                    className="left"
                    variant="primary"
                    onClick={() => this.setShowModal(author.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="right"
                    value="primary"
                    onClick={() => this.onRemoveItem(author.id)}
                  >
                    Remove
                  </Button>
                  <EditAuthorForm
                    show={this.state.showModal === "modal" + author.id}
                    onHide={() => this.setShowModal(0)}
                    id={author.id}
                    firstname={author.firstName}
                    lastname={author.lastName}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <Table striped hover responsive variant="dark">
        <tbody>
        {this.state.data.map(author => (
              <tr key={author.id}>
                <td>{author.id}</td>
                <td>{author.firstName}</td>
                <td>{author.lastName}</td>
                <td>
                  {author.books.map(book => (
                    <li key={book.id}>{book.title}</li>
                  ))}
                </td>
                <td>
                  <Button
                    value="primary"
                    onClick={() => this.onRemoveItem(author.id)}
                  >
                    Remove
                  </Button>
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
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table> */}
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
