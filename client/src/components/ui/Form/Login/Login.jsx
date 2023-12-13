import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Input from "../Input/Input";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useLoginMutation } from "../../../../slices/api/userSlice";
import { setCredentials } from "../../../../slices/state/authenticationSlice";
import Loader from "../../Loading/Loader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  async function onFormSubmit(e) {
    e.preventDefault();

    try {
      const response = await login({ email, password }).unwrap();
      toast.success("User logged in successfully");
      dispatch(setCredentials({ ...response }));
      navigate("/chat");
    } catch (error) {
      toast.error(error?.data?.message);
    }

    setEmail("");
    setPassword("");
  }

  return (
    <>
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
        {isLoading && <Loader />}
      </Form>
      <div className="d-flex flex-column">
        <Button
          onClick={(e) => {
            setEmail("guest@user1.com");
            setPassword("12345678");
          }}
          className={`w-100 d-inline-block mt-2`}
          variant="secondary"
        >
          Get Guest User-1 Credentials
        </Button>
        <Button
          onClick={(e) => {
            setEmail("guest@user2.com");
            setPassword("12345678");
          }}
          className={`w-100 d-inline-block mt-2`}
          variant="secondary"
        >
          Get Guest User-2 Credentials
        </Button>
      </div>
    </>
  );
}
