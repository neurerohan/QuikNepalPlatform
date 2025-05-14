import { ReactNode } from 'react';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

interface Column {
  header: string;
  accessor: string;
  cell?: (value: any, row: any) => ReactNode;
  onClick?: () => void;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

const DataTable = ({ 
  columns, 
  data, 
  isLoading = false, 
  title, 
  subtitle,
  sortBy,
  sortDirection
}: DataTableProps) => {
  
  // Function to render sort indicators
  const renderSortIndicator = (columnAccessor: string) => {
    if (!sortBy || columnAccessor !== sortBy) {
      return <FaSort className="ml-1 text-gray-400 inline" />;
    }
    
    return sortDirection === 'asc' 
      ? <FaSortUp className="ml-1 text-primary inline" />
      : <FaSortDown className="ml-1 text-primary inline" />;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {(title || subtitle) && (
        <div className="bg-primary p-4">
          {title && <h3 className="text-xl font-semibold text-white">{title}</h3>}
          {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.onClick ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={column.onClick}
                >
                  <div className="flex items-center">
                  {column.header}
                    {column.onClick && renderSortIndicator(column.accessor)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              // Loading skeleton
              Array(5).fill(null).map((_, rowIndex) => (
                <tr key={`loading-${rowIndex}`}>
                  {columns.map((_, colIndex) => (
                    <td key={`loading-${rowIndex}-${colIndex}`} className="py-3 px-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`} className="py-3 px-4 whitespace-nowrap">
                      {column.cell ? column.cell(row[column.accessor], row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
