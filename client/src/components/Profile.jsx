import { useState } from "react";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import profile from "../assets/profile.png";
import Button from "./elements/button";
import convertToBase64 from "../helper/convert";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { profileValidate } from "../helper/validate";
import useFetch from "../hooks/fetchHooks";
import { updateUser } from "../helper/helper";

const Profile = () => {
  // const username = useAuthStore((set) => set.auth.username);

  const [file, setFile] = useState();

  const [data] = useFetch();
  const { isLoading, apiData, serverError } = data;
  const dataUser = apiData?.user;
  // console.log(dataUser);

  const formik = useFormik({
    initialValues: {
      firstName: dataUser?.firstName || "",
      lastName: dataUser?.lastName || "",
      email: dataUser?.email || "",
      phone: dataUser?.phone || "",
      address: dataUser?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      // console.log(values);
      try {
        values = Object.assign(values, { profile: file || dataUser?.profile || "" });
        const updatePromise = updateUser(values);
        toast.promise(updatePromise, {
          loading: "updating...",
          success: (data) => <b>{data.message}</b>,
          error: <b>Failed to update!</b>,
        });

        // updatePromise.then((data) => console.log(data));
      } catch (error) {
        console.log(error);
        toast.error("failed to update");
      }
    },
  });

  const onUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    // Check whether user upload new file/image
    if (!uploadedFile) return;

    const upload = await convertToBase64(uploadedFile);

    setFile(upload);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <div className="bg-gradient-to-b from-primary to-sky-300 flex justify-center items-center min-h-screen">
      <Toaster />
      <div className="bg-secondary py-6 w-1/2 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold text-slate-800">Hi, {dataUser ? dataUser?.username : "User"}!</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="my-6">
            <label htmlFor="profile">
              <img
                src={file || dataUser?.profile || profile}
                alt="profile_picture"
                htmlFor="profile"
                className="w-[35%] mx-auto cursor-pointer overflow-hidden rounded-full hover:ring-2"
              />

              <input
                type="file"
                id="profile"
                name="profile"
                className="hidden"
                onChange={onUpload}
              />
            </label>
          </div>
          <div className=" px-2 mb-3">
            <div className="flex justify-center gap-2 my-2">
              <input
                {...formik.getFieldProps("firstName")}
                type="text"
                name="firstName"
                id="firstName"
                placeholder="first name"
                className="focus:outline-none w-1/2 p-2 text-xl text-slate-700 bg-secondary border-b-2 hover:border-sky-300"
                value={formik.values.firstName}
              />
              <input
                {...formik.getFieldProps("lastName")}
                type="text"
                name="lastName"
                id="lastName"
                placeholder="last name"
                className="focus:outline-none w-1/2 p-2 text-xl text-slate-700 bg-secondary border-b-2 hover:border-sky-300"
                value={formik.values.lastName}
              />
            </div>
            <div className="mb-2 flex flex-col gap-3 w-[90%] mx-auto">
              <input
                {...formik.getFieldProps("email")}
                type="text"
                name="email"
                id="email"
                placeholder="email.."
                className="border-b-2 hover:border-sky-300 focus:outline-none p-2 text-xl text-slate-700 bg-secondary"
                value={formik.values.email}
              />
              <input
                {...formik.getFieldProps("phone")}
                type="text"
                name="phone"
                id="phone"
                placeholder="mobile phone.."
                className="border-b-2 hover:border-sky-300 focus:outline-none p-2 text-xl text-slate-700 bg-secondary"
                value={formik.values.phone}
              />
              <input
                {...formik.getFieldProps("address")}
                type="text"
                name="address"
                id="address"
                placeholder="address.."
                className="border-b-2 hover:border-sky-300 focus:outline-none p-2 text-xl text-slate-700 bg-secondary"
                value={formik.values.address}
              />
            </div>
          </div>
          <div className="text-center">
            <Button button="Update" />
          </div>

          <div className="text-center mt-4">
            <Link
              to="/"
              className="
             text-sky-500 hover:underline hover:text-sky-300"
              onClick={handleLogout}
            >
              Logout
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
