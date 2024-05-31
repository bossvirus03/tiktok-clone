/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@apollo/client";
import { useUserStore } from "../stores/userStore";
import { useGeneralStore } from "../stores/generalStore";
import { useState } from "react";
import { GraphQLErrorExtensions } from "graphql";
import Input from "./Input";
import { LOGIN_USER } from "../graphql/mutations/Login";

function Login() {
  const [loginUser, { loading, error, data }] = useMutation(LOGIN_USER);
  const setUser = useUserStore((state) => state.setUser);
  const [invalidCredentials, setInvalidCredentials] = useState("");
  const setIsLoginOpen = useGeneralStore((state) => state.setLoginIsOpen);
  const [errors, setErrors] = useState<GraphQLErrorExtensions>({});
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLoginUser = async () => {
    setInvalidCredentials("");
    try {
      const { data } = await loginUser({
        variables: {
          email: loginData.email,
          password: loginData.password,
        },
      });
      setUser(data.login.user);
      setIsLoginOpen(false);
    } catch (err: any) {
      console.log(err.graphQLErrors[0].extensions);
      if (
        err.graphQLErrors &&
        err.graphQLErrors[0].extensions.invalidCredentials
      ) {
        setInvalidCredentials(
          err.graphQLErrors[0].extensions.invalidCredentials
        );
      } else {
        const validationErrors = err.graphQLErrors[0].extensions;
        setErrors(validationErrors);
      }
    }
  };

  return (
    <>
      <h1 className="text-center text-[28px] mb-4 font-bold">Sign In</h1>
      <div className="px-6 pb-2">
        <Input
          max={30}
          placeHolder="Email"
          inputType="text"
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
          autoFocus={true}
          error={errors?.email as string}
        />
      </div>
      <div className="px-6 pb-2">
        <Input
          max={30}
          placeHolder="Password"
          inputType="password"
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          autoFocus={true}
          error={errors?.password as string}
        />
      </div>

      <div className="px-6 mt-2">
        {invalidCredentials && (
          <span className="text-red-500 text-[14px] font-semibold">
            {invalidCredentials}
          </span>
        )}
        <button
          onClick={handleLoginUser}
          disabled={!loginData.email || !loginData.password}
          className={[
            "w-full text-[17px] font-semibold text-white py-3 rounded-sm",
            !loginData.email || !loginData.password
              ? "bg-gray-200"
              : "bg-[#F02C56]",
          ].join(" ")}
        >
          Login
        </button>
      </div>
    </>
  );
}

export default Login;
