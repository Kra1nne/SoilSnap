import Input from "../form/input/InputField";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table"
import Badge from "../ui/badge/Badge";
import { MoreDotIcon } from "../../icons";
import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        api.get('/api/logs')
            .then((res) => {
                setLogs((res.data || []).reverse());
            })
            .catch((error) => {
                console.error('Error fetching log data:', error);
            })
            .finally(() => setLoading(false));
    },[])
    const filtered = logs.filter((u) =>
        `${u.table} ${u.action} ${u.description} ${u.date} ${u.ipAddress} ${u.status}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    return (
        <section>
            <header className="mb-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <div className="block flex-1 min-w-0">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter here..."
                            className="h-10 sm:h-11 w-full rounded-lg px-3 sm:px-4 border border-gray-300 dark:border-gray-600 sm:max-w-none xl:w-[430px] dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-success-500 focus:border-transparent placeholder:text-gray-500 text-sm sm:text-base"
                        />
                    </div>
                </div>
            </header>
            {loading && <div className="p-5 text-center dark:text-white">Loading...</div>}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mb-15">
                <div className="min-w-full overflow-x-auto overflow-y-auto">
                    <div className="min-w-[900px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {['Table', 'Action', 'Description', 'Date', 'IP Address', 'Status'].map((h) => (
                                    <TableCell
                                        key={h}
                                        isHeader
                                        className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
                                    >
                                        {h}
                                    </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            { filtered.length > 0 ? (
                                filtered.map((log) => (
                                <TableRow key={log._id}>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        {log.table}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        {log.action}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        {log.description}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        {log.date
                                            ? new Date(log.date).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                              })
                                            : '—'}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        {log.ipAddress}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={log.status === 'success' ? 'success' : 'error'}
                                        >
                                            {log.status === 'success' ? 'Success' : 'Error'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                                ))
                            ): (
                                <TableRow>
                                    <td colSpan={7} className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                        No logs found.
                                    </td>
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </section>
    )
}