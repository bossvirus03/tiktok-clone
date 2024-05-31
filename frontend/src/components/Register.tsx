/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../graphql/mutations/Register";
import { useUserStore } from "../stores/userStore";
import { useGeneralStore } from "../stores/generalStore";
import { useState } from "react";
import { GraphQLErrorExtensions } from "graphql";
import Input from "./Input";

function Register() {
  const [registerUser, { loading, error, data }] = useMutation(REGISTER_USER);
  const setUser = useUserStore((state) => state.setUser);

  const setIsLoginOpen = useGeneralStore((state) => state.setLoginIsOpen);
  const [errors, setErrors] = useState<GraphQLErrorExtensions>({});
  const [registerData, setRegisterData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegisterUser = async () => {
    try {
      const { data } = await registerUser({
        variables: {
          email: registerData.email,
          password: registerData.password,
          fullname: registerData.fullname,
          confirmPassword: registerData.confirmPassword,
        },
      });
      setUser(data.register.user);
      setIsLoginOpen(false);
    } catch (err: any) {
      if (err.graphQLErrors && err.graphQLErrors[0].extensions) {
        const validationErrors = err.graphQLErrors[0].extensions;
        setErrors(validationErrors);
      }
    }
  };
  return (
    <>
      <h1 className="text-center text-[28px] mb-4 font-bold">Sign Up</h1>
      <div className="px-6 pb-2">
        <Input
          max={30}
          placeHolder="Full Name"
          inputType="text"
          onChange={(e) =>
            setRegisterData({ ...registerData, fullname: e.target.value })
          }
          autoFocus={true}
          error={errors?.fullname as string}
        />
      </div>
      <div className="px-6 pb-2">
        <Input
          max={30}
          placeHolder="Email"
          inputType="text"
          onChange={(e) =>
            setRegisterData({ ...registerData, email: e.target.value })
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
            setRegisterData({ ...registerData, password: e.target.value })
          }
          autoFocus={true}
          error={errors?.password as string}
        />
      </div>
      <div className="px-6 pb-2">
        <Input
          max={30}
          placeHolder="Confirm Password"
          inputType="password"
          onChange={(e) =>
            setRegisterData({
              ...registerData,
              confirmPassword: e.target.value,
            })
          }
          autoFocus={true}
          error={errors?.confirmPassword as string}
        />
      </div>
      <div className="px-6 mt-2">
        <button
          onClick={handleRegisterUser}
          disabled={
            !registerData.email ||
            !registerData.password ||
            !registerData.fullname ||
            !registerData.confirmPassword
          }
          className={[
            "w-full text-[17px] font-semibold text-white py-3 rounded-sm",
            !registerData.email ||
            !registerData.password ||
            !registerData.fullname ||
            !registerData.confirmPassword
              ? "bg-gray-200"
              : "bg-[#F02C56]",
          ].join(" ")}
        >
          Register
        </button>
      </div>
    </>
  );
}

export default Register;
