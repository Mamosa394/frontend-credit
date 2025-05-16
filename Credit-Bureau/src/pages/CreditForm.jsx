import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import Header2 from "../components/Header2";
import FooterNew from "../components/FooterNew";
import "../styles/creditform.css";

const ALLOWED_LENDERS = ["FNB", "Postbank", "Nedbank", "Alliance Lesotho"];

const CreditForm = () => {
  const [loan, setLoan] = useState({
    lender: "",
    amount: "",
    type: "",
    purpose: "",
    duration: "",
    employmentStatus: "",
    income: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setLoan((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("https://backend-credit-7sa9.onrender.com/api/loan-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loan),
      });

      if (response.ok) {
        setSuccess(true);
        setLoan({
          lender: "",
          amount: "",
          type: "",
          purpose: "",
          duration: "",
          employmentStatus: "",
          income: "",
        });
      } else {
        alert("Failed to submit loan application.");
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="form-container">
      <Header2 />
      <div className="form-content">
        <h2 className="form-title">Loan Application</h2>

        {success && (
          <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
            Loan application submitted successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="lender">
                <Form.Label>Lender</Form.Label>
                <Form.Select
                  value={loan.lender}
                  onChange={(e) => handleChange("lender", e.target.value)}
                  required
                >
                  <option value="">Select Lender</option>
                  {ALLOWED_LENDERS.map((lender) => (
                    <option key={lender} value={lender}>
                      {lender}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="amount">
                <Form.Label>Loan Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={loan.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="type">
                <Form.Label>Loan Type</Form.Label>
                <Form.Select
                  value={loan.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  required
                >
                  <option value="">Select Loan Type</option>
                  <option value="Personal">Personal</option>
                  <option value="Business">Business</option>
                  <option value="Education">Education</option>
                  <option value="Home">Home</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="purpose">
                <Form.Label>Purpose</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={loan.purpose}
                  onChange={(e) => handleChange("purpose", e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="duration">
                <Form.Label>Duration (months)</Form.Label>
                <Form.Control
                  type="number"
                  value={loan.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mt-4">Employment Information</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="employmentStatus">
                <Form.Label>Employment Status</Form.Label>
                <Form.Select
                  value={loan.employmentStatus}
                  onChange={(e) =>
                    handleChange("employmentStatus", e.target.value)
                  }
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Employed">Employed</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Student">Student</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="income">
                <Form.Label>Monthly Income</Form.Label>
                <Form.Control
                  type="number"
                  value={loan.income}
                  onChange={(e) => handleChange("income", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-4">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : "Submit Application"}
            </Button>
          </div>
        </Form>
      </div>
      <FooterNew />
    </Container>
  );
};

export default CreditForm;