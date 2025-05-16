import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import "../styles/creditform.css";
import Header2 from "../components2/Header2";
import FooterNew from "../components2/FooterNew";
import LoanForm from "./LoanForm";
import BillForm from "./BillForm";

const CreditForm = ({ onSubmit }) => {
  const [loans, setLoans] = useState([
    {
      loanId: "",
      lender: "",
      amount: "",
      type: "",
      interestRate: "",
      status: "",
      startDate: "",
      dueDate: "",
    },
  ]);

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

  const handleLoanChange = (index, field, value) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan, i) =>
        i === index ? { ...loan, [field]: value } : loan
      )
    );
  };

  const handleBillChange = (index, field, value) => {
    setBills((prevBills) =>
      prevBills.map((bill, i) =>
        i === index ? { ...bill, [field]: value } : bill
      )
    );
  };

  const addLoan = () => {
    setLoans((prevLoans) => [
      ...prevLoans,
      {
        loanId: "",
        lender: "",
        amount: "",
        type: "",
        interestRate: "",
        status: "",
        startDate: "",
        dueDate: "",
      },
    ]);
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
    const userData = { loans, bills };

    try {
      const response = await fetch("https://backend-credit-7sa9.onrender.com/api/loan-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Data submitted successfully!");
        setLoans([
          {
            loanId: "",
            lender: "",
            amount: "",
            type: "",
            interestRate: "",
            status: "",
            startDate: "",
            dueDate: "",
          },
        ]);
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
        const errorData = await response.json();
        alert("Failed to submit data.");
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container fluid className="form-container">
        <Header2 />
        <div className="form-content">
          <h2 className="form-title">Loan and Bill Payment Form</h2>

          <Form onSubmit={handleSubmit}>
            <Row className="form-sections-wrapper">
              {/* Loan Form */}
              <Col md={6}>
                <LoanForm 
                  loans={loans} 
                  handleLoanChange={handleLoanChange} 
                  addLoan={addLoan} 
                />
              </Col>

              {/* Bill Form */}
              <Col md={6}>
                <BillForm 
                  bills={bills} 
                  handleBillChange={handleBillChange} 
                  addBill={addBill} 
                />
              </Col>
            </Row>

            <div className="mt-4">
              <Button type="submit" className="btn-accent" disabled={isLoading}>
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>

            <div className="tips-card mt-5">
              <h4 className="section-title">Smart Credit Tips</h4>
              <div className="tip-box">
                <ul>
                  <li>
                    <strong>Pay on time:</strong> Timely payments improve your
                    credit rating.
                  </li>
                  <li>
                    <strong>Keep balances low:</strong> Don't max out your
                    credit cards.
                  </li>
                  <li>
                    <strong>Check reports:</strong> Review your credit report
                    regularly for errors.
                  </li>
                  <li>
                    <strong>Limit applications:</strong> Avoid too many credit
                    applications in a short time.
                  </li>
                  <li>
                    <strong>Stay informed:</strong> Understand how credit works
                    and stay updated.
                  </li>
                </ul>
              </div>
            </div>
          </Form>
        </div>
      </Container>
      <FooterNew />
    </>
  );
};

export default CreditForm;