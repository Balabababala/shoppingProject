import React, { useState, useContext } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { AppContext } from "../contexts/AppContext";

export default function EmailVerificationPage() {
  const { addToastMessage, API_BASE } = useContext(AppContext);

  const [formData, setFormData] = useState({
    email: "",
    code: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("danger");

  // 驗證 email 格式
  const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 處理輸入變化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 表單驗證
  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.code.trim()) newErrors.code = "Verification code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交處理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageVariant("danger");
    setErrors({});
    if (!validate()) return;

    try {
      const res = await fetch(`${API_BASE}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      const success =
        res.ok &&
        (data.status === "success" || data.message?.includes("成功"));

      if (success) {
        setMessage("Email verified successfully! You can now login.");
        setMessageVariant("success");
        addToastMessage("Email verified successfully!");
        setFormData({ email: "", code: "" });
        setErrors({});
      } else {
        const errorMsg = data.message || "Verification failed";
        setMessage(errorMsg);
        setMessageVariant("danger");
        addToastMessage(errorMsg);
      }
    } catch (err) {
      const errorMsg = "Network error, please try again later.";
      setMessage(errorMsg);
      setMessageVariant("danger");
      addToastMessage(errorMsg);
      console.error("Email verification error:", err);
    }
  };

  return (
    <Container style={{ maxWidth: 480 }} className="mt-5">
      <h2 className="mb-4 text-center">Email Verification</h2>

      {message && <Alert variant={messageVariant}>{message}</Alert>}

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

        <Form.Group className="mb-3" controlId="code">
          <Form.Label>
            Verification Code <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            isInvalid={!!errors.code}
          />
          <Form.Control.Feedback type="invalid">
            {errors.code}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Verify Email
        </Button>
      </Form>
    </Container>
  );
}
