import React from "react";
import axios from "axios";
import { AddToArray } from "./BookList";
import { Modal, Button } from "react-bootstrap";

let url = "http://localhost:3000/";

export class AddBookForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      imageUrl: ""
    };
    this.initialState = this.state;
  }

  changeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  submitHandler = async event => {
    if (this.validation()) {
      await axios
        .post(url + "book", {
          title: this.state.title,
          imageUrl: this.state.imageUrl
        })
        .then(res => {
          this.state.id = res.data.id;
          this.setState(this.state);
        });
      AddToArray(this.state);
      this.setState(this.initialState);
    }

    event.preventDefault();
  };

  validation() {
    if (!this.state.title) {
      alert("Enter title of a book.");
      return false;
    }
    if (!this.state.imageUrl) {
      alert("Enter image url of an author.");
      return false;
    }
    return true;
  }

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
            Add new book
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.submitHandler} className="inputForm">
            <div className="form-group">
              <label>Title </label>
              <input
                type="text"
                name="title"
                value={this.state.title}
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
              <button
                type="submit"
                className="btn btn-primary"
                //onClick={this.props.onHide}
              >
                Submit
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
