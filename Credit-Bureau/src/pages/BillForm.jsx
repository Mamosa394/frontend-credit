import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import "../styles/creditform.css"

const BillForm = ({ bills, handleBillChange, addBill }) => {
  return (
    <div className="bill-section">
      <h4 className="section-title">Bill Payments</h4>
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
                >
                  <option value="">Select</option>
                  <option value="Phone">Phone</option>
                  <option value="Credit Card">Credit Card</option>
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
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId={`dueDate-${index}`}>
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={bill.dueDate}
                  onChange={(e) =>
                    handleBillChange(index, "dueDate", e.target.value)
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId={`paymentDate-${index}`}>
                <Form.Label>Payment Date</Form.Label>
                <Form.Control
                  type="date"
                  value={bill.paymentDate}
                  onChange={(e) =>
                    handleBillChange(index, "paymentDate", e.target.value)
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId={`status-${index}`}>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={bill.status}
                  onChange={(e) =>
                    handleBillChange(index, "status", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <hr />
        </div>
      ))}
      <Button className="btn-accent" type="button" onClick={addBill}>
        Add Another Bill
      </Button>
    </div>
  );
};

export default BillForm;