'use client';

import { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaMoneyBillWave, 
  FaShoppingCart, 
  FaUsers, 
  FaCalendarAlt, 
  FaUtensils,
  FaClock
} from "react-icons/fa";

import { FiTrendingUp } from "react-icons/fi";  // trending up replacement



const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [analytics, setAnalytics] = useState({
    totalRevenue: 45670,
    totalOrders: 342,
    avgOrderValue: 334,
    newCustomers: 28,
    popularItems: [
      { name: 'Butter Chicken', orders: 45, revenue: 17955 },
      { name: 'Chicken Biryani', orders: 38, revenue: 13262 },
      { name: 'Paneer Tikka', orders: 32, revenue: 7968 },
      { name: 'Veg Biryani', orders: 29, revenue: 8671 },
      { name: 'Dal Makhani', orders: 24, revenue: 5976 }
    ],
    revenueData: [
      { day: 'Mon', revenue: 6500 },
      { day: 'Tue', revenue: 7200 },
      { day: 'Wed', revenue: 5800 },
      { day: 'Thu', revenue: 8100 },
      { day: 'Fri', revenue: 9200 },
      { day: 'Sat', revenue: 4870 },
      { day: 'Sun', revenue: 4000 }
    ],
    ordersByType: [
      { type: 'Dine In', count: 156, percentage: 45.6 },
      { type: 'Delivery', count: 123, percentage: 36.0 },
      { type: 'Pickup', count: 63, percentage: 18.4 }
    ],
    busyHours: [
      { hour: '12:00', orders: 25 },
      { hour: '13:00', orders: 32 },
      { hour: '14:00', orders: 18 },
      { hour: '19:00', orders: 28 },
      { hour: '20:00', orders: 35 },
      { hour: '21:00', orders: 22 }
    ]
  });

  const StatCard = ({ title, value, icon: Icon, change, color = '#e53e3e' }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${color}15` }}>
          <Icon size={24} style={{ color }} />
        </div>
        {change && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  );

  const RevenueChart = () => {
    const maxRevenue = Math.max(...analytics.revenueData.map(d => d.revenue));
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Revenue Trend</h3>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-4">
          {analytics.revenueData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-primary to-red-400 rounded-t-lg transition-all duration-500 hover:scale-105"
                style={{
                  height: `${(data.revenue / maxRevenue) * 200}px`,
                  minHeight: '20px'
                }}
              />
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-gray-800">₹{data.revenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{data.day}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PopularItems = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Popular Items</h3>
      <div className="space-y-4">
        {analytics.popularItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                <FaUtensils className="text-gray-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.orders} orders</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">₹{item.revenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Revenue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const OrderTypeChart = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Orders by Type</h3>
      <div className="space-y-4">
        {analytics.ordersByType.map((type, index) => {
          const colors = ['#e53e3e', '#3182ce', '#38a169'];
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{type.type}</span>
                <span className="text-sm text-gray-600">{type.count} orders ({type.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: colors[index],
                    width: `${type.percentage}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const BusyHours = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Busy Hours</h3>
      <div className="space-y-3">
        {analytics.busyHours.map((hour, index) => {
          const maxOrders = Math.max(...analytics.busyHours.map(h => h.orders));
          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-gray-600">
                {hour.hour}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div
                  className="bg-gradient-to-r from-primary to-red-400 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${(hour.orders / maxOrders) * 100}%` }}
                >
                  <span className="text-white text-xs font-medium">{hour.orders}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your restaurant&apos;s performance and insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${analytics.totalRevenue.toLocaleString()}`}
            icon={FaMoneyBillWave}
            change={12.5}
            color="#e53e3e"
          />
          <StatCard
            title="Total Orders"
            value={analytics.totalOrders.toLocaleString()}
            icon={FaShoppingCart}
            change={8.3}
            color="#3182ce"
          />
          <StatCard
            title="Average Order Value"
            value={`₹${analytics.avgOrderValue}`}
            icon={FaChartLine}
            change={-2.1}
            color="#38a169"
          />
          <StatCard
            title="New Customers"
            value={analytics.newCustomers}
            icon={FaUsers}
            change={15.7}
            color="#805ad5"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PopularItems />
          <OrderTypeChart />
          <BusyHours />
        </div>

        {/* Additional Insights */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiTrendingUp className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Revenue Growth</h4>
                <p className="text-sm text-gray-600">12.5% increase compared to last week</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaClock className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Peak Hours</h4>
                <p className="text-sm text-gray-600">8-9 PM is your busiest time</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaUtensils className="text-purple-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Top Category</h4>
                <p className="text-sm text-gray-600">Main Course generates 45% of revenue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;