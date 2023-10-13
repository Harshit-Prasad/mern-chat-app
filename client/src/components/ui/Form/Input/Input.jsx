import React from "react";
import { FloatingLabel, Form } from "react-bootstrap";

export default function Input({
  className,
  controlId,
  type,
  placeholder,
  label,
  onChange,
  value,
}) {
  return (
    <Form.Group className={className} controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required={true}
      />
    </Form.Group>
  );
}
