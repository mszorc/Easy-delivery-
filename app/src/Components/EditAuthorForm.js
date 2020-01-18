import React from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

let url = "http://localhost:3000/";

export class EditAuthorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      firstName: props.firstname,
      lastName: props.lastname
    };
    this.initialState = this.state;
  }

  changeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  submitHandler = async event => {
    await axios.put(url + "author/" + this.state.id, {
      firstName: this.state.firstName,
      lastName: this.state.lastName
    });
    event.preventDefault();
    this.setState(this.initialState);
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
