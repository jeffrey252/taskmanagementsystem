import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Swal from 'sweetalert2';

import axios from 'axios';

import Update from "./Update.jsx";
import Create from "./Create.jsx";

function List() {

    const [searchInput, setSearchInput] = useState("");
    const [dateOrder, setDateOrder] = useState(0)
    const handleChange = (e) => {
        setSearchInput(e.target.value)
      };
    const [tasks, setTasks] = useState([])
    const handleDateOrder = (e) => {
        setDateOrder(dateOrder ? 0 : 1)
    }
    useEffect(() => {
        fetchTasks()
      }, [searchInput, dateOrder]);
    
    const fetchTasks = async () => {
        let getUrl = 'http://localhost:8001/api/task';
        console.log(dateOrder)
        let urlParams = '';
        if (searchInput) {
            urlParams += 'search='+searchInput
        }
        if (dateOrder) {
            urlParams = urlParams ? urlParams+"&order=1" : "order=1"
        }
        if (urlParams) {
            getUrl += '?' + urlParams
        }
        console.log(getUrl);
        await axios.get(getUrl).then(({ data }) => {
            setTasks(data)
        })
    }

    const deleteTask = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            return result.isConfirmed
          });

          if(!isConfirm){
            return;
          }

          await axios.delete(`http://localhost:8001/api/task/${id}`).then(({data})=>{
            Swal.fire({
                icon:"success",
                text:data.message
            })
            fetchTasks()
          }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
          })
    }

    const statusDisplay = (param) => {
        switch (param) {
            case '1':
                return 'In Progress';
                break;
            case '2':
                return 'Completed';
                break;
            default:
                return 'To Do';
        }
    }

    return (

        <div className="container">
            <div className="row">
                <div className='col-12'>
                </div>
                <div className="col-12">
                    <div className="">
                        <div className="table-responsive">
                            <input type="search" id="form1" className="form-control" onChange={handleChange} value={searchInput} placeholder='Search'/>
                            {/* <input
                                type="text"
                                placeholder="Search here"
                                onChange={handleChange}
                                value={searchInput} /> */}
                            <br />
                            <br />
                            <Link to={`/create`} className='btn btn-secondary'>
                                Create a Task
                            </Link>
                            &nbsp;
                            <Button className='btn btn-light' onClick={() => handleDateOrder()}>
                                Sort Tasks By Date Created
                            </Button>
                            <br />
                            <br />

                            <table className="table table-bordered mb-0 text-center">
                                <thead>
                                    <tr>
                                        <th>Task Name</th>
                                        <th>Status</th>
                                        {/* <th>Image</th> */}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tasks.length > 0 && (
                                            tasks.map((row, key) => (
                                                <tr key={key}>
                                                    <td>{row.name}</td>
                                                    <td>{statusDisplay(row.status)}</td>
                                                    {/* <td>
                                                      <img width="50px" src={`http://localhost:8000/storage/product/image/${row.image}`} />
                                                  </td> */}
                                                    <td>
                                                        <Link to={`/task/edit/${row.id}`} className='btn btn-primary me-2'>
                                                            Edit
                                                        </Link>
                                                        <Button variant="danger" onClick={() => deleteTask(row.id)}>
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default List;

if (document.getElementById('list')) {
    const Index = ReactDOM.createRoot(document.getElementById("list"));

    Index.render(
        <React.StrictMode>
            <Router>
                <List />
            </Router>
        </React.StrictMode>
    )
}
