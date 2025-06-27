
export const validateData = (data: any[]): string[] => {
  const errors: string[] = [];
  
  data.forEach((row, index) => {
    // Skip completely empty rows (common in CSV files)
    const hasAnyData = Object.values(row).some(value => 
      value !== null && value !== undefined && String(value).trim() !== ''
    );
    
    if (!hasAnyData) {
      return; // Skip this row entirely
    }
    
    // Check for missing required fields only if row has some data
    if (!row.transactionId && !row.TransactionID) errors.push(`Row ${index + 1}: Missing transactionId`);
    if (!row.storeId && !row.StoreID) errors.push(`Row ${index + 1}: Missing storeId`);
    if (!row.productId && !row.ProductID) errors.push(`Row ${index + 1}: Missing productId`);
    if (!row.amount && !row.Amount) errors.push(`Row ${index + 1}: Missing amount`);
    
    const amount = row.amount || row.Amount;
    if (amount && (isNaN(Number(amount)) || Number(amount) < 0)) {
      errors.push(`Row ${index + 1}: Invalid amount`);
    }
    
    if (!row.timestamp && !row.Timestamp) errors.push(`Row ${index + 1}: Missing timestamp`);
  });

  return errors.slice(0, 10); // Show only first 10 errors
};
