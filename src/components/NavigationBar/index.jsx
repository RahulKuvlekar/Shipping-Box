import React from "react";
import { NavLink } from "react-router";

const NavigationBarItem = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "bg-primary text-white p-2 rounded-md text-sm md:text-base"
          : "p-2 rounded-md text-sm md:text-base"
      }
    >
      {label}
    </NavLink>
  );
};

const NavigationBar = ({ navigationItems }) => {
  return (
    <header className="bg-white p-4 flex justify-between items-center">
      <h1 className="text-base md:text-2xl font-bold">
        Shipping Box Recruiterflow
      </h1>
      <nav className="flex gap-2">
        {navigationItems.map((item) => (
          <NavigationBarItem key={item.to} {...item} />
        ))}
      </nav>
    </header>
  );
};

export default NavigationBar;
