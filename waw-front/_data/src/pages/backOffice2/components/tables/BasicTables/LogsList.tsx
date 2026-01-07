import React, { useState } from "react";

const dummyLogs = [
  {
    id: 1,
    action: "PUT http://102.211.209.131:3011/api/business/3/active",
    ip: "unknown",
    mail: "",
    date: "2025-07-18T10:33:13.985Z",
    content: { active: false },
  },
  {
    id: 2,
    action: "POST http://102.211.209.131:3011/api/logs",
    ip: "unknown",
    mail: "",
    date: "2025-07-18T10:33:13.985Z",
    content: {
      actionType: "AXIOS_REQUEST",
      actionName: "PUT http://102.211.209.131:3011/api/business/3/active",
      actionSend: '{"active":false}',
      actionIp: "unknown",
      actionMail: "",
      date: "2025-07-18T10:33:13.985Z",
    },
  },
];

export default function LogsList() {
  const [filters, setFilters] = useState({
    email: "",
    action: "",
    startDate: "",
    endDate: "",
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const filteredLogs = dummyLogs.filter((log) => {
    const logDate = new Date(log.date);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    return (
      (!filters.email || log.mail?.includes(filters.email)) &&
      (!filters.action ||
        log.action?.toLowerCase().includes(filters.action.toLowerCase())) &&
      (!start || logDate >= start) &&
      (!end || logDate <= end)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Journal des Actions</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          placeholder="Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <input
          placeholder="Action (GET, POST, PUT...)"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
        />
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nom Action</th>
              <th className="px-4 py-3 text-left">IP</th>
              <th className="px-4 py-3 text-left">Mail</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Contenu</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-t hover:bg-gray-50 align-top">
                <td className="px-4 py-2">{log.id}</td>
                <td className="px-4 py-2 font-mono text-xs text-blue-700">{log.action}</td>
                <td className="px-4 py-2">{log.ip}</td>
                <td className="px-4 py-2">{log.mail || "-"}</td>
                <td className="px-4 py-2 text-sm">{formatDate(log.date)}</td>
                <td className="px-4 py-2 whitespace-pre-wrap max-w-md font-mono text-xs text-gray-700">
                  {typeof log.content === "object"
                    ? JSON.stringify(log.content, null, 2)
                    : log.content}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
