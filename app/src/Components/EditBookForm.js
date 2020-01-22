import React from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

let url = "http://localhost:3000/";

export class EditBookForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      title: props.title,
      imageUrl: props.imageUrl,
      authors: [],
      book_authors: [],
      authorsIntersect: [],
      authorsDiff: [],
      authorsToPut: []
    };
  }

  async componentDidMount() {
    await axios.get(url + "author").then(res => {
      this.setState({ authors: res.data });
    });
    await axios.get(url + "author_book?bookId=" + this.state.id).then(res => {
      this.setState({ book_authors: res.data });
    });
    for (let i = 0; i < this.state.book_authors.length; i++) {
      this.state.authorsIntersect.push(
        this.state.authors.find(
          x => x.id === this.state.book_authors[i].authorId
        )
      );
    }
    this.setState({
      authorsDiff: this.state.authors.filter(
        x => !this.state.authorsIntersect.includes(x)
      )
    });
  }

  async deleteAuthor(id) {
    let book_author = this.state.book_authors.find(
      x => x.authorId === id && x.bookId === this.state.id
    );
    console.log(book_author);
    this.state.authorsDiff.push(
      this.state.authorsIntersect.find(x => x.id === id)
    );
    console.log(this.state.authorsIntersect.find(x => x.id === id));
    console.log(this.state.authorsIntersect);
    this.state.authorsIntersect.splice(
      this.state.authorsIntersect.findIndex(x => x.id === id),
      1
    );
    console.log(this.state.authorsIntersect);

    await axios.delete(url + "author_book/" + book_author.id);
    //this.setState(this);
  }

  async getAuthors() {
    await axios.get(url + "author").then(res => {
      this.setState({ authors: res.data });
    });
    await axios.get(url + "author_book?bookId=" + this.state.id).then(res => {
      this.setState({ book_authors: res.data });
    });
    for (let i = 0; i < this.state.book_authors.length; i++) {
      this.state.authorsIntersect.push(
        this.state.authors.find(
          x => x.id === this.state.book_authors[i].authorId
        )
      );
    }
  }

  validation() {
    if (!this.state.title) {
      alert("Enter title of a book.");
      return false;
    }
    if (!this.state.imageUrl) {
      alert("Enter image url of a book.");
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
    console.log(this.state.authorsToPut);
    if (this.validation()) {
      var that = this;
      for (let i = 0; i < this.state.authorsToPut.length; i++) {
        await axios.post(url + "author_book", {
          authorId: that.state.authorsToPut[i].id,
          bookId: that.state.id
        });
      }

      await axios.put(url + "book/" + this.state.id, {
        title: this.state.title,
        imageUrl: this.state.imageUrl
      });
      //EditInArray(this.state);
      this.setState(this);
    }
    event.preventDefault();
  };

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit book
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.submitHandler} className="inputForm">
            <div className="form-group list-group-item">
              <div classname="form-group">
                <label>Title </label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={this.state.title}
                  onChange={this.changeHandler}
                />
                <label>Image url</label>
                <input
                  type="text"
                  name="imageUrl"
                  className="form-control"
                  value={this.state.imageUrl}
                  onChange={this.changeHandler}
                />

                <button type="submit" className="btn btn-primary mt-2">
                  Save
                </button>
              </div>
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
