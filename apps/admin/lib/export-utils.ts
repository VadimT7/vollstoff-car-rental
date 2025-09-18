export interface ExportColumn {
  key: string
  label: string
  format?: (value: any) => string
}

export function exportToCSV(data: any[], columns: ExportColumn[], filename: string) {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  // Create CSV headers
  const headers = columns.map((col: any) => col.label).join(',')
  
  // Create CSV rows
  const rows = data.map((item: any) => 
    columns.map((col: any) => {
      let value = getNestedValue(item, col.key)
      
      // Apply formatting if provided
      if (col.format && value !== null && value !== undefined) {
        value = col.format(value)
      }
      
      // Handle null/undefined values
      if (value === null || value === undefined) {
        value = ''
      }
      
      // Escape commas and quotes in CSV
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      
      return stringValue
    }).join(',')
  )
  
  // Combine headers and rows
  const csvContent = [headers, ...rows].join('\n')
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function exportToJSON(data: any[], filename: string) {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Helper function to get nested object values using dot notation
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current: any, key: string) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}

// Format functions for common data types
export const formatters = {
  currency: (value: number) => `$${value.toLocaleString()}`,
  date: (value: string | Date) => new Date(value).toLocaleDateString(),
  datetime: (value: string | Date) => new Date(value).toLocaleString(),
  boolean: (value: boolean) => value ? 'Yes' : 'No',
  array: (value: any[]) => Array.isArray(value) ? value.join(', ') : '',
  percentage: (value: number) => `${value}%`,
  status: (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}
