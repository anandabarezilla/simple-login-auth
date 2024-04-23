import { useFormik } from "formik";
import { FaRegUser } from "react-icons/fa";
import { LuKeyRound } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import InputField from "./elements/input";
import Button from "./elements/button";
import { Link, useNavigate } from "react-router-dom";
import { registerValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { registerUser } from "../helper/helper";

const Register = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // console.log(values);
      const registerPromise = registerUser(values);
      await toast.promise(registerPromise, {
        loading: "Creating..",
        success: <b>Register Success!</b>,
        error: (err) => <b>{err.error.response.data.error}</b>,
      });

      registerPromise.then(() => {
        navigate("/");
      });
    },
  });

  return (
    <div className="bg-gradient-to-b from-primary to-sky-300 flex justify-center items-center min-h-screen">
      <div className="bg-secondary py-6 w-1/2 rounded-lg shadow-lg">
        <Toaster />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Hola!</h1>
          <p className="text-lg font-semibold text-slate-500 mb-2">Register your account</p>
        </div>

        <div className="form px-4 text-center">
          <form onSubmit={formik.handleSubmit}>
            <InputField
              type={"text"}
              placeholder={"email.."}
              name={"email"}
              onchange={formik.handleChange}
              value={formik.values.email}
              className="bg-red-800"
            >
              {<MdOutlineMail size={20} />}
            </InputField>
            {formik.errors.email ? <h1 className="text-red-500 italic">{formik.errors.email}</h1> : null}

            <InputField
              type={"text"}
              placeholder={"Username.."}
              name={"username"}
              onchange={formik.handleChange}
              value={formik.values.username}
              className="bg-red-800"
            >
              {<FaRegUser size={20} />}
            </InputField>
            {formik.errors.username ? <h1 className="text-red-500 italic">{formik.errors.username}</h1> : null}

            <InputField
              type={"password"}
              placeholder={"password.."}
              name={"password"}
              onchange={formik.handleChange}
              value={formik.values.password}
            >
              <LuKeyRound size={20} />
            </InputField>
            {formik.errors.password ? <h1 className="text-red-500 italic">{formik.errors.password}</h1> : null}

            <Button button={"Register"} />
          </form>
          <div className="text-center py-4">
            <Link
              to="/"
              className="text-sky-500 hover:underline"
            >
              Back to login page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
