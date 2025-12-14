import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "@components/layout/MainLayout";
import DetailsTable from "@features/DetailsTable";
import ShippingForm from "@features/ShippingForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <DetailsTable />,
      },
      {
        path: "/shipping-form",
        element: <ShippingForm />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
