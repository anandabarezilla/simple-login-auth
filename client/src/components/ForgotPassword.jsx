import { MdOutlineMail } from "react-icons/md";
import InputField from "./elements/input";
import Button from "./elements/button";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { forgotValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { generateOTP } from "../helper/helper";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: forgotValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      // console.log(values.email);
      const OTPPromise = generateOTP(values);

      toast.promise(OTPPromise, {
        loading: "Sending OTP..",
        success: <b>Check your email to get OTP code!</b>,
        error: (err) => <b>{err.error.response.data.error}</b>,
      });

      OTPPromise.then(() => {
        // console.log(data);
        navigate("/verifyOTP");
      });
    },
  });

  return (
    <div className="bg-gradient-to-b from-primary to-sky-300 flex justify-center items-center min-h-screen">
      <div className="bg-secondary py-6 w-1/2 rounded-lg shadow-lg">
        <div className="text-center">
          <Toaster />
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Forgot your password?</h1>
          <p className="text-lg font-semibold text-slate-500 mb-2">Enter your email address to get OTP</p>
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
            {formik.errors.email && <h1 className="text-red-500 italic">{formik.errors.email}</h1>}
            <Button button={"Next"} />
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

export default ForgotPassword;
