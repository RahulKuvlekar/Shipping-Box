import "./App.css";
import { Button } from "@components/ui/button";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
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
    </>
  );
}

export default App;
