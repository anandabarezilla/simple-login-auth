import { Link, useNavigate } from "react-router-dom";
import imageLogin from "../assets/profile.png";
import { FaRegUser } from "react-icons/fa";
import { LuKeyRound } from "react-icons/lu";
import { useFormik } from "formik";
import InputField from "./elements/input";
import Button from "./elements/button";
import { loginValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { loginUser } from "../helper/helper";
import { useAuthStore } from "../store/store";

const Login = () => {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: loginValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // console.log(values);
      setUsername(values.username);
      const loginPromise = loginUser(values);
      toast.promise(loginPromise, {
        loading: "Login..",
        success: <b>Login Success!</b>,
        error: (err) => <b>{err.error.response.data.error}</b>,
      });
      loginPromise.then((data) => {
        const token = data.token;
        localStorage.setItem("token", token);
        navigate("/profile");
      });
    },
  });

  return (
    <div className="bg-gradient-to-b from-primary to-sky-300 flex justify-center items-center min-h-screen">
      <div className="bg-secondary py-6 w-1/2 rounded-lg shadow-lg">
        <Toaster reverseOrder={false} />
        <img
          src={imageLogin}
          alt="image"
          className="w-32 mx-auto py-4"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Welcome!</h1>
          <p className="text-lg font-semibold text-slate-500 mb-2">Login to your account</p>
        </div>

        <div className="form px-4 text-center">
          <form onSubmit={formik.handleSubmit}>
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
            {formik.errors.username && <h1 className="text-red-500 italic">{formik.errors.username}</h1>}
            <InputField
              type={"password"}
              placeholder={"password.."}
              name={"password"}
              onchange={formik.handleChange}
              value={formik.values.password}
            >
              <LuKeyRound size={20} />
            </InputField>
            {formik.errors.password && <h1 className="text-red-500 italic">{formik.errors.password}</h1>}
            <div className="flex justify-around my-2">
              <div className="remember flex items-center gap-2 ">
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  className="cursor-pointer accent-sky-500"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-slate-600 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sky-400 text-sm hover:underline">
                <Link to="/forgot">Forgot Password?</Link>
              </div>
            </div>

            <Button button={"Login"} />

            <div className="text-sky-400 mt-3 hover:underline">
              <Link to="/register">Don't have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
