import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { EditBookForm } from "./EditBookForm";
import { AddBookForm } from "./AddBookForm";

let url = "http://localhost:3000/";

export default class BookList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      authors: [],
      books: [],
      book_authors: [],
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

    this.sort_setting = "Sort by: Id (asc)";
  }

  async componentDidMount() {
    await axios.get(url + "author").then(res => {
      this.setState({ authors: res.data });
    });
    await axios.get(url + "book").then(res => {
      this.setState({ books: res.data });
    });
    await axios.get(url + "author_book").then(res => {
      this.setState({ book_authors: res.data });
    });
  }

  onRemoveItem = async id => {
    for (let i = 0; i < this.state.data.length; i++) {
      for (let j = 0; j < this.state.data[i].book_authors.length; j++) {
        if (this.state.data[i].book_authors[j].bookId === id) {
          await axios.delete(
            url + "author_book/" + this.state.data[i].book_authors[j].id
          );
        }
      }
    }
    this.state.data.splice(
      this.state.data.find(x => x.id === id),
      1
    );
    await axios.delete(url + "book/" + id);
    this.setState(state => {
      const books = state.books.filter(item => item.id !== id);
      return {
        books
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
      this.sort_setting = "Sort by: ";
      switch (column) {
        case "Title":
          this.sort_setting += "Title";
          break;
        case "id":
          this.sort_setting += "Id";
          break;
        default:
          break;
      }
      if (column === "title" || column === "id") {
        var nameA;
        var nameB;
        if (column === "id") {
          nameA = a.id; // ignore upper and lowercase
          nameB = b.id; // ignore upper and lowercase
        }
        if (column === "title") {
          nameA = a.title.toUpperCase(); // ignore upper and lowercase
          nameB = b.title.toUpperCase(); // ignore upper and lowercase
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
      this.sort_setting += " (desc)";
    } else {
      this.sort_setting += " (asc)";
    }

    this.setState({
      books: sortedData,
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
    const { search, authors, books, book_authors, data } = this.state;
    const lowercasedSearch = search.toLowerCase();
    const searchedBooks = books.filter(item => {
      return Object.keys(item).some(key =>
        item[key]
          .toString()
          .toLowerCase()
          .includes(lowercasedSearch)
      );
    });

    for (let i = 0; i < searchedBooks.length; i++) {
      data[i] = {
        id: searchedBooks[i].id,
        title: searchedBooks[i].title,
        imageUrl: searchedBooks[i].imageUrl,
        authors: [],
        book_authors: []
      };
    }

    for (let i = 0; i < data.length; i++) {
      const book_authorsFiltered = book_authors.filter(
        x => x.bookId === data[i].id
      );
      for (let k = 0; k < book_authorsFiltered.length; k++) {
        var author = authors.find(
          x => x.id === book_authorsFiltered[k].authorId
        );
        data[i].authors.push(author);
        data[i].book_authors.push(book_authorsFiltered[k]);
      }
    }
  }

  render() {
    this.prepareData();
    return (
      <>
        <div className="container" id="header">
          <div className="row justify-content-md-around">
            <div className="col-12 col-md-3 order-md-1">
              <Button
                id="add_book"
                variant="primary"
                onClick={() => this.setShowModal(-1)}
              >
                Add book
              </Button>
              <AddBookForm
                show={this.state.showModal === "modal" + -1}
                onHide={() => this.setShowModal(0)}
              />
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
                  {this.sort_setting}
                </Button>
                <div className="dropdown-menu">
                  <p id="id" onClick={this.onSort("id")}>
                    Id (default)
                  </p>
                  <p id="title" onClick={this.onSort("title")}>
                    Title
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3 order-md-3">
              <input
                id="searchbox"
                type="text"
                value={this.state.search}
                onChange={this.handleChange}
                placeholder="Filter"
                aria-label="Filter"
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="row justify-content-start" id="record_container">
          {this.state.data.map(book => (
            <div className="container col-12 col-md-6 col-lg-4" key={book.id}>
              <div className="record row">
                <div className="col-12 row">
                  <div className="record_id col-2">#{book.id}</div>
                  <div className="record_name col-auto">{book.title}</div>
                </div>
                <div className="image col-12 col-sm-auto">
                  <img
                    src="https://www.film.gildia.pl/_n_/literatura/tworcy/andrzej_sapkowski/pani_jeziora/okladka-200.jpg"
                    alt="Book"
                  ></img>
                </div>
                <div className="col-12 col-sm">
                  {book.authors.map(author => (
                    <li key={author.id}>
                      {author.firstName}
                      {author.lastName}
                    </li>
                  ))}
                </div>
                <div className="buttons col-12">
                  <Button
                    className="left"
                    variant="primary"
                    onClick={() => this.setShowModal(book.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="right"
                    value="primary"
                    onClick={() => this.onRemoveItem(book.id)}
                  >
                    Remove
                  </Button>
                  <EditBookForm
                    show={this.state.showModal === "modal" + book.id}
                    onHide={() => {
                      this.setShowModal(0);
                    }}
                    id={book.id}
                    title={book.title}
                    imageUrl={book.imageUrl}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export function AddToArray(book) {
  this.setState(state => {
    const books = state.books.push(book);
    return {
      books
    };
  });
}

export function EditInArray(author) {
  this.setState(this);
}
