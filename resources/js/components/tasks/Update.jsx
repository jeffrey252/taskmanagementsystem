import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'


function Update() {
    const navigate = useNavigate();

    const { id } = useParams()

    console.log("waaaa" + id);

    const [name, setName] = useState("")
    const [status, setStatus] = useState("")
    const [image, setImage] = useState(null)
    const [validationError, setValidationError] = useState({})

    useEffect(() => {
        fetchProduct()
    }, [])

    const fetchProduct = async () => {
        await axios.get(`http://localhost:8001/api/task/${id}`).then(({ data }) => {
            const { name, status } = data.task
            setName(name)
            setStatus(status)
        }).catch(({ response: { data } }) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }

    const changeHandler = (event) => {
        setImage(event.target.files[0]);
    };

    const updateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData()
        formData.append('_method', 'PATCH');
        formData.append('name', name)
        formData.append('status', status)
        if (image !== null) {
            formData.append('image', image)
        }

        await axios.post(`http://localhost:8001/api/task/${id}`, formData).then(({ data }) => {
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
                            <h4 className="card-title">Update Product</h4>
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
                                <Form onSubmit={updateProduct}>
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
                                        Update
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

export default Update;

if (document.getElementById('update')) {
    const Index = ReactDOM.createRoot(document.getElementById("update"));

    Index.render(
        <React.StrictMode>
            <BrowserRouter>
                <Update />
            </BrowserRouter>
        </React.StrictMode>
    )
}
