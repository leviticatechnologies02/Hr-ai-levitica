import React from "react";

const ProductivityDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        Productivity Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Manage tasks, projects, reports and employee productivity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold">Total Tasks</h2>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold">Completed Tasks</h2>
          <p className="text-3xl font-bold mt-2">95</p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold">Active Projects</h2>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>

      </div>
    </div>
  );
};

export default ProductivityDashboard;