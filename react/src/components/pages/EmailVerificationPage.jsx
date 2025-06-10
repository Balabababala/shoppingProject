import React, { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";

export default function EmailVerificationPage() {
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validEmail(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.verificationCode.trim())
      newErrors.verificationCode = "Verification code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode, // 這裡改成後端需要的 code key
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.message || "Verification failed");
      } else {
        setMessage("Email verified successfully! You can now login.");
        setFormData({ email: "", verificationCode: "" });
        setErrors({});
      }
    } catch {
      setMessage("Network error");
    }
  };

  return (
    <Container style={{ maxWidth: 480 }} className="mt-5">
      <h2 className="mb-4 text-center">Email Verification</h2>

      {message && (
        <Alert
          variant={message.toLowerCase().includes("success") ? "success" : "danger"}
        >
          {message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>
            Email <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="verificationCode">
          <Form.Label>
            Verification Code <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleChange}
            isInvalid={!!errors.verificationCode}
          />
          <Form.Control.Feedback type="invalid">
            {errors.verificationCode}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Verify Email
        </Button>
      </Form>
    </Container>
  );
}
