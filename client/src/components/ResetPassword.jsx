import InputField from "./elements/input";
import Button from "./elements/button";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { LuKeyRound } from "react-icons/lu";
import { resetPasswordValidate } from "../helper/validate";
import { resetPassword } from "../helper/helper";
import useFetch from "../hooks/fetchHooks";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [data] = useFetch("createResetSession");
  const { isLoading, apiData, serverError, status } = data;
  // console.log(apiData);
  const username = apiData?.tokenVerify.username;

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: resetPasswordValidate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      const resetPromise = resetPassword({ username, password: values.password });
      toast.promise(resetPromise, {
        loading: "loading..",
        success: <b>Successfully reset the password!</b>,
        error: <b>Failed to reset the password</b>,
      });

      resetPromise.then(() => {
        navigate("/");
      });
    },
  });

  return (
    <div className="bg-gradient-to-b from-primary to-sky-300 flex justify-center items-center min-h-screen">
      <Toaster />
      <div className="bg-secondary py-6 w-1/2 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Reset Password</h1>
          <p className="text-lg font-semibold text-slate-500 mb-2">Create your new password</p>
        </div>

        <div className="form px-4 text-center">
          <form onSubmit={formik.handleSubmit}>
            <InputField
              type={"password"}
              placeholder={"New password.."}
              name={"password"}
              onchange={formik.handleChange}
              value={formik.values.OTP}
            >
              {<LuKeyRound size={20} />}
            </InputField>
            {formik.errors.password && <h1 className="text-red-500 italic">{formik.errors.password}</h1>}

            <InputField
              type="password"
              placeholder="Confirm new password.."
              name={"confirmPassword"}
              onchange={formik.handleChange}
            >
              <LuKeyRound size={20} />
            </InputField>
            {formik.errors.confirmPassword && <h1 className="text-red-500 italic">{formik.errors.confirmPassword}</h1>}

            <Button button={"Reset"} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
