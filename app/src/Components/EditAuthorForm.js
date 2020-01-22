import React from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { EditInArray } from "./AuthorList";

let url = "http://localhost:3000/";

export class EditAuthorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      firstName: props.firstname,
      lastName: props.lastname,
      dateOfBirth: props.dateOfBirth,
      imageUrl: props.imageUrl,
      books: [],
      author_books: [],
      booksIntersect: [],
      booksDiff: [],
      booksToPut: []
    };
  }

  async componentDidMount() {
    await axios.get(url + "book").then(res => {
      this.setState({ books: res.data });
    });
    await axios.get(url + "author_book?authorId=" + this.state.id).then(res => {
      this.setState({ author_books: res.data });
    });
    for (let i = 0; i < this.state.author_books.length; i++) {
      this.state.booksIntersect.push(
        this.state.books.find(x => x.id === this.state.author_books[i].bookId)
      );
    }
    this.setState({
      booksDiff: this.state.books.filter(
        x => !this.state.booksIntersect.includes(x)
      )
    });
  }

  async deleteBook(id) {
    //event.preventDefault();
    let author_book = this.state.author_books.find(
      x => x.bookId === id && x.authorId === this.state.id
    );
    this.state.booksDiff.push(this.state.booksIntersect.find(x => x.id === id));
    this.state.booksIntersect.splice(
      this.state.booksIntersect.find(x => x.id === id),
      1
    );

    await axios.delete(url + "author_book/" + author_book.id);
    this.setState(this);
    //RemoveBooksFromArray(this.state);
  }

  async getBooks() {
    await axios.get(url + "book").then(res => {
      this.setState({ books: res.data });
    });
    await axios.get(url + "author_book?authorId=" + this.state.id).then(res => {
      this.setState({ author_books: res.data });
    });
    for (let i = 0; i < this.state.author_books.length; i++) {
      this.state.booksIntersect.push(
        this.state.books.find(x => x.id === this.state.author_books[i].bookId)
      );
    }
  }

  validation() {
    if (!this.state.firstName) {
      alert("Enter first name of an author.");
      return false;
    }
    if (!this.state.lastName) {
      alert("Enter last name of an author.");
      return false;
    }
    if (!this.state.dateOfBirth) {
      alert("Enter date of birth of an author.");
      return false;
    }
    if (!this.state.imageUrl) {
      alert("Enter image url of an author.");
      return false;
    }
    return true;
  }

  changeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  submitHandler = async event => {
    event.preventDefault();
    if (this.validation()) {
      var that = this;
      for (let i = 0; i < this.state.booksToPut.length; i++) {
        await axios.post(url + "author_book", {
          bookId: that.state.booksToPut[i].id,
          authorId: that.state.id
        });
      }

      await axios.put(url + "author/" + this.state.id, {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        dateOfBirth: this.state.dateOfBirth,
        imageUrl: this.state.imageUrl
      });
      EditInArray(this.state);
    }
  };

  render() {
    const options = this.state.booksDiff.map(opt => ({
      value: opt.id,
      label: opt.title
    }));
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit author
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.submitHandler} className="inputForm">
            <div className="form-group">
              <label>First name </label>
              <input
                type="text"
                name="firstName"
                value={this.state.firstName}
                onChange={this.changeHandler}
              />
            </div>

            <div className="form-group">
              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                value={this.state.lastName}
                onChange={this.changeHandler}
              />
            </div>

            <div className="form-group">
              <label>Date of birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={this.state.dateOfBirth}
                onChange={this.changeHandler}
              />
            </div>

            <div className="form-group">
              <label>Image url</label>
              <input
                type="text"
                name="imageUrl"
                value={this.state.imageUrl}
                onChange={this.changeHandler}
              />
            </div>

            <div className="form-group">
              <label>Books</label>
              {this.state.booksIntersect.map(book => (
                <div key={book.id}>
                  {book.title}
                  <button onClick={() => this.deleteBook(book.id)}>
                    &times;
                  </button>
                </div>
              ))}
              <Select
                onClick={this.changeHandler}
                options={options}
                onChange={(opt, meta) => {
                  //  this.state.booksToPut = [];
                  if (meta.action === "select-option") {
                    console.log(meta);
                    this.state.booksToPut.push({
                      id: meta.option.value,
                      title: meta.option.label
                    });
                    console.log(this.state.booksToPut[0]);
                  }
                  if (meta.action === "remove-value") {
                    this.state.booksToPut.splice(
                      this.state.booksToPut.find(
                        x => x.id === meta.option.value
                      ),
                      1
                    );
                  }
                  console.log(this.state.booksToPut);
                }}
                isMulti
              />
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
