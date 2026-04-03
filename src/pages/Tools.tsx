import { Routes, Route } from 'react-router-dom';
import { ToolList } from '@/components/tools/ToolList';
import { CSVUpload } from '@/components/tools/CSVUpload';
import { ToolDetailPage } from './ToolDetail';

export function Tools() {
  return (
    <Routes>
      <Route index element={<ToolList />} />
      <Route path="upload" element={<CSVUpload />} />
      <Route path=":id" element={<ToolDetailPage />} />
    </Routes>
  );
}
