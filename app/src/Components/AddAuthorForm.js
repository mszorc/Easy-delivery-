import React from "react";
import axios from "axios";
import { AddToArray } from "./AuthorList";
import { Modal, Button } from "react-bootstrap";

let url = "http://localhost:3000/";

export class AddAuthorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
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
        .post(url + "author", {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          dateOfBirth: this.state.dateOfBirth,
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
            Add new author
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
