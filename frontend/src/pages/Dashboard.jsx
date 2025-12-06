import { useCallback, useEffect, useMemo, useState } from 'react';
import StatsCard from '../components/cards/StatsCard.jsx';
import MetricCard from '../components/cards/MetricCard.jsx';
import RevenueChart from '../components/charts/RevenueChart.jsx';
import TopCustomersChart from '../components/charts/TopCustomersChart.jsx';
import EventFunnelChart from '../components/charts/EventFunnelChart.jsx';
import OrdersByDateChart from '../components/charts/OrdersByDateChart.jsx';
import TopCustomersList from '../components/cards/TopCustomersList.jsx';
import Loader from '../components/common/Loader.jsx';
import useFetch from '../hooks/useFetch.js';
import useAuth from '../hooks/useAuth.js';
import * as dashboardService from '../services/dashboardService.js';
import { deriveChartSeries } from '../utils/helpers.js';
import {
  btnOutlineClass,
  btnPrimaryClass,
  cardGridClass,
  panelClass,
  pillClass
} from '../utils/styles.js';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    data: metrics,
    loading,
    error,
    refetch
  } = useFetch(dashboardService.getMetrics, []);
  const [syncing, setSyncing] = useState(false);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);
    const format = (date) => date.toISOString().split('T')[0];
    return {
      start: format(start),
      end: format(end)
    };
  });
  const [ordersTrend, setOrdersTrend] = useState([]);
  const [ordersTrendLoading, setOrdersTrendLoading] = useState(true);
  const [ordersTrendError, setOrdersTrendError] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topCustomersLoading, setTopCustomersLoading] = useState(true);
  const [topCustomersError, setTopCustomersError] = useState(null);

  const loadOrdersTrend = useCallback(async () => {
    setOrdersTrendLoading(true);
    setOrdersTrendError(null);
    try {
      const data = await dashboardService.getOrdersByDate({
        startDate: dateRange.start,
        endDate: dateRange.end
      });
      setOrdersTrend(data.map((row) => ({
        date: row.date,
        Orders: Number(row.orderCount) || 0,
        'Total Sales': Number(row.totalSales) || 0
      })));
    } catch (err) {
      setOrdersTrendError(err);
    } finally {
      setOrdersTrendLoading(false);
    }
  }, [dateRange]);

  const loadTopCustomers = useCallback(async () => {
    setTopCustomersLoading(true);
    setTopCustomersError(null);
    try {
      const customers = await dashboardService.getTopCustomers();
      setTopCustomers(customers);
    } catch (err) {
      setTopCustomersError(err);
    } finally {
      setTopCustomersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrdersTrend();
  }, [loadOrdersTrend]);

  useEffect(() => {
    loadTopCustomers();
  }, [loadTopCustomers]);

  const handleManualSync = async () => {
    try {
      setSyncing(true);
      await dashboardService.triggerIngestion();
      await refetch();
    } finally {
      setSyncing(false);
    }
  };

  const stats = metrics || {};
  const eventData = [
    { name: 'Checkout started', value: stats.checkoutStartedCount || 0 },
    { name: 'Cart abandoned', value: stats.cartAbandonedCount || 0 },
    { name: 'Orders completed', value: stats.orderCount || 0 }
  ];
  const topCustomersChartData = useMemo(() => (
    topCustomers.map((customer) => ({
      name: customer.firstName || customer.lastName
        ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
        : customer.email || `Customer ${customer.id}`,
      value: Number(customer.totalSpent) || 0
    }))
  ), [topCustomers]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={panelClass}>
        <p className="text-sm font-semibold text-rose-500">Failed to load metrics: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-linear-to-br from-indigo-600 to-purple-600 p-8 text-white shadow-2xl shadow-purple-500/40">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-4">
            <span className={`${pillClass} bg-white/20 text-white`}>Realtime overview</span>
            <h2 className="text-2xl font-semibold md:text-3xl">
              Hi Nishant Kumar, your store pulse looks strong.
            </h2>
            <p className="max-w-xl text-white/80">
              Track revenue, orders, and lifecycle events in one view. Kick off a manual ingestion to stream the latest Shopify signals.
            </p>
          </div>
          <div className="flex min-w-[200px] flex-col gap-3">
            <button onClick={handleManualSync} disabled={syncing} className={`${btnPrimaryClass} w-full`}>
              {syncing ? 'Syncing...' : 'Run ingestion'}
            </button>
            <button className={btnOutlineClass} onClick={refetch}>Refresh metrics</button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-6">
          <div>
            <small className="text-xs uppercase tracking-widest text-white/70">Gross sales</small>
            <strong className="text-2xl">${Number(stats.totalSales || 0).toLocaleString()}</strong>
          </div>
          <div>
            <small className="text-xs uppercase tracking-widest text-white/70">Orders</small>
            <strong className="text-2xl">{stats.orderCount || 0}</strong>
          </div>
          <div>
            <small className="text-xs uppercase tracking-widest text-white/70">Customers</small>
            <strong className="text-2xl">{stats.customerCount || 0}</strong>
          </div>
        </div>
      </section>

      <div className={cardGridClass}>
        <StatsCard label="Total Sales" value={stats.totalSales} type="currency" accent="indigo" />
        <StatsCard label="Orders" value={stats.orderCount} accent="emerald" />
        <StatsCard label="Customers" value={stats.customerCount} accent="amber" />
        <StatsCard label="Products" value={stats.productCount} accent="pink" />
      </div>

      <div className={cardGridClass}>
        <MetricCard title="Successful Sync" subtitle="last sync items" value={(stats.orderCount || 0) + (stats.productCount || 0)} />
        <MetricCard title="Avg. Order Value" subtitle="derived" value={stats.orderCount ? (stats.totalSales / stats.orderCount).toFixed(2) : 0} />
        <MetricCard title="Checkouts Started" subtitle="lifecycle" value={stats.checkoutStartedCount || 0} />
        <MetricCard title="Carts Abandoned" subtitle="lifecycle" value={stats.cartAbandonedCount || 0} />
      </div>

      <div className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Orders by Date</h4>
            <p className="text-sm text-slate-500">Filter by date range to analyze order velocity.</p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col text-xs font-semibold uppercase tracking-widest text-slate-400">
              Start
              <input
                type="date"
                name="start"
                value={dateRange.start}
                max={dateRange.end}
                onChange={(event) => setDateRange((prev) => ({ ...prev, start: event.target.value }))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-widest text-slate-400">
              End
              <input
                type="date"
                name="end"
                value={dateRange.end}
                min={dateRange.start}
                onChange={(event) => setDateRange((prev) => ({ ...prev, end: event.target.value }))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
              />
            </label>
            <button
              onClick={loadOrdersTrend}
              disabled={ordersTrendLoading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="mt-5">
          {ordersTrendLoading && <Loader />}
          {!ordersTrendLoading && ordersTrendError && (
            <p className="text-sm font-semibold text-rose-500">Unable to load order trend: {ordersTrendError.message}</p>
          )}
          {!ordersTrendLoading && !ordersTrendError && (
            <OrdersByDateChart data={ordersTrend} />
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={deriveChartSeries(stats.totalSales, 'Revenue')} />
        <EventFunnelChart data={eventData} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {topCustomersLoading ? (
          <div className={panelClass}>
            <Loader />
          </div>
        ) : topCustomersError ? (
          <div className={panelClass}>
            <p className="text-sm font-semibold text-rose-500">Unable to load top customers: {topCustomersError.message}</p>
          </div>
        ) : (
          <TopCustomersChart data={topCustomersChartData} />
        )}
        <TopCustomersList customers={topCustomers} />
      </div>
    </div>
  );
};

export default Dashboard;
