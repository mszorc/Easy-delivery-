import React from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import AsyncSelect from "react-select";

let url = "http://localhost:3000/";

export class EditAuthorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      firstName: props.firstname,
      lastName: props.lastname,
      books: [],
      booksMapped: []
    };
  }

  async componentDidMount() {
    await axios.get(url + "book").then(res => {
      this.setState({ books: res.data });
    });
  }

  changeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  submitHandler = async event => {
    event.preventDefault();
    var that = this;
    for (let i = 0; i < this.state.books.length; i++) {
      await axios.post(url + "author_book", {
        bookId: that.state.books[i].id,
        authorId: that.state.id
      });
    }

    await axios.put(url + "author/" + this.state.id, {
      firstName: this.state.firstName,
      lastName: this.state.lastName
    });
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
              <label>Books</label>
              <AsyncSelect options={this.state.books} isMulti />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.props.onHide}
              >
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
