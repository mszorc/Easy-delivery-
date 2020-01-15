import React from 'react';
import axios from 'axios';

let url = "http://localhost:3000/"

export default class SupplierList extends React.Component {
    state = {
        suppliers: [], 
    };

    componentDidMount() {
        axios.get(url + "supplier")
        .then (res => {
            console.log(res);
            this.setState({suppliers: res.data});
        })
    }

    render() {
        return (
            <ul>
                {this.state.suppliers.map(function(supplier, id) {
                return <li key={id}>{supplier.name}</li>
                })}
            </ul>
        )
    }

}