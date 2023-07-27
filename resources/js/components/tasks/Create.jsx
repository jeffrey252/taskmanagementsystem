import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'

function Create() {

    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [status, setStatus] = useState(0)
    const [image, setImage] = useState()
    const [validationError, setValidationError] = useState({})

    const changeHandler = (event) => {
        setImage(event.target.files[0]);
    };

    const createTask = async (e) => {
        e.preventDefault();

        const formData = new FormData()

        formData.append('name', name)
        formData.append('status', status)
        formData.append('image', image)
        console.log(formData);
        await axios.post(`http://localhost:8001/api/task`, formData).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            navigate("/home")
        }).catch(({ response }) => {
            if (response.status === 422) {
                setValidationError(response.data.errors)
            } else {
                Swal.fire({
                    text: response.data.message,
                    icon: "error"
                })
            }
        })
    }
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Create Task</h4>
                            <hr />
                            <div className="form-wrapper">
                                {
                                    Object.keys(validationError).length > 0 && (
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="alert alert-danger">
                                                    <ul className="mb-0">
                                                        {
                                                            Object.entries(validationError).map(([key, value]) => (
                                                                <li key={key}>{value}</li>
                                                            ))
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <Form onSubmit={createTask}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Name">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type="text" value={name} onChange={(event) => {
                                                    setName(event.target.value)
                                                }} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="Status">
                                                <Form.Label>Status</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={status}
                                                    onChange={e => {
                                                        console.log("e.target.value", e.target.value);
                                                        setStatus(e.target.value);
                                                    }}
                                                >
                                                    <option value="0">To Do</option>
                                                    <option value="1">In Progress</option>
                                                    <option value="2">Completed</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Image" className="mb-3">
                                                <Form.Label>Image</Form.Label>
                                                <Form.Control type="file" onChange={changeHandler} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                                        Save
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Create;

if (document.getElementById('create')) {
    const Index = ReactDOM.createRoot(document.getElementById("create"));

    Index.render(
        <React.StrictMode>
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        </React.StrictMode>
    )
}
