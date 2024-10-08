import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import type { ApiError } from "@typesFolder/apiError";

import { useAppDispatch } from "@store/hooks";
import { login as loginAction } from "@store/authSlice";
import { useSignupMutation } from "@features/api/authApiSlice";

const SignupPage = () => {
  const [signup, { isLoading, isError, error }] = useSignupMutation();
  // const { isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "username") {
      setFormData({ ...formData, username: e.target.value });
    } else if (e.target.name === "fullname") {
      setFormData({ ...formData, fullName: e.target.value });
    } else if (e.target.name === "email") {
      setFormData({ ...formData, email: e.target.value });
    } else if (e.target.name === "password") {
      setFormData({ ...formData, password: e.target.value });
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await signup(formData).unwrap();
      setFormData({ email: "", password: "", fullName: "", username: "" });
      dispatch(
        loginAction({
          _id: data._id,
          email: data.email,
          username: data.username,
        })
      );
      navigate("/app", { replace: true });
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <div className={` flex justify-center items-center flex-col `}>
      <h1 className="text-center font-extrabold text-[55px] ">RippleChat</h1>
      <div className="w-[340px] lg:w-[400px] rounded shadow-lg p-4 bg-card">
        <div className="text-center mb-2 text-card-foreground">
          <h2 className="font-bold text-2xl ">Create a new account</h2>
          <p className="">It's quick and easy.</p>
        </div>
        <form
          className="flex flex-col gap-2 text-card-foreground "
          onSubmit={handleSubmit}
        >
          <Label htmlFor="username" className="text-card-foreground">
            Username
          </Label>
          <Input
            type="text"
            id="username"
            name="username"
            onChange={handleChange}
          />
          <Label htmlFor="fullname">Full name</Label>
          <Input
            type="text"
            id="fullname"
            name="fullname"
            onChange={handleChange}
          />
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" onChange={handleChange} />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
          />
          {isError && (
            <p className="text-red-500 text-center">
              {(error as ApiError)?.data?.message}
            </p>
          )}
          <Button className="button " disabled={isLoading}>
            Signup
          </Button>
          <Link to="/login" className="mt-3">
            <p className="text-center ">Already have an account?</p>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
