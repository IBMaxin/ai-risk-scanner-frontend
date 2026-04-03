import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, RefreshCw, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { ToolForm } from './ToolForm';
import { useTools, useCreateTool, useDeleteTool, useRescanTool } from '@/hooks/useTools';
import { formatDate } from '@/utils/formatters';
import type { Severity } from '@/types/scan';
import type { ToolFormData } from '@/utils/validators';

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];
const APPROVAL_OPTS = [{ value: '', label: 'All' }, { value: 'true', label: 'Approved' }, { value: 'false', label: 'Unapproved' }];

/** Full tool management table with search, filters, and bulk actions. */
export function ToolList() {
  const navigate = useNavigate();
  const { data, isLoading } = useTools();
  const createTool = useCreateTool();
  const deleteTool = useDeleteTool();
  const rescan = useRescanTool();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const departments = useMemo(
    () => ['', ...new Set(data?.items.map((t) => t.department) ?? [])],
    [data],
  );

  const filtered = useMemo(() => {
    return (data?.items ?? []).filter((t) => {
      const matchSearch = search === '' || t.name.toLowerCase().includes(search.toLowerCase()) || t.vendor.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === '' || t.department === deptFilter;
      const matchApproval = approvalFilter === '' || String(t.approved) === approvalFilter;
      return matchSearch && matchDept && matchApproval;
    });
  }, [data, search, deptFilter, approvalFilter]);

  const toggleSelect = (id: number) =>
    setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const handleAdd = (formData: ToolFormData) => {
    createTool.mutate(formData, { onSuccess: () => setAddOpen(false) });
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteTool.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="w-full rounded-btn border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-btn border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          {departments.map((d) => <option key={d} value={d}>{d || 'All Departments'}</option>)}
        </select>
        <select
          className="rounded-btn border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
          value={approvalFilter}
          onChange={(e) => setApprovalFilter(e.target.value)}
        >
          {APPROVAL_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="flex gap-2 ml-auto">
          {selected.size > 0 && (
            <Button variant="danger" size="sm" onClick={() => selected.forEach((id) => deleteTool.mutate(id))}>
              <Trash2 className="h-4 w-4" /> Delete ({selected.size})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate('/tools/upload')}>
            <Upload className="h-4 w-4" /> CSV Upload
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add Tool
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input type="checkbox" className="rounded"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={(e) => setSelected(e.target.checked ? new Set(filtered.map((t) => t.id)) : new Set())}
                  />
                </th>
                {['Name', 'Vendor', 'Department', 'Users', 'Approved', 'Created', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {filtered.map((tool) => (
                <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded"
                      checked={selected.has(tool.id)}
                      onChange={() => toggleSelect(tool.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="font-medium text-primary-600 dark:text-primary-400 hover:underline text-left"
                      onClick={() => navigate(`/tools/${tool.id}`)}
                    >
                      {tool.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{tool.vendor}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{tool.department}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{tool.user_count}</td>
                  <td className="px-4 py-3">
                    <Badge variant={tool.approved ? 'approved' : 'default'}>
                      {tool.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(tool.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon"
                        onClick={() => rescan.mutate(tool.id)}
                        loading={rescan.isPending}
                        aria-label="Rescan"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon"
                        onClick={() => setDeleteId(tool.id)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-gray-400">No tools found.</p>
          )}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Register AI Tool" description="Add a new tool to the risk scanner.">
        <ToolForm onSubmit={handleAdd} loading={createTool.isPending} />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Tool" description="This will permanently remove the tool and all its scan history.">
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleteTool.isPending}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
