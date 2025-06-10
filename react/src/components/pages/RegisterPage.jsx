import React, { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    roleId: 1,
    defaultAddress: "",
    defaultReceiverName: "",
    defaultReceiverPhone: "",
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
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validEmail(formData.email))
      newErrors.email = "Email format is invalid";

    if (formData.roleId < 1 || formData.roleId > 2)
      newErrors.roleId = "Role ID must be 1 or 2";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
      } else {
        // 註冊成功訊息
        setMessage(data.message || "Registration successful! Please check your email for the verification code.");
        // 跳轉到 Email 驗證頁，並帶入 email
        navigate("/register/verify", { state: { email: formData.email } });
      }
    } catch {
      setMessage("Network error");
    }
  };

  return (
    <Container style={{ maxWidth: 480 }} className="mt-5">
      <h2 className="mb-4 text-center">User Register</h2>

      {message && (
        <Alert variant={message.toLowerCase().includes("success") ? "success" : "danger"}>
          {message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>
            Username <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>
            Password <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

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
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="roleId">
          <Form.Label>
            Role ID (1 買家 or 2 賣家) <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            isInvalid={!!errors.roleId}
          >
            <option value={1}>買家</option>
            <option value={2}>賣家</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.roleId}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="defaultAddress">
          <Form.Label>Default Address</Form.Label>
          <Form.Control
            type="text"
            name="defaultAddress"
            value={formData.defaultAddress}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="defaultReceiverName">
          <Form.Label>Default Receiver Name</Form.Label>
          <Form.Control
            type="text"
            name="defaultReceiverName"
            value={formData.defaultReceiverName}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="defaultReceiverPhone">
          <Form.Label>Default Receiver Phone</Form.Label>
          <Form.Control
            type="text"
            name="defaultReceiverPhone"
            value={formData.defaultReceiverPhone}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Register
        </Button>
      </Form>
    </Container>
  );
}
