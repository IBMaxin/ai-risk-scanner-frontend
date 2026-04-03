import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useUploadCSV } from '@/hooks/useTools';
import { cn } from '@/utils/cn';

const REQUIRED_COLS = ['name', 'vendor', 'department'];

type PreviewRow = Record<string, string>;

/**
 * Drag-and-drop CSV uploader with column validation, 10-row preview,
 * upload progress indicator, and results summary.
 */
export function CSVUpload() {
  const upload = useUploadCSV();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const parsePreview = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) { setValidationError('CSV has no data rows.'); return; }
    const hdrs = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const missing = REQUIRED_COLS.filter((c) => !hdrs.includes(c));
    if (missing.length) { setValidationError(`Missing columns: ${missing.join(', ')}`); return; }
    setValidationError(null);
    setHeaders(hdrs);
    const rows = lines.slice(1, 11).map((line) => {
      const vals = line.split(',');
      return Object.fromEntries(hdrs.map((h, i) => [h, vals[i]?.trim() ?? '']));
    });
    setPreview(rows);
  };

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setProgress(0);
    const reader = new FileReader();
    reader.onload = (e) => parsePreview(e.target?.result as string);
    reader.readAsText(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  const handleUpload = () => {
    if (!file || validationError) return;
    upload.mutate({ file, onProgress: setProgress });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'cursor-pointer rounded-card border-2 border-dashed p-10 text-center transition-colors',
          isDragActive
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400',
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-3 h-10 w-10 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isDragActive ? 'Drop the CSV here' : 'Drag & drop a CSV file, or click to browse'}
        </p>
        <p className="mt-1 text-xs text-gray-400">Required columns: name, vendor, department</p>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {validationError}
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && !validationError && (
        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-base">Preview (first {preview.length} rows)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {preview.map((row, i) => (
                    <tr key={i}>
                      {headers.map((h) => (
                        <td key={h} className="px-3 py-2 text-gray-600 dark:text-gray-400">{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      {upload.isPending && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Result */}
      {upload.isSuccess && (
        <div className="flex items-start gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-sm">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-700 dark:text-green-400">Import complete</p>
            <p className="text-green-600 dark:text-green-500">
              Ingested: {upload.data?.ingested} &nbsp;|&nbsp; Skipped: {upload.data?.skipped}
            </p>
            {upload.data?.errors.length ? (
              <ul className="mt-1 space-y-0.5 text-red-500">
                {upload.data.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            ) : null}
          </div>
        </div>
      )}

      {file && !validationError && (
        <Button onClick={handleUpload} loading={upload.isPending} disabled={!preview.length}>
          Import {file.name}
        </Button>
      )}
    </div>
  );
}
