// src/app/tenant/dashboard/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FC } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4000 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 7000 },
];

const dummyOrders = [
  {
    id: "ORD-001",
    property: "Property 1",
    date: "2025-09-15",
    total: "Rp 4.500.000",
    status: "Completed",
  },
  {
    id: "ORD-002",
    property: "Property 2",
    date: "2025-09-12",
    total: "Rp 3.200.000",
    status: "Pending",
  },
  {
    id: "ORD-003",
    property: "Property 3",
    date: "2025-09-10",
    total: "Rp 5.000.000",
    status: "Cancelled",
  },
];

const TenantDashboardPage: FC = () => {
  return (
    <div className="space-y-20">
      <section className="relative bg-[#0290d1] text-white rounded-2xl overflow-hidden p-8 md:p-16 flex items-center">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold">
            Welcome to Homigo Tenant Dashboard
          </h1>
          <p className="text-lg md:text-xl text-white/80">
            Manage your properties, track payments, and stay on top of
            maintenance requests easily and efficiently.
          </p>
          <Button className="mt-4 bg-white text-[#0290d1] hover:bg-white/90">
            Explore Features
          </Button>
        </div>

        <div
          className="absolute right-25 top-0 hidden md:block"
          style={{ width: "20%", height: "350px" }}
        >
          <Image
            src="/assets/ho.webp"
            alt="Tenant Dashboard Illustration"
            fill
            className="object-contain object-right"
          />
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-6 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0290d1]">
          Sales Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-400">Total Income</p>
            <p className="text-2xl font-bold">Rp 120.000.000</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-400">Total Properties</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-400">Active Tenants</p>
            <p className="text-2xl font-bold">35</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-400">Pending Requests</p>
            <p className="text-2xl font-bold">4</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#0290d1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-6 space-y-6">
        <h2 className="text-2xl font-bold text-[#0290d1]">My Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dummyOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">{order.date}</p>
                <h3 className="text-lg font-semibold">{order.property}</h3>
                <p className="text-gray-400 text-sm">Order ID: {order.id}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-lg font-bold">{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TenantDashboardPage;
