import React from "react";
import { Outlet } from "react-router";
import NavigationBar from "@/components/NavigationBar";

const NAVIGATION_ITEMS = [
  {
    to: "/",
    label: "Details Table",
  },
  {
    to: "/shipping-form",
    label: "Shipping Form",
  },
];

const MainLayout = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <NavigationBar navigationItems={NAVIGATION_ITEMS} />
      <section className="p-4">
        <Outlet />
      </section>
    </main>
  );
};

export default MainLayout;
