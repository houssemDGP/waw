import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LogsList() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    email: "",
    action: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("https://waw.com.tn/api/logs");
      setLogs(res.data);
    } catch (error) {
      console.error("Erreur de chargement des logs", error);
    }
  };

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

  const filteredLogs = logs.filter((log) => {
    const date = new Date(log.date);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    return (
      (!filters.email || log.actionMail?.includes(filters.email)) &&
      (!filters.action || log.actionName?.toLowerCase().includes(filters.action.toLowerCase())) &&
      (!start || date >= start) &&
      (!end || date <= end)
    );
  });

  // Inverser l'ordre des logs pour afficher les plus récents en premier
  const reversedLogs = [...filteredLogs].reverse();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Journal des Actions</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          placeholder="Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="Action (GET, POST, PUT...)"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="border px-2 py-1 rounded"
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
            {reversedLogs.map((log: any) => (
              <tr key={log.id} className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900">
                <td className="px-4 py-2">{log.id}</td>
                <td className="px-4 py-2 font-mono text-xs text-blue-700">{log.actionName || log.action}</td>
                <td className="px-4 py-2">{log.actionIp || log.ip}</td>
                <td className="px-4 py-2">{log.actionMail || log.mail || "-"}</td>
                <td className="px-4 py-2 text-sm">{formatDate(log.date)}</td>
                <td className="px-4 py-2 whitespace-pre-wrap max-w-md font-mono text-xs text-gray-700">
                  {typeof log.actionSend === "string"
                    ? log.actionSend
                    : JSON.stringify(log.content || log.actionSend, null, 2)}
                </td>
              </tr>
            ))}
            {reversedLogs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Aucun log trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}