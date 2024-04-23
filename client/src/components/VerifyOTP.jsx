import InputField from "./elements/input";
import Button from "./elements/button";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LuKeyRound } from "react-icons/lu";
import { useFormik } from "formik";
import { verifyOTP } from "../helper/helper";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      OTP: "",
    },
    onSubmit: (values) => {
      const verifyPromise = verifyOTP(values.OTP.trim());

      toast.promise(verifyPromise, {
        loading: "verifying...",
        success: (data) => <b>{data.data.message}</b>,
        error: (err) => <b>{err.error.response.data.error}</b>,
      });

      verifyPromise.then(() => {
        navigate("/resetPassword");
      });
    },
  });

  return (
    <div className="bg-gradient-to-b from-primary to-sky-300 flex justify-center items-center min-h-screen">
      <div className="bg-secondary py-6 w-1/2 rounded-lg shadow-lg">
        <Toaster />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Verification</h1>
          <p className="text-lg font-semibold text-slate-500 mb-2">Enter your 6 digits</p>
        </div>

        <div className="form px-4 text-center">
          <form onSubmit={formik.handleSubmit}>
            <InputField
              type={"text"}
              placeholder={"OTP.."}
              name={"OTP"}
              onchange={formik.handleChange}
              value={formik.values.OTP}
            >
              {<LuKeyRound size={20} />}
            </InputField>

            <Button button={"Verify"} />
          </form>
          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP? <button className="text-sky-500 hover:underline">Resend</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
