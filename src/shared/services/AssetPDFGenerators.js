import { jsPDF } from "jspdf";

const formatCurrency = (amount) => {
  if (!amount) return "₹0";
  const numericAmount = typeof amount === "string" ? parseInt(amount.replace(/[^0-9]/g, "")) : amount;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(numericAmount);
};

const drawTable = (doc, headers, data, startX, startY, options = {}) => {
  const { fontSize = 8, headerBackground = [41, 128, 185], rowHeight = 10 } = options;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const availableWidth = pageWidth - margin * 2;
  const colCount = headers.length;
  const colWidth = availableWidth / colCount;

  let currentY = startY;
  let currentX = margin;

  doc.setFontSize(fontSize);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(...headerBackground);
  doc.rect(currentX, currentY, availableWidth, rowHeight, "F");
  doc.setTextColor(255, 255, 255);

  headers.forEach((header, index) => {
    const x = currentX + colWidth * index + 2;
    const y = currentY + rowHeight / 2 + 2;
    const text = String(header).substring(0, 15);
    doc.text(text, x, y);
  });

  currentY += rowHeight;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  data.forEach((row, rowIndex) => {
    if (rowIndex % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(currentX, currentY, availableWidth, rowHeight, "F");
    }
    doc.setDrawColor(200, 200, 200);
    for (let i = 0; i <= colCount; i++) doc.line(currentX + colWidth * i, currentY, currentX + colWidth * i, currentY + rowHeight);
    doc.line(currentX, currentY, currentX + availableWidth, currentY);
    doc.line(currentX, currentY + rowHeight, currentX + availableWidth, currentY + rowHeight);

    headers.forEach((_, colIndex) => {
      const x = currentX + colWidth * colIndex + 2;
      const y = currentY + rowHeight / 2 + 2;
      let cellValue = row[colIndex];
      if (cellValue === undefined || cellValue === null) cellValue = "";
      doc.text(String(cellValue).substring(0, 20), x, y);
    });
    currentY += rowHeight;

    if (currentY > 280) {
      doc.addPage();
      currentY = margin;
      doc.setFillColor(...headerBackground);
      doc.rect(currentX, currentY, availableWidth, rowHeight, "F");
      doc.setTextColor(255, 255, 255);
      headers.forEach((header, index) => {
        doc.text(String(header).substring(0, 15), currentX + colWidth * index + 2, currentY + rowHeight / 2 + 2);
      });
      currentY += rowHeight;
      doc.setTextColor(0, 0, 0);
    }
  });
  return { finalY: currentY + 5 };
};

const drawFooter = (doc, pageWidth) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, { align: "center" });
    doc.text("Confidential - Asset Management System", pageWidth / 2, 290, { align: "center" });
  }
};

export const generateAssetInventoryPDF = (assetMaster) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.width;
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("ASSET INVENTORY REPORT", pageWidth / 2, 15, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, pageWidth / 2, 22, { align: "center" });

  let yPos = 35;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("SUMMARY STATISTICS", 20, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const allocatedCount = assetMaster.filter((a) => a.status === "Allocated").length;
  const availableCount = assetMaster.filter((a) => a.status === "Available").length;
  const underRepairCount = assetMaster.filter((a) => a.status === "Under Repair").length;
  const totalValue = assetMaster.reduce((sum, asset) => sum + parseInt(asset.currentValue.replace(/[^0-9]/g, "") || 0), 0);

  doc.text(`Total Assets: ${assetMaster.length}`, 20, yPos);
  doc.text(`Total Value: ${formatCurrency(totalValue)}`, 100, yPos);
  yPos += 6;
  doc.text(`Allocated: ${allocatedCount}`, 20, yPos);
  doc.text(`Available: ${availableCount}`, 100, yPos);
  yPos += 6;
  doc.text(`Under Repair: ${underRepairCount}`, 20, yPos);
  doc.text(`Utilization: ${assetMaster.length > 0 ? Math.round((allocatedCount / assetMaster.length) * 100) : 0}%`, 100, yPos);
  yPos += 15;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("ASSET DETAILS", 20, yPos);
  yPos += 8;

  const headers = ["Asset Tag", "Asset Name", "Category", "Status", "Value", "Location"];
  const tableData = assetMaster.map((asset) => [asset.assetTag, asset.assetName, asset.category, asset.status, asset.currentValue, asset.location]);
  const tableResult = drawTable(doc, headers, tableData, 20, yPos, { fontSize: 7, headerBackground: [41, 128, 185] });
  yPos = tableResult.finalY + 10;

  if (yPos > 250) { doc.addPage(); yPos = 20; }
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CATEGORY-WISE SUMMARY", 20, yPos);
  yPos += 8;

  const categories = [...new Set(assetMaster.map((a) => a.category))];
  const categoryData = categories.map((category) => {
    const categoryAssets = assetMaster.filter((a) => a.category === category);
    const categoryValue = categoryAssets.reduce((sum, asset) => sum + parseInt(asset.currentValue.replace(/[^0-9]/g, "") || 0), 0);
    return [category, categoryAssets.length, formatCurrency(categoryValue)];
  });

  drawTable(doc, ["Category", "Count", "Total Value"], categoryData, 20, yPos, { headerBackground: [39, 174, 96] });
  drawFooter(doc, pageWidth);
  doc.save(`asset-inventory-report-${new Date().toISOString().split("T")[0]}.pdf`);
};

export const generateEmployeeWisePDF = (assetAllocations) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.width;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("EMPLOYEE ASSET ALLOCATION REPORT", pageWidth / 2, 15, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, pageWidth / 2, 22, { align: "center" });

  let yPos = 30;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("ALLOCATION SUMMARY", 20, yPos);
  yPos += 8;

  const activeAllocations = assetAllocations.filter((a) => a.status === "Active");
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Active Allocations: ${activeAllocations.length}`, 20, yPos);
  doc.text(`Employees: ${[...new Set(activeAllocations.map((a) => a.employeeName))].length}`, 100, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("ASSET ALLOCATIONS", 20, yPos);
  yPos += 8;

  const headers = ["Allocation ID", "Asset", "Employee", "Department", "Date"];
  const tableData = activeAllocations.map((a) => [a.allocationId, a.assetName, a.employeeName, a.department, a.allocationDate]);
  drawTable(doc, headers, tableData, 20, yPos, { fontSize: 7, headerBackground: [41, 128, 185] });
  drawFooter(doc, pageWidth);
  doc.save(`employee-asset-report-${new Date().toISOString().split("T")[0]}.pdf`);
};

export const generateReturnsPDF = (assetReturns) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.width;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ASSET RETURNS REPORT", pageWidth / 2, 15, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, pageWidth / 2, 22, { align: "center" });

  let yPos = 30;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("RETURNS SUMMARY", 20, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Returns: ${assetReturns.length}`, 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("ASSET RETURNS", 20, yPos);
  yPos += 8;

  const headers = ["Return ID", "Asset", "Employee", "Return Date", "Reason", "Condition"];
  const tableData = assetReturns.map((r) => [r.returnId, r.assetName, r.employeeName, r.returnDate, r.returnReason, r.conditionAtReturn]);
  drawTable(doc, headers, tableData, 20, yPos, { fontSize: 7, headerBackground: [39, 174, 96] });
  drawFooter(doc, pageWidth);
  doc.save(`returns-report-${new Date().toISOString().split("T")[0]}.pdf`);
};
