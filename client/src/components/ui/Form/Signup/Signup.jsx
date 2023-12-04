import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useSignupMutation } from "../../../../slices/api/userSlice";
import { setCredentials } from "../../../../slices/state/authenticationSlice";
import Loader from "../../Loading/Loader";
import Input from "../Input/Input";
import { getBgcolor } from "../../../../utils/getBgColor";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function onFormSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const bgColor = getBgcolor();
        const response = await signup({
          name,
          email,
          password,
          bgColor,
        }).unwrap();
        toast.success("User created successfully");
        dispatch(setCredentials({ ...response }));
        navigate("/chat");
      } catch (error) {
        toast.error(error?.data?.message);
      }
    }

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <Form onSubmit={onFormSubmit}>
      <Input
        className={"mb-1"}
        controlId={"text"}
        type={"text"}
        placeholder={"Enter Your Name"}
        label={"Name"}
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <Input
        className={"mb-1"}
        controlId={"email"}
        type={"email"}
        placeholder={"Enter email"}
        label={"Email Address"}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Input
        className={"mb-1"}
        controlId={"password"}
        type={"password"}
        placeholder={"Password"}
        label={"Password"}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <Input
        className={"mb-3"}
        controlId={"confirm-password"}
        type={"password"}
        placeholder={"Confirm Password"}
        label={"Confirm Password"}
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
      />
      <Button
        className={`d-block m-auto w-100`}
        variant="primary"
        type="submit"
        disabled={isLoading}
      >
        Signup
      </Button>
      {isLoading && <Loader />}
    </Form>
  );
}
