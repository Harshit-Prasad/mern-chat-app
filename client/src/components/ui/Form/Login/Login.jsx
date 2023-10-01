import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Input from "../Input/Input";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useLoginMutation } from "../../../../slices/api/userSlice";
import { setCredentials } from "../../../../slices/state/authenticationSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  function onEmailChange(e) {
    e.preventDefault();
  }

  function onPasswordChange(e) {
    e.preventDefault();
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    console.log(password, email);

    try {
      const response = await login({ email, password }).unwrap();
      toast.success("User logged in successfully");
      dispatch(setCredentials({ ...response }));
      navigate("/chat");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }

    setEmail("");
    setPassword("");
  }

  return (
    <Form onSubmit={onFormSubmit}>
      <Input
        className={"mb-3"}
        controlId={"fomrBasicEmail"}
        type={"email"}
        placeholder={"Enter Email"}
        label={"Email Address"}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Input
        className={"mb-3"}
        controlId={"fomrBasicPassword"}
        type={"password"}
        placeholder={"Enter Password"}
        label={"Password"}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <Button className={`w-100`} variant="primary" type="submit">
        Login
      </Button>
      <Button
        onClick={(e) => {
          setEmail("guest@user.com");
          setPassword("12345678");
        }}
        className={`w-100 mt-2`}
        variant="secondary"
      >
        Get Guest User Credentials
      </Button>
    </Form>
  );
}
