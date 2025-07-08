
export const getPdfStyles = () => `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      padding: 20px;
      background: white;
      color: #1f2937;
      line-height: 1.5;
    }
    
    .print-hidden {
      display: none !important;
    }
    
    button {
      display: none !important;
    }
    
    /* Card styles matching the receipt */
    .max-w-2xl {
      max-width: 42rem;
    }
    
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    
    .border {
      border-width: 1px;
      border-color: #e5e7eb;
    }
    
    .shadow-sm {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    
    .rounded-lg {
      border-radius: 0.5rem;
    }
    
    .p-8 {
      padding: 2rem;
    }
    
    /* Header styles */
    .text-center {
      text-align: center;
    }
    
    .mb-8 {
      margin-bottom: 2rem;
    }
    
    .mb-6 {
      margin-bottom: 1.5rem;
    }
    
    .mb-2 {
      margin-bottom: 0.5rem;
    }
    
    .mb-3 {
      margin-bottom: 0.75rem;
    }
    
    .max-h-12 {
      max-height: 3rem;
    }
    
    .object-contain {
      object-fit: contain;
    }
    
    .text-xl {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
    
    .font-semibold {
      font-weight: 600;
    }
    
    .text-foreground {
      color: #1f2937;
    }
    
    .text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    
    .text-muted-foreground {
      color: #6b7280;
    }
    
    /* Status and value styles */
    .pb-6 {
      padding-bottom: 1.5rem;
    }
    
    .border-b {
      border-bottom-width: 1px;
      border-color: #e5e7eb;
    }
    
    .inline-block {
      display: inline-block;
    }
    
    .px-3 {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
    
    .py-1 {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
    
    .bg-green-50 {
      background-color: #f0fdf4;
    }
    
    .text-green-700 {
      color: #15803d;
    }
    
    .font-medium {
      font-weight: 500;
    }
    
    .rounded-full {
      border-radius: 9999px;
    }
    
    .text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    
    .font-bold {
      font-weight: 700;
    }
    
    .mt-1 {
      margin-top: 0.25rem;
    }
    
    /* Section styles */
    .space-y-6 > * + * {
      margin-top: 1.5rem;
    }
    
    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }
    
    .pt-4 {
      padding-top: 1rem;
    }
    
    .pt-2 {
      padding-top: 0.5rem;
    }
    
    .border-t {
      border-top-width: 1px;
      border-color: #e5e7eb;
    }
    
    .flex {
      display: flex;
    }
    
    .justify-between {
      justify-content: space-between;
    }
    
    .font-mono {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    
    .text-xs {
      font-size: 0.75rem;
      line-height: 1rem;
    }
    
    .block {
      display: block;
    }
    
    .text-green-600 {
      color: #16a34a;
    }
    
    .mt-8 {
      margin-top: 2rem;
    }
    
    .pt-6 {
      padding-top: 1.5rem;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .max-w-2xl {
        max-width: none;
      }
      
      .border {
        border: none;
      }
      
      .shadow-sm {
        box-shadow: none;
      }
      
      .rounded-lg {
        border-radius: 0;
      }
      
      .print-hidden {
        display: none !important;
      }
      
      button {
        display: none !important;
      }
      
      .bg-green-50 {
        background: #f0fdf4 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .text-green-700 {
        color: #15803d !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .text-green-600 {
        color: #16a34a !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
`;

export const getDownloadStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body { 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    margin: 20px; 
    background: white;
    color: #1f2937;
    line-height: 1.5;
  }
  
  .print-hidden { display: none !important; }
  button { display: none !important; }
  
  .max-w-2xl { max-width: 42rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .border { border: 1px solid #e5e7eb; border-radius: 0.5rem; }
  .p-8 { padding: 2rem; }
  .text-center { text-align: center; }
  .mb-8 { margin-bottom: 2rem; }
  .mb-6 { margin-bottom: 1.5rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .max-h-12 { max-height: 3rem; }
  .text-xl { font-size: 1.25rem; }
  .font-semibold { font-weight: 600; }
  .text-sm { font-size: 0.875rem; }
  .text-muted-foreground { color: #6b7280; }
  .pb-6 { padding-bottom: 1.5rem; }
  .border-b { border-bottom: 1px solid #e5e7eb; }
  .inline-block { display: inline-block; }
  .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
  .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
  .bg-green-50 { background-color: #f0fdf4; }
  .text-green-700 { color: #15803d; }
  .font-medium { font-weight: 500; }
  .rounded-full { border-radius: 9999px; }
  .text-3xl { font-size: 1.875rem; }
  .font-bold { font-weight: 700; }
  .mt-1 { margin-top: 0.25rem; }
  .space-y-6 > * + * { margin-top: 1.5rem; }
  .space-y-2 > * + * { margin-top: 0.5rem; }
  .pt-4 { padding-top: 1rem; }
  .pt-2 { padding-top: 0.5rem; }
  .border-t { border-top: 1px solid #e5e7eb; }
  .flex { display: flex; }
  .justify-between { justify-content: space-between; }
  .font-mono { font-family: monospace; }
  .text-xs { font-size: 0.75rem; }
  .block { display: block; }
  .text-green-600 { color: #16a34a; }
  .mt-8 { margin-top: 2rem; }
  .pt-6 { padding-top: 1.5rem; }
`;
