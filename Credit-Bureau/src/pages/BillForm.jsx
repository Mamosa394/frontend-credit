import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Spinner } from "react-bootstrap";

import "../styles/creditform.css";
import PartnerSidebar from "../components2/PartnerSidebar";

const BillForm = () => {
  const [bills, setBills] = useState([
    {
      billType: "",
      amount: "",
      dueDate: "",
      paymentDate: "",
      status: "",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleBillChange = (index, field, value) => {
    setBills((prevBills) =>
      prevBills.map((bill, i) =>
        i === index ? { ...bill, [field]: value } : bill
      )
    );
  };

  const addBill = () => {
    setBills((prevBills) => [
      ...prevBills,
      {
        billType: "",
        amount: "",
        dueDate: "",
        paymentDate: "",
        status: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://backend-credit-7sa9.onrender.com/api/bill-payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bills }),
      });

      if (response.ok) {
        alert("Bill payments submitted successfully!");
        setBills([
          {
            billType: "",
            amount: "",
            dueDate: "",
            paymentDate: "",
            status: "",
          },
        ]);
      } else {
        alert("Failed to submit bill payments.");
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="form-container">
      <PartnerSidebar />
      <div className="form-content">
        <h2 className="form-title">Bill Payments</h2>

        <Form onSubmit={handleSubmit}>
          <div className="bill-section">
            {bills.map((bill, index) => (
              <div key={index} className="bill-entry">
                <Row>
                  <Col md={6}>
                    <Form.Group controlId={`billType-${index}`}>
                      <Form.Label>Bill Type</Form.Label>
                      <Form.Select
                        value={bill.billType}
                        onChange={(e) =>
                          handleBillChange(index, "billType", e.target.value)
                        }
                        required
                      >
                        <option value="">Select Bill Type</option>
                        <option value="Phone">Phone</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Rent">Rent</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId={`amount-${index}`}>
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        value={bill.amount}
                        onChange={(e) =>
                          handleBillChange(index, "amount", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {/* Rest of bill form fields */}
                <hr />
              </div>
            ))}
            <Button
              variant="outline-primary"
              type="button"
              onClick={addBill}
              className="me-2"
            >
              Add Another Bill
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : "Submit Payments"}
            </Button>
          </div>
        </Form>
      </div>
     
    </Container>
  );
};

export default BillForm;