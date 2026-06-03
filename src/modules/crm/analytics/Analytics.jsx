import React, { useState, useEffect } from "react";
import { contactsAPI, leadsAPI, dealsAPI, companiesAPI, activitiesAPI } from "../../../shared/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chart from "react-apexcharts";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BASE_URL } from "../../../shared/constants/api.config";
import {
  FiBarChart2,
  FiPieChart,
  FiUsers,
  FiBriefcase,
  FiUserPlus,
  FiCalendar,
  FiTrash2,
  FiDownload,
  FiAlertCircle,
  FiTrendingUp
} from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import { FaBuilding } from "react-icons/fa";

const Analytics = () => {
  const [selectedDate, setSelectedDate] = useState(new Date("2025-04-15"));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeSection, setActiveSection] = useState('all');

  const [loading, setLoading] = useState({
    contacts: true,
    deals: true,
    leads: true,
    companies: true,
    activities: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setError(null);
      
      const [contactsData, dealsData, leadsData, companiesData, activitiesData] = await Promise.all([
        contactsAPI.list().catch(() => []),
        dealsAPI.list().catch(() => []),
        leadsAPI.list().catch(() => []),
        companiesAPI.list().catch(() => []),
        activitiesAPI.list().catch(() => [])
      ]);

      setContacts(Array.isArray(contactsData) ? contactsData : []);
      setDeals(Array.isArray(dealsData) ? dealsData : []);
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
    } catch (err) {
      console.error("Error loading analytics data:", err);
      setError("Failed to load analytics data. Please try again.");
      setContacts([]);
      setDeals([]);
      setLeads([]);
      setCompanies([]);
      setActivities([]);
    } finally {
      setLoading({
        contacts: false,
        deals: false,
        leads: false,
        companies: false,
        activities: false
      });
    }
  };

  const getLeadsBySource = () => {
    const sourceCounts = {};
    leads.forEach(lead => {
      const source = lead.source || "Other";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    return sourceCounts;
  };

  const getDealsByStage = () => {
    const stageCounts = {};
    deals.forEach(deal => {
      const stage = deal.status || deal.stage || "Unknown";
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });
    return stageCounts;
  };

  const leadsSourceData = getLeadsBySource();
  const leadsSourceLabels = Object.keys(leadsSourceData);
  const leadsSourceValues = Object.values(leadsSourceData);
  
  const chartData = {
    series: leadsSourceValues.length > 0 ? leadsSourceValues : [40, 35, 15, 10],
    options: {
      chart: { type: "donut" },
      labels: leadsSourceLabels.length > 0 ? leadsSourceLabels : ["Google", "Paid", "Campaigns", "Referrals"],
      colors: ["#005A9C", "#ffc107", "#fd3995", "#ab47bc"],
      legend: { position: "bottom" },
      dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(0)}%` },
    },
  };

  const dealsStageData = getDealsByStage();
  const dealsStageLabels = Object.keys(dealsStageData);
  const dealsStageValues = Object.values(dealsStageData);

  const barOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "45%", borderRadius: 4 } },
    colors: ["#005A9C", "#210dd4ff"],
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: { categories: dealsStageLabels.length > 0 ? dealsStageLabels : ["Stage 1", "Stage 2", "Stage 3", "Stage 4"] },
    yaxis: { title: { text: "Deals" } },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val) => `${val} deals` } },
    legend: { position: "top" },
  };

  const barSeries = [
    { name: "Income", data: dealsStageValues.length > 0 ? dealsStageValues : [80, 40, 100, 20] },
    { name: "Expenses", data: dealsStageValues.length > 0 ? dealsStageValues.map(v => Math.floor(v * 0.6)) : [100, 100, 120, 60] },
  ];

  const handleDeleteClick = (type, id, name) => {
    setItemToDelete({ type, id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setError(null);
      const { type, id } = itemToDelete;
      
      if (type === "contact") {
        await contactsAPI.delete(id);
        toast.success("Contact deleted successfully!");
      } else if (type === "deal") {
        await dealsAPI.delete(id);
        toast.success("Deal deleted successfully!");
      } else if (type === "lead") {
        await leadsAPI.delete(id);
        toast.success("Lead deleted successfully!");
      } else if (type === "company") {
        await companiesAPI.delete(id);
        toast.success("Company deleted successfully!");
      } else if (type === "activity") {
        await activitiesAPI.delete(id);
        toast.success("Activity deleted successfully!");
      }
      
      await loadAllData();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error(`Failed to delete ${itemToDelete?.type}. Please try again.`);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Analytics Report", 10, 10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 20);
    doc.text(`Total Contacts: ${contacts.length}`, 10, 30);
    doc.text(`Total Deals: ${deals.length}`, 10, 40);
    doc.text(`Total Leads: ${leads.length}`, 10, 50);
    doc.text(`Total Companies: ${companies.length}`, 10, 60);
    doc.text(`Total Activities: ${activities.length}`, 10, 70);
    doc.save("analytics-report.pdf");
    toast.success("Report exported successfully!");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getCompanyName = (lead) => {
    if (typeof lead.company === 'string') return lead.company;
    if (lead.company && lead.company.name) return lead.company.name;
    return "N/A";
  };

  const getOwnerName = (deal) => {
    if (typeof deal.owner === 'string') return deal.owner;
    if (deal.owner && deal.owner.name) return deal.owner.name;
    return "N/A";
  };

  const getDealName = (deal) => {
    return deal.deal_name || deal.name || "N/A";
  };

  const getDealValue = (deal) => {
    return deal.deal_value || deal.value || 0;
  };

  const getContactImage = (contact) => {
    if (contact.profile_photo) {
      return `${BASE_URL}${contact.profile_photo.startsWith('/') ? '' : '/'}${contact.profile_photo}`;
    }
    return "/assets/images/users/user1.png";
  };

  const getCompanyLogo = (company) => {
    if (company.logo) {
      return `${BASE_URL}${company.logo.startsWith('/') ? '' : '/'}${company.logo}`;
    }
    return "/assets/images/users/user1.png";
  };

  const sections = [
    { id: 'all', label: 'All', icon: FiBarChart2, count: contacts.length + deals.length + leads.length + companies.length + activities.length },
    { id: 'contacts', label: 'Contacts', icon: FiUsers, count: contacts.length },
    { id: 'deals', label: 'Deals', icon: FiBriefcase, count: deals.length },
    { id: 'leads', label: 'Leads', icon: FiUserPlus, count: leads.length },
    { id: 'companies', label: 'Companies', icon: FaBuilding, count: companies.length },
    { id: 'activities', label: 'Activities', icon: FiCalendar, count: activities.length },
  ];

  const TableCard = ({ title, icon: Icon, data, loading, columns, renderRow, emptyMessage }) => (
    <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow overflow-hidden">
      <div className="px-3 sm:px-4 py-3 border-b border-gray-100 bg-gray-50/30">
        <h5 className="font-semibold text-midnight_text flex items-center gap-2 text-sm sm:text-base">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          {title}
        </h5>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8">
            <Icon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="text-left text-xs font-semibold text-gray-600 px-2 sm:px-3 py-2 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(renderRow)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <div className="">
      <div className="max-w-full mx-auto">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700">
            <FiAlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
            <span className="text-sm flex-1">{error}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiBarChart2 className="text-gray-600 text-xl sm:text-2xl" />
              Analytics
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Track and analyze your business performance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleExportPDF} className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all whitespace-nowrap">
              <FiDownload className="h-4 w-4" />
              Export PDF
            </button>
            <DatePicker selected={selectedDate} onChange={setSelectedDate} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary w-32 sm:w-auto" />
          </div>
        </div>

        {/* KPI Cards */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-500">Total Contacts</p><p className="text-xl font-bold text-midnight_text">{contacts.length}</p></div>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><FiUsers className="h-4 w-4 text-primary" /></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-500">Total Deals</p><p className="text-xl font-bold text-midnight_text">{deals.length}</p></div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><FiBriefcase className="h-4 w-4 text-emerald-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-500">Total Leads</p><p className="text-xl font-bold text-midnight_text">{leads.length}</p></div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><FiUserPlus className="h-4 w-4 text-amber-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-500">Total Companies</p><p className="text-xl font-bold text-midnight_text">{companies.length}</p></div>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><FaBuilding className="h-4 w-4 text-indigo-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-500">Total Activities</p><p className="text-xl font-bold text-midnight_text">{activities.length}</p></div>
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><FiCalendar className="h-4 w-4 text-purple-600" /></div>
            </div>
          </div>
        </div> */}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
            <h5 className="font-semibold text-midnight_text mb-4 flex items-center gap-2 text-sm sm:text-base"><FiTrendingUp className="h-5 w-5 text-primary" />Deals by Stage</h5>
            <div className="overflow-x-auto">
              <div className="min-w-[300px]">
                <Chart options={barOptions} series={barSeries} type="bar" height={325} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
            <h5 className="font-semibold text-midnight_text mb-4 flex items-center gap-2 text-sm sm:text-base"><FiPieChart className="h-5 w-5 text-primary" />Leads by Source</h5>
            <div className="overflow-x-auto">
              <div className="min-w-[300px]">
                <Chart options={chartData.options} series={chartData.series} type="donut" height={250} />
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-2 overflow-x-auto">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <section.icon className="h-4 w-4" />
              {section.label}
              <span className={`text-xs ${activeSection === section.id ? 'text-white/80' : 'text-gray-400'}`}>({section.count})</span>
            </button>
          ))}
        </div>

        {/* Data Tables */}
        <div className="space-y-6">
          {(activeSection === 'all' || activeSection === 'contacts') && (
            <TableCard
              title="Contacts"
              icon={FiUsers}
              data={contacts}
              loading={loading.contacts}
              columns={["Profile", "Name", "Email", "Phone", "Created", "Actions"]}
              renderRow={(c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-3 py-2"><img src={getContactImage(c)} className="w-8 h-8 rounded-full object-cover" alt="" /></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm font-medium text-midnight_text">{c.name} {c.last_name || ''}</span><br /><span className="text-xs text-gray-500">{c.role || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-600 break-all">{c.email || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-600 whitespace-nowrap">{c.phone || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(c.created_at || c.createdAt)}</span></td>
                  <td className="px-2 sm:px-3 py-2"><button onClick={() => handleDeleteClick("contact", c.id, `${c.name} ${c.last_name || ''}`)} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"><FiTrash2 className="h-4 w-4" /></button></td>
                </tr>
              )}
              emptyMessage="No contacts found"
            />
          )}

          {(activeSection === 'all' || activeSection === 'deals') && (
            <TableCard
              title="Deals"
              icon={FiBriefcase}
              data={deals}
              loading={loading.deals}
              columns={["Name", "Stage", "Value", "Owner", "Closed", "Actions"]}
              renderRow={(d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm font-medium text-midnight_text">{getDealName(d)}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary whitespace-nowrap">{d.status || d.stage || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm font-semibold text-emerald-600 whitespace-nowrap">${getDealValue(d).toLocaleString()}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-600">{getOwnerName(d)}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(d.closed_date || d.closedDate || d.due_date)}</span></td>
                  <td className="px-2 sm:px-3 py-2"><button onClick={() => handleDeleteClick("deal", d.id, getDealName(d))} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"><FiTrash2 className="h-4 w-4" /></button></td>
                </tr>
              )}
              emptyMessage="No deals found"
            />
          )}

          {(activeSection === 'all' || activeSection === 'leads') && (
            <TableCard
              title="Leads"
              icon={FiUserPlus}
              data={leads}
              loading={loading.leads}
              columns={["Name", "Company", "Stage", "Created", "Owner", "Actions"]}
              renderRow={(l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm font-medium text-midnight_text">{l.name || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-600">{getCompanyName(l)}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 whitespace-nowrap">{l.status || l.stage || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(l.created_at || l.createdDate)}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-600">{l.owner || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><button onClick={() => handleDeleteClick("lead", l.id, l.name || 'Lead')} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"><FiTrash2 className="h-4 w-4" /></button></td>
                </tr>
              )}
              emptyMessage="No leads found"
            />
          )}

          {(activeSection === 'all' || activeSection === 'companies') && (
            <TableCard
              title="Companies"
              icon={FaBuilding}
              data={companies}
              loading={loading.companies}
              columns={["Logo", "Name", "Email", "Phone", "Created", "Actions"]}
              renderRow={(c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-3 py-2"><img src={getCompanyLogo(c)} className="w-8 h-8 rounded-full object-cover" alt="" /></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm font-medium text-midnight_text">{c.name || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-600 break-all">{c.email || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-600 whitespace-nowrap">{c.phone || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(c.created_at || c.createdAt)}</span></td>
                  <td className="px-2 sm:px-3 py-2"><button onClick={() => handleDeleteClick("company", c.id, c.name || 'Company')} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"><FiTrash2 className="h-4 w-4" /></button></td>
                </tr>
              )}
              emptyMessage="No companies found"
            />
          )}

          {(activeSection === 'all' || activeSection === 'activities') && (
            <TableCard
              title="Activities"
              icon={FiCalendar}
              data={activities}
              loading={loading.activities}
              columns={["Title", "Type", "Due Date", "Owner", "Actions"]}
              renderRow={(a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm font-medium text-midnight_text">{a.title || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 whitespace-nowrap">{a.activity_type || a.type || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(a.due_date)}</span></td>
                  <td className="px-2 sm:px-3 py-2"><span className="text-sm text-gray-600">{a.owner || 'N/A'}</span></td>
                  <td className="px-2 sm:px-3 py-2"><button onClick={() => handleDeleteClick("activity", a.id, a.title || 'Activity')} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"><FiTrash2 className="h-4 w-4" /></button></td>
                </tr>
              )}
              emptyMessage="No activities found"
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setItemToDelete(null); }} title="Confirm Delete" size="md">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="h-8 w-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-midnight_text mb-2">Are you sure?</h3>
          <p className="text-sm text-gray-500">Do you want to delete <strong>{itemToDelete?.name || itemToDelete?.type}</strong>? This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={() => { setShowDeleteModal(false); setItemToDelete(null); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
          <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all">Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default Analytics;