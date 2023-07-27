import React from 'react';
import ReactDOM from 'react-dom/client';

import Update from "./tasks/Update.jsx";
import List from "./tasks/List.jsx";
import Create from "./tasks/Create.jsx";
import { BrowserRouter as Router , Routes, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Example() {
    return (<Router>
        <Container className="mt-5">
          <Row>
            <Col md={12}>
              <Routes>
                <Route path="create" element={<Create />} />
                <Route path="task/edit/:id" element={<Update />} />
                <Route exact path='/home' element={<List />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </Router>);
}

export default Example;

if (document.getElementById('example')) {
    const Index = ReactDOM.createRoot(document.getElementById("example"));

    Index.render(
        <React.StrictMode>
            <Example/>
        </React.StrictMode>
    )
}
