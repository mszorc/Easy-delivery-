import React from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { EditAuthorForm } from "./EditAuthorForm";

let url = "http://localhost:3000/";

export default class AuthorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      authors: [],
      sort: {
        column: null,
        direction: "desc"
      },
      showModal: null
    };
    this.AddToArray = AddToArray.bind(this);
  }

  async componentDidMount() {
    await axios.get(url + "author").then(res => {
      this.setState({ authors: res.data });
    });
  }

  onRemoveItem = async id => {
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
    this.setState({ filter: event.target.value });
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

  render() {
    const { filter, authors } = this.state;
    const lowercasedFilter = filter.toLowerCase();
    const filteredAuthors = authors.filter(item => {
      return Object.keys(item).some(key =>
        item[key]
          .toString()
          .toLowerCase()
          .includes(lowercasedFilter)
      );
    });

    return (
      <>
        <input
          value={filter}
          onChange={this.handleChange}
          placeholder="Search"
        />
        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>id</th>
              <th>
                <button onClick={this.onSort("firstName")}>Sort</button>
                First name
              </th>
              <th>Last name</th>
            </tr>
          </thead>
          <tbody>
            {filteredAuthors.map(author => (
              <tr key={author.id}>
                <td>{author.id}</td>
                <td>{author.firstName}</td>
                <td>{author.lastName}</td>
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
