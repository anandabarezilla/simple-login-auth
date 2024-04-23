import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOTP from "./components/VerifyOTP";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";
import AuthorizeUser from "./middleware/auth";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot",
      element: <ForgotPassword />,
    },
    {
      path: "/verifyOTP",
      element: <VerifyOTP />,
    },
    {
      path: "/resetPassword",
      element: <ResetPassword />,
    },
    {
      path: "/profile",
      element: (
        <AuthorizeUser>
          <Profile />
        </AuthorizeUser>
      ),
    },
  ]);

  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
