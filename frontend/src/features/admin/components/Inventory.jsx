import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectOrders, getAllOrdersAsync } from "../../order/OrderSlice";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import axios from "axios";
import { Stack, Typography, CircularProgress } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d32f2f"];

const Inventory = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllOrdersAsync());

    // Fetch product count from the database
    const fetchProductCount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products/count");       // Adjust to your backend API
        setProductCount(response.data.totalProducts);
      } catch (error) {
        console.error("Error fetching product count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductCount();
  }, [dispatch]);

  // Process order data
  const orderStats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "Pending").length,
    dispatchedOrders: orders.filter((o) => o.status === "Dispatched").length,
    deliveredOrders: orders.filter((o) => o.status === "Delivered").length,
    cancelledOrders: orders.filter((o) => o.status === "Cancelled").length,
  };

  // Prepare data for charts
  const pieData = [
    { name: "Pending", value: orderStats.pendingOrders },
    { name: "Dispatched", value: orderStats.dispatchedOrders },
    { name: "Delivered", value: orderStats.deliveredOrders },
    { name: "Cancelled", value: orderStats.cancelledOrders },
  ];

  const barData = [
    { name: "Orders", Total: orderStats.totalOrders },
    { name: "Products", Total: productCount },
  ];

  return (
    <Stack spacing={4} alignItems="center" mt={5}>
      <Typography variant="h4">Inventory Dashboard</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Pie Chart for Order Status */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Bar Chart for Orders vs Products */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Total" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </Stack>
  );
};

export default Inventory;
