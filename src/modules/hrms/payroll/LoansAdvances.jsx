import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const LoansAdvances = () => {
  // Enhanced loan data structure with all required fields
  const [loans, setLoans] = useState([
    {
      id: 1,
      loanId: "LN001",
      employeeId: "EMP001",
      employeeName: "Sarah Johnson",
      department: "Engineering",
      designation: "Senior Developer",
      loanType: "Personal loan",
      amount: 150000,
      interestRate: 8.5,
      tenureMonths: 24,
      startDate: "2024-01-15",
      endDate: "2026-01-15",
      monthlyEMI: 6784.5,
      amountPaid: 67845.0,
      amountPending: 82155.0,
      status: "Active",
      nextDueDate: "2024-11-15",
      applicationDate: "2023-12-20",
      applicationStatus: "approved",
      approvalWorkflow: [
        {
          level: "supervisor",
          status: "approved",
          date: "2023-12-21",
          approvedBy: "John Manager",
        },
        {
          level: "hr",
          status: "approved",
          date: "2023-12-22",
          approvedBy: "HR Head",
        },
        {
          level: "finance",
          status: "approved",
          date: "2023-12-23",
          approvedBy: "Finance Manager",
        },
      ],
      eligibilityChecks: {
        serviceTenure: {
          required: "6 months",
          actual: "2 years",
          status: "pass",
        },
        salaryRatio: { required: "3x", actual: "2.5x", status: "pass" },
        existingLoans: { count: 0, status: "pass" },
      },
      documents: {
        applicationForm: { uploaded: true, verified: true },
        identityProof: { uploaded: true, verified: true },
        salarySlips: { uploaded: true, verified: true },
        agreement: { generated: true, signed: true },
        certificate: { generated: false },
      },
      disbursement: {
        status: "completed",
        method: "bank_transfer",
        bankDetails: { accountNumber: "XXXXXX1234", bankName: "HDFC Bank" },
        disbursementDate: "2024-01-16",
        disbursementAmount: 150000,
        transactionId: "TXN123456",
      },
      paymentMethod: "payroll_deduction",
      autoDeduction: {
        enabled: true,
        deductionDate: 5,
        accountDetails: { accountNumber: "XXXXXX1234", bankName: "HDFC Bank" },
      },
      emiSchedule: [
        {
          month: 1,
          dueDate: "2024-02-15",
          amount: 6784.5,
          status: "paid",
          paymentDate: "2024-02-14",
        },
        {
          month: 2,
          dueDate: "2024-03-15",
          amount: 6784.5,
          status: "paid",
          paymentDate: "2024-03-14",
        },
        {
          month: 3,
          dueDate: "2024-04-15",
          amount: 6784.5,
          status: "paid",
          paymentDate: "2024-04-14",
        },
        {
          month: 4,
          dueDate: "2024-05-15",
          amount: 6784.5,
          status: "paid",
          paymentDate: "2024-05-14",
        },
        {
          month: 5,
          dueDate: "2024-06-15",
          amount: 6784.5,
          status: "paid",
          paymentDate: "2024-06-14",
        },
        {
          month: 6,
          dueDate: "2024-07-15",
          amount: 6784.5,
          status: "paid",
          paymentDate: "2024-07-14",
        },
        {
          month: 7,
          dueDate: "2024-08-15",
          amount: 6784.5,
          status: "paid",
          paymentDate: "2024-08-14",
        },
        {
          month: 8,
          dueDate: "2024-09-15",
          amount: 6784.5,
          status: "paid",
          paymentDate: "2024-09-14",
        },
        {
          month: 9,
          dueDate: "2024-10-15",
          amount: 6784.5,
          status: "paid",
          paymentDate: "2024-10-14",
        },
        { month: 10, dueDate: "2024-11-15", amount: 6784.5, status: "due" },
      ],
      prepaymentRules: {
        allowed: true,
        minimumAmount: 10000,
        charges: "2% of prepayment amount",
      },
      foreclosureOptions: {
        allowedAfter: 12,
        charges: "3% of outstanding",
      },
      missedPayments: 0,
      overdueAmount: 0,
      completionStatus: "active",
      certificateNumber: null,
    },
    {
      id: 2,
      loanId: "LN002",
      employeeId: "EMP002",
      employeeName: "Mike Chen",
      department: "Sales",
      designation: "Sales Manager",
      loanType: "Vehicle loan",
      amount: 250000,
      interestRate: 7.2,
      tenureMonths: 36,
      startDate: "2023-11-10",
      endDate: "2026-11-10",
      monthlyEMI: 7738.8,
      amountPaid: 85126.8,
      amountPending: 164873.2,
      status: "Active",
      nextDueDate: "2024-11-10",
      applicationDate: "2023-10-25",
      applicationStatus: "approved",
      approvalWorkflow: [
        {
          level: "supervisor",
          status: "approved",
          date: "2023-10-27",
          approvedBy: "Sales Director",
        },
        {
          level: "hr",
          status: "approved",
          date: "2023-10-28",
          approvedBy: "HR Manager",
        },
        {
          level: "finance",
          status: "approved",
          date: "2023-10-30",
          approvedBy: "CFO",
        },
      ],
      eligibilityChecks: {
        serviceTenure: {
          required: "1 year",
          actual: "3 years",
          status: "pass",
        },
        salaryRatio: { required: "5x", actual: "4.2x", status: "pass" },
        existingLoans: { count: 1, status: "pass" },
      },
      documents: {
        applicationForm: { uploaded: true, verified: true },
        identityProof: { uploaded: true, verified: true },
        salarySlips: { uploaded: true, verified: true },
        agreement: { generated: true, signed: true },
        certificate: { generated: false },
      },
      disbursement: {
        status: "completed",
        method: "bank_transfer",
        bankDetails: { accountNumber: "XXXXXX5678", bankName: "ICICI Bank" },
        disbursementDate: "2023-11-11",
        disbursementAmount: 250000,
        transactionId: "TXN789012",
      },
      paymentMethod: "payroll_deduction",
      autoDeduction: {
        enabled: true,
        deductionDate: 7,
        accountDetails: { accountNumber: "XXXXXX5678", bankName: "ICICI Bank" },
      },
      emiSchedule: [
        {
          month: 1,
          dueDate: "2023-12-10",
          amount: 7738.8,
          status: "paid",
          paymentDate: "2023-12-09",
        },
        {
          month: 2,
          dueDate: "2024-01-10",
          amount: 7738.8,
          status: "paid",
          paymentDate: "2024-01-09",
        },
        {
          month: 3,
          dueDate: "2024-02-10",
          amount: 7738.8,
          status: "paid",
          paymentDate: "2024-02-09",
        },
        {
          month: 4,
          dueDate: "2024-03-10",
          amount: 7738.8,
          status: "paid",
          paymentDate: "2024-03-09",
        },
        {
          month: 5,
          dueDate: "2024-04-10",
          amount: 7738.8,
          status: "paid",
          paymentDate: "2024-04-09",
        },
        {
          month: 6,
          dueDate: "2024-05-10",
          amount: 7738.8,
          status: "paid",
          paymentDate: "2024-05-09",
        },
        {
          month: 7,
          dueDate: "2024-06-10",
          amount: 7738.8,
          status: "paid",
          paymentDate: "2024-06-09",
        },
        {
          month: 8,
          dueDate: "2024-07-10",
          amount: 7738.8,
          status: "paid",
          paymentDate: "2024-07-09",
        },
        {
          month: 9,
          dueDate: "2024-08-10",
          amount: 7738.8,
          status: "paid",
          paymentDate: "2024-08-09",
        },
        {
          month: 10,
          dueDate: "2024-09-10",
          amount: 7738.8,
          status: "paid",
          paymentDate: "2024-09-09",
        },
        {
          month: 11,
          dueDate: "2024-10-10",
          amount: 7738.8,
          status: "paid",
          paymentDate: "2024-10-09",
        },
        { month: 12, dueDate: "2024-11-10", amount: 7738.8, status: "due" },
      ],
      prepaymentRules: {
        allowed: true,
        minimumAmount: 20000,
        charges: "1.5% of prepayment amount",
      },
      foreclosureOptions: {
        allowedAfter: 18,
        charges: "2% of outstanding",
      },
      missedPayments: 0,
      overdueAmount: 0,
      completionStatus: "active",
      certificateNumber: null,
    },
    {
      id: 3,
      loanId: "LN003",
      employeeId: "EMP003",
      employeeName: "Alex Rivera",
      department: "Marketing",
      designation: "Marketing Specialist",
      loanType: "Educational loan",
      amount: 120000,
      interestRate: 6.5,
      tenureMonths: 18,
      startDate: "2024-03-01",
      endDate: "2025-09-01",
      monthlyEMI: 6992.7,
      amountPaid: 41956.2,
      amountPending: 78043.8,
      status: "Active",
      nextDueDate: "2024-11-01",
      applicationDate: "2024-02-15",
      applicationStatus: "approved",
      approvalWorkflow: [
        {
          level: "supervisor",
          status: "approved",
          date: "2024-02-16",
          approvedBy: "Marketing Head",
        },
        {
          level: "hr",
          status: "approved",
          date: "2024-02-17",
          approvedBy: "HR Executive",
        },
        {
          level: "finance",
          status: "approved",
          date: "2024-02-18",
          approvedBy: "Finance Officer",
        },
      ],
      eligibilityChecks: {
        serviceTenure: {
          required: "6 months",
          actual: "1 year",
          status: "pass",
        },
        salaryRatio: { required: "2x", actual: "1.8x", status: "pass" },
        existingLoans: { count: 0, status: "pass" },
      },
      documents: {
        applicationForm: { uploaded: true, verified: true },
        identityProof: { uploaded: true, verified: true },
        salarySlips: { uploaded: true, verified: true },
        agreement: { generated: true, signed: true },
        certificate: { generated: false },
      },
      disbursement: {
        status: "completed",
        method: "bank_transfer",
        bankDetails: { accountNumber: "XXXXXX9012", bankName: "Axis Bank" },
        disbursementDate: "2024-03-02",
        disbursementAmount: 120000,
        transactionId: "TXN345678",
      },
      paymentMethod: "payroll_deduction",
      autoDeduction: {
        enabled: true,
        deductionDate: 10,
        accountDetails: { accountNumber: "XXXXXX9012", bankName: "Axis Bank" },
      },
      emiSchedule: [
        {
          month: 1,
          dueDate: "2024-04-01",
          amount: 6992.7,
          status: "paid",
          paymentDate: "2024-03-31",
        },
        {
          month: 2,
          dueDate: "2024-05-01",
          amount: 6992.7,
          status: "paid",
          paymentDate: "2024-04-30",
        },
        {
          month: 3,
          dueDate: "2024-06-01",
          amount: 6992.7,
          status: "paid",
          paymentDate: "2024-05-31",
        },
        {
          month: 4,
          dueDate: "2024-07-01",
          amount: 6992.7,
          status: "paid",
          paymentDate: "2024-06-30",
        },
        {
          month: 5,
          dueDate: "2024-08-01",
          amount: 6992.7,
          status: "paid",
          paymentDate: "2024-07-31",
        },
        {
          month: 6,
          dueDate: "2024-09-01",
          amount: 6992.7,
          status: "paid",
          paymentDate: "2024-08-31",
        },
        {
          month: 7,
          dueDate: "2024-10-01",
          amount: 6992.7,
          status: "paid",
          paymentDate: "2024-09-30",
        },
        { month: 8, dueDate: "2024-11-01", amount: 6992.7, status: "due" },
      ],
      prepaymentRules: {
        allowed: true,
        minimumAmount: 5000,
        charges: "1% of prepayment amount",
      },
      foreclosureOptions: {
        allowedAfter: 6,
        charges: "1% of outstanding",
      },
      missedPayments: 0,
      overdueAmount: 0,
      completionStatus: "active",
      certificateNumber: null,
    },
    {
      id: 4,
      loanId: "LN004",
      employeeId: "EMP004",
      employeeName: "Emily Davis",
      department: "HR",
      designation: "HR Executive",
      loanType: "Festival advance",
      amount: 50000,
      interestRate: 0,
      tenureMonths: 12,
      startDate: "2024-09-01",
      endDate: "2025-09-01",
      monthlyEMI: 4166.67,
      amountPaid: 8333.34,
      amountPending: 41666.66,
      status: "Active",
      nextDueDate: "2024-11-01",
      applicationDate: "2024-08-25",
      applicationStatus: "approved",
      approvalWorkflow: [
        {
          level: "supervisor",
          status: "approved",
          date: "2024-08-26",
          approvedBy: "HR Manager",
        },
        {
          level: "finance",
          status: "approved",
          date: "2024-08-27",
          approvedBy: "Finance Executive",
        },
      ],
      eligibilityChecks: {
        serviceTenure: {
          required: "3 months",
          actual: "2 years",
          status: "pass",
        },
        salaryRatio: { required: "1x", actual: "0.8x", status: "pass" },
        existingLoans: { count: 0, status: "pass" },
      },
      documents: {
        applicationForm: { uploaded: true, verified: true },
        identityProof: { uploaded: true, verified: true },
        salarySlips: { uploaded: true, verified: true },
        agreement: { generated: true, signed: true },
        certificate: { generated: false },
      },
      disbursement: {
        status: "completed",
        method: "bank_transfer",
        bankDetails: { accountNumber: "XXXXXX3456", bankName: "SBI" },
        disbursementDate: "2024-09-02",
        disbursementAmount: 50000,
        transactionId: "TXN901234",
      },
      paymentMethod: "payroll_deduction",
      autoDeduction: {
        enabled: true,
        deductionDate: 1,
        accountDetails: { accountNumber: "XXXXXX3456", bankName: "SBI" },
      },
      emiSchedule: [
        {
          month: 1,
          dueDate: "2024-10-01",
          amount: 4166.67,
          status: "paid",
          paymentDate: "2024-09-30",
        },
        { month: 2, dueDate: "2024-11-01", amount: 4166.67, status: "due" },
      ],
      prepaymentRules: {
        allowed: true,
        minimumAmount: 5000,
        charges: "0% of prepayment amount",
      },
      foreclosureOptions: {
        allowedAfter: 3,
        charges: "0% of outstanding",
      },
      missedPayments: 0,
      overdueAmount: 0,
      completionStatus: "active",
      certificateNumber: null,
    },
    {
      id: 5,
      loanId: "LN005",
      employeeId: "EMP005",
      employeeName: "David Wilson",
      department: "Finance",
      designation: "Financial Analyst",
      loanType: "Emergency loan",
      amount: 80000,
      interestRate: 5.0,
      tenureMonths: 12,
      startDate: "2024-06-15",
      endDate: "2025-06-15",
      monthlyEMI: 6844.7,
      amountPaid: 27378.8,
      amountPending: 52621.2,
      status: "Active",
      nextDueDate: "2024-11-15",
      applicationDate: "2024-06-10",
      applicationStatus: "approved",
      approvalWorkflow: [
        {
          level: "supervisor",
          status: "approved",
          date: "2024-06-11",
          approvedBy: "Finance Manager",
        },
        {
          level: "hr",
          status: "approved",
          date: "2024-06-12",
          approvedBy: "HR Head",
        },
        {
          level: "finance",
          status: "approved",
          date: "2024-06-13",
          approvedBy: "CFO",
        },
      ],
      eligibilityChecks: {
        serviceTenure: {
          required: "1 month",
          actual: "3 years",
          status: "pass",
        },
        salaryRatio: { required: "2x", actual: "1.5x", status: "pass" },
        existingLoans: { count: 1, status: "pass" },
      },
      documents: {
        applicationForm: { uploaded: true, verified: true },
        identityProof: { uploaded: true, verified: true },
        salarySlips: { uploaded: true, verified: true },
        agreement: { generated: true, signed: true },
        certificate: { generated: false },
      },
      disbursement: {
        status: "completed",
        method: "bank_transfer",
        bankDetails: {
          accountNumber: "XXXXXX7890",
          bankName: "Kotak Mahindra",
        },
        disbursementDate: "2024-06-16",
        disbursementAmount: 80000,
        transactionId: "TXN567890",
      },
      paymentMethod: "payroll_deduction",
      autoDeduction: {
        enabled: true,
        deductionDate: 15,
        accountDetails: {
          accountNumber: "XXXXXX7890",
          bankName: "Kotak Mahindra",
        },
      },
      emiSchedule: [
        {
          month: 1,
          dueDate: "2024-07-15",
          amount: 6844.7,
          status: "paid",
          paymentDate: "2024-07-14",
        },
        {
          month: 2,
          dueDate: "2024-08-15",
          amount: 6844.7,
          status: "paid",
          paymentDate: "2024-08-14",
        },
        {
          month: 3,
          dueDate: "2024-09-15",
          amount: 6844.7,
          status: "paid",
          paymentDate: "2024-09-14",
        },
        {
          month: 4,
          dueDate: "2024-10-15",
          amount: 6844.7,
          status: "paid",
          paymentDate: "2024-10-14",
        },
        { month: 5, dueDate: "2024-11-15", amount: 6844.7, status: "due" },
      ],
      prepaymentRules: {
        allowed: true,
        minimumAmount: 5000,
        charges: "0.5% of prepayment amount",
      },
      foreclosureOptions: {
        allowedAfter: 3,
        charges: "1% of outstanding",
      },
      missedPayments: 0,
      overdueAmount: 0,
      completionStatus: "active",
      certificateNumber: null,
    },
    {
      id: 6,
      loanId: "LN006",
      employeeId: "EMP006",
      employeeName: "Lisa Anderson",
      department: "Operations",
      designation: "Operations Manager",
      loanType: "Salary advance",
      amount: 30000,
      interestRate: 0,
      tenureMonths: 3,
      startDate: "2024-10-01",
      endDate: "2025-01-01",
      monthlyEMI: 10000.0,
      amountPaid: 10000.0,
      amountPending: 20000.0,
      status: "Active",
      nextDueDate: "2024-11-01",
      applicationDate: "2024-09-28",
      applicationStatus: "approved",
      approvalWorkflow: [
        {
          level: "supervisor",
          status: "approved",
          date: "2024-09-29",
          approvedBy: "Operations Head",
        },
        {
          level: "hr",
          status: "approved",
          date: "2024-09-30",
          approvedBy: "HR Executive",
        },
      ],
      eligibilityChecks: {
        serviceTenure: {
          required: "Probation completed",
          actual: "Completed",
          status: "pass",
        },
        salaryRatio: {
          required: "50% of next salary",
          actual: "40%",
          status: "pass",
        },
        existingLoans: { count: 0, status: "pass" },
      },
      documents: {
        applicationForm: { uploaded: true, verified: true },
        identityProof: { uploaded: true, verified: true },
        salarySlips: { uploaded: true, verified: true },
        agreement: { generated: true, signed: true },
        certificate: { generated: false },
      },
      disbursement: {
        status: "completed",
        method: "bank_transfer",
        bankDetails: { accountNumber: "XXXXXX2345", bankName: "PNB" },
        disbursementDate: "2024-10-02",
        disbursementAmount: 30000,
        transactionId: "TXN123789",
      },
      paymentMethod: "payroll_deduction",
      autoDeduction: {
        enabled: true,
        deductionDate: 1,
        accountDetails: { accountNumber: "XXXXXX2345", bankName: "PNB" },
      },
      emiSchedule: [
        { month: 1, dueDate: "2024-11-01", amount: 10000.0, status: "due" },
        { month: 2, dueDate: "2024-12-01", amount: 10000.0, status: "pending" },
        { month: 3, dueDate: "2025-01-01", amount: 10000.0, status: "pending" },
      ],
      prepaymentRules: {
        allowed: false,
        minimumAmount: 0,
        charges: "N/A",
      },
      foreclosureOptions: {
        allowedAfter: 0,
        charges: "N/A",
      },
      missedPayments: 0,
      overdueAmount: 0,
      completionStatus: "active",
      certificateNumber: null,
    },
    {
      id: 7,
      loanId: "LN007",
      employeeId: "EMP007",
      employeeName: "Robert Brown",
      department: "IT",
      designation: "System Administrator",
      loanType: "Personal loan",
      amount: 200000,
      interestRate: 9.0,
      tenureMonths: 24,
      startDate: "2023-05-20",
      endDate: "2025-05-20",
      monthlyEMI: 9137.0,
      amountPaid: 164466.0,
      amountPending: 35534.0,
      status: "Active",
      nextDueDate: "2024-11-20",
      applicationDate: "2023-05-10",
      applicationStatus: "approved",
      approvalWorkflow: [
        {
          level: "supervisor",
          status: "approved",
          date: "2023-05-12",
          approvedBy: "IT Manager",
        },
        {
          level: "hr",
          status: "approved",
          date: "2023-05-13",
          approvedBy: "HR Manager",
        },
        {
          level: "finance",
          status: "approved",
          date: "2023-05-15",
          approvedBy: "Finance Controller",
        },
      ],
      eligibilityChecks: {
        serviceTenure: {
          required: "6 months",
          actual: "4 years",
          status: "pass",
        },
        salaryRatio: { required: "3x", actual: "2.8x", status: "pass" },
        existingLoans: { count: 0, status: "pass" },
      },
      documents: {
        applicationForm: { uploaded: true, verified: true },
        identityProof: { uploaded: true, verified: true },
        salarySlips: { uploaded: true, verified: true },
        agreement: { generated: true, signed: true },
        certificate: { generated: false },
      },
      disbursement: {
        status: "completed",
        method: "cheque",
        bankDetails: { accountNumber: "XXXXXX6789", bankName: "Canara Bank" },
        disbursementDate: "2023-05-21",
        disbursementAmount: 200000,
        transactionId: "TXN456123",
      },
      paymentMethod: "payroll_deduction",
      autoDeduction: {
        enabled: true,
        deductionDate: 20,
        accountDetails: {
          accountNumber: "XXXXXX6789",
          bankName: "Canara Bank",
        },
      },
      emiSchedule: [
        {
          month: 1,
          dueDate: "2023-06-20",
          amount: 9137.0,
          status: "paid",
          paymentDate: "2023-06-19",
        },
        {
          month: 2,
          dueDate: "2023-07-20",
          amount: 9137.0,
          status: "paid",
          paymentDate: "2023-07-19",
        },
        // ... (18 months of paid entries)
        { month: 19, dueDate: "2024-11-20", amount: 9137.0, status: "due" },
      ],
      prepaymentRules: {
        allowed: true,
        minimumAmount: 15000,
        charges: "2% of prepayment amount",
      },
      foreclosureOptions: {
        allowedAfter: 12,
        charges: "2.5% of outstanding",
      },
      missedPayments: 0,
      overdueAmount: 0,
      completionStatus: "active",
      certificateNumber: null,
    },
    {
      id: 8,
      loanId: "LN008",
      employeeId: "EMP008",
      employeeName: "Jennifer Lee",
      department: "Customer Support",
      designation: "Support Lead",
      loanType: "Vehicle loan",
      amount: 180000,
      interestRate: 7.5,
      tenureMonths: 30,
      startDate: "2024-02-10",
      endDate: "2026-08-10",
      monthlyEMI: 6276.3,
      amountPaid: 56486.7,
      amountPending: 123513.3,
      status: "Completed",
      nextDueDate: "N/A",
      applicationDate: "2024-01-28",
      applicationStatus: "approved",
      approvalWorkflow: [
        {
          level: "supervisor",
          status: "approved",
          date: "2024-01-29",
          approvedBy: "Support Manager",
        },
        {
          level: "hr",
          status: "approved",
          date: "2024-01-30",
          approvedBy: "HR Executive",
        },
        {
          level: "finance",
          status: "approved",
          date: "2024-01-31",
          approvedBy: "Finance Officer",
        },
      ],
      eligibilityChecks: {
        serviceTenure: {
          required: "1 year",
          actual: "2 years",
          status: "pass",
        },
        salaryRatio: { required: "5x", actual: "4x", status: "pass" },
        existingLoans: { count: 1, status: "pass" },
      },
      documents: {
        applicationForm: { uploaded: true, verified: true },
        identityProof: { uploaded: true, verified: true },
        salarySlips: { uploaded: true, verified: true },
        agreement: { generated: true, signed: true },
        certificate: { generated: true, certificateNumber: "CERT20241101" },
      },
      disbursement: {
        status: "completed",
        method: "bank_transfer",
        bankDetails: { accountNumber: "XXXXXX1122", bankName: "Yes Bank" },
        disbursementDate: "2024-02-11",
        disbursementAmount: 180000,
        transactionId: "TXN789456",
      },
      paymentMethod: "payroll_deduction",
      autoDeduction: {
        enabled: true,
        deductionDate: 10,
        accountDetails: { accountNumber: "XXXXXX1122", bankName: "Yes Bank" },
      },
      emiSchedule: [
        {
          month: 1,
          dueDate: "2024-03-10",
          amount: 6276.3,
          status: "paid",
          paymentDate: "2024-03-09",
        },
        {
          month: 2,
          dueDate: "2024-04-10",
          amount: 6276.3,
          status: "paid",
          paymentDate: "2024-04-09",
        },
        // ... (all 30 months paid)
      ],
      prepaymentRules: {
        allowed: true,
        minimumAmount: 15000,
        charges: "1% of prepayment amount",
      },
      foreclosureOptions: {
        allowedAfter: 12,
        charges: "2% of outstanding",
      },
      missedPayments: 0,
      overdueAmount: 0,
      completionStatus: "completed",
      certificateNumber: "CERT20241101",
    },
  ]);

  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [loanTypeFilter, setLoanTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "employeeName",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showEMIScheduleModal, setShowEMIScheduleModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDisbursementModal, setShowDisbursementModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [notification, setNotification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);

  // Add these to your existing state declarations
  const [showPrepaymentModal, setShowPrepaymentModal] = useState(false);
  const [showForeclosureModal, setShowForeclosureModal] = useState(false);
  const [prepaymentData, setPrepaymentData] = useState({
    loanId: "",
    amount: "",
    charges: 0,
    totalAmount: 0,
  });
  const [foreclosureData, setForeclosureData] = useState({
    loanId: "",
    outstandingAmount: 0,
    charges: 0,
    totalAmount: 0,
  });
  const itemsPerPage = 6;

  const [foreclosureConfirmed, setForeclosureConfirmed] = useState(false);
  // New loan application state
  const [newLoanApplication, setNewLoanApplication] = useState({
    employeeName: "",
    employeeId: "",
    department: "",
    designation: "",
    loanType: "Personal loan",
    amount: "",
    purpose: "",
    interestRate: "8.5",
    tenureMonths: "12",
    serviceTenure: "",
    monthlySalary: "",
    existingLoans: "0",
  });

  // Edit loan state
  const [editLoan, setEditLoan] = useState({
    id: "",
    employeeName: "",
    employeeId: "",
    loanType: "",
    amount: "",
    interestRate: "",
    tenureMonths: "",
    status: "",
    monthlyEMI: "",
    amountPaid: "",
    amountPending: "",
  });

  // Payment state
  const [paymentData, setPaymentData] = useState({
    loanId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "payroll_deduction",
    transactionId: "",
    remarks: "",
  });

  // Disbursement state
  const [disbursementData, setDisbursementData] = useState({
    loanId: "",
    method: "bank_transfer",
    bankDetails: { accountNumber: "", bankName: "" },
    disbursementDate: new Date().toISOString().split("T")[0],
    transactionId: "",
  });
  const [showDocModal, setShowDocModal] = useState(false);
  const [activeDoc, setActiveDoc] = useState(null);

  const handleViewDocument = (docKey) => {
    setActiveDoc(docKey);
    setShowDocModal(true);
  };
  const documentLabels = {
    applicationForm: "Application Form",
    identityProof: "Identity Proof",
    salarySlips: "Salary Slips",
    agreement: "Agreement",
    certificate: "Certificate",
  };
  const getDocumentLabel = (docKey) => {
    return documentLabels[docKey] || docKey;
  };

  // Loan types
  const loanTypes = [
    "Personal loan",
    "Vehicle loan",
    "Educational loan",
    "Festival advance",
    "Emergency loan",
    "Salary advance",
  ];

  // Eligibility criteria
  const eligibilityCriteria = {
    serviceTenure: {
      personalLoan: "6 months",
      vehicleLoan: "1 year",
      educationalLoan: "6 months",
      festivalAdvance: "3 months",
      emergencyLoan: "1 month",
      salaryAdvance: "Probation completed",
    },
    salaryMultiplier: {
      personalLoan: "3x monthly salary",
      vehicleLoan: "5x monthly salary",
      educationalLoan: "2x monthly salary",
      festivalAdvance: "1x monthly salary",
      emergencyLoan: "2x monthly salary",
      salaryAdvance: "50% of next salary",
    },
  };

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalLoans = loans.length;
    const activeLoans = loans.filter((loan) => loan.status === "Active").length;
    const pendingApplications = loans.filter(
      (loan) =>
        loan.applicationStatus === "submitted" ||
        loan.applicationStatus === "under_review"
    ).length;
    const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalPending = loans.reduce(
      (sum, loan) => sum + loan.amountPending,
      0
    );
    const totalCollected = loans.reduce(
      (sum, loan) => sum + loan.amountPaid,
      0
    );
    const avgInterest =
      loans.reduce((sum, loan) => sum + loan.interestRate, 0) / totalLoans;
    const completedLoans = loans.filter(
      (loan) => loan.status === "Completed"
    ).length;

    return {
      totalLoans,
      activeLoans,
      pendingApplications,
      totalAmount,
      totalPending,
      totalCollected,
      avgInterest,
      completedLoans,
    };
  }, [loans]);

  // Filter and search
  const filteredData = useMemo(() => {
    let data = loans;

    // Filter by tab
    if (activeTab === "pending") {
      data = data.filter(
        (loan) =>
          loan.applicationStatus === "submitted" ||
          loan.applicationStatus === "under_review"
      );
    } else if (activeTab === "active") {
      data = data.filter((loan) => loan.status === "Active");
    } else if (activeTab === "completed") {
      data = data.filter((loan) => loan.status === "Completed");
    } else if (activeTab === "overdue") {
      data = data.filter((loan) => loan.overdueAmount > 0);
    }

    // Apply search and filters
    return data.filter((loan) => {
      const matchesSearch =
        loan.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLoanType =
        loanTypeFilter === "All" || loan.loanType === loanTypeFilter;
      const matchesStatus =
        statusFilter === "All" || loan.status === statusFilter;
      return matchesSearch && matchesLoanType && matchesStatus;
    });
  }, [loans, searchTerm, loanTypeFilter, statusFilter, activeTab]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (
        sortConfig.key === "amount" ||
        sortConfig.key === "interestRate" ||
        sortConfig.key === "amountPending" ||
        sortConfig.key === "monthlyEMI"
      ) {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else if (
        sortConfig.key === "startDate" ||
        sortConfig.key === "endDate" ||
        sortConfig.key === "nextDueDate"
      ) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statuses = ["All", "Active", "Completed", "Pending", "Overdue"];

  // Helper functions
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getStatusBadge = (status, showIcon = true) => {
    const styles = {
      Active: "bg-success-subtle text-success",
      Completed: "bg-info-subtle text-info",
      Pending: "bg-warning-subtle text-warning",
      Defaulted: "bg-danger-subtle text-danger",
      Approved: "bg-success-subtle text-success",
      Rejected: "bg-danger-subtle text-danger",
      "Under Review": "bg-warning-subtle text-warning",
    };

    const icons = {
      Active: "heroicons:check-circle",
      Completed: "heroicons:check-badge",
      Pending: "heroicons:clock",
      Defaulted: "heroicons:x-circle",
      Approved: "heroicons:check",
      Rejected: "heroicons:x-mark",
      "Under Review": "heroicons:document-magnifying-glass",
    };

    return (
      <span
        className={`badge d-flex align-items-center justify-content-center ${styles[status] || styles["Active"]
          }`}
        style={{ minWidth: "80px" }}
      >
        {showIcon && activeTab !== "pending" && (
          <Icon icon={icons[status] || icons["Active"]} className="me-1" />
        )}
        {!showIcon && activeTab === "pending" && (
          <Icon icon={icons[status] || icons["Active"]} className="me-1" />
        )}
        {status}
      </span>
    );
  };

  const getApplicationStatusBadge = (status) => {
    const statusMap = {
      draft: { color: "secondary", text: "Draft" },
      submitted: { color: "warning", text: "Submitted" },
      under_review: { color: "info", text: "Under Review" },
      approved: { color: "success", text: "Approved" },
      rejected: { color: "danger", text: "Rejected" },
      disbursed: { color: "primary", text: "Disbursed" },
    };

    const statusInfo = statusMap[status] || statusMap.draft;
    return (
      <span
        className={`badge bg-${statusInfo.color}-subtle text-${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  const getLoanTypeBadge = (type) => {
    const styles = {
      "Personal loan": "bg-primary-subtle text-primary",
      "Vehicle loan": "bg-info-subtle text-info",
      "Educational loan": "bg-success-subtle text-success",
      "Festival advance": "bg-warning-subtle text-warning",
      "Emergency loan": "bg-danger-subtle text-danger",
      "Salary advance": "bg-secondary-subtle text-secondary",
    };

    return (
      <span className={`badge ${styles[type] || "bg-light text-dark"}`}>
        {type}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateEMI = (principal, rate, months) => {
    if (rate === 0) return principal / months;

    const monthlyRate = rate / 12 / 100;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return parseFloat(emi.toFixed(2));
  };

  const calculateInterest = (principal, rate, months) => {
    const totalAmount = principal * (1 + (rate / 100) * (months / 12));
    return totalAmount - principal;
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Loan Application Functions
  const handleApplyForLoan = () => {
    // Check eligibility
    const loanType = newLoanApplication.loanType;
    const serviceTenure = parseInt(newLoanApplication.serviceTenure);
    const monthlySalary = parseFloat(newLoanApplication.monthlySalary);
    const loanAmount = parseFloat(newLoanApplication.amount);

    const requiredTenure =
      eligibilityCriteria.serviceTenure[
      loanType.toLowerCase().replace(" ", "")
      ];
    const salaryMultiplier =
      eligibilityCriteria.salaryMultiplier[
      loanType.toLowerCase().replace(" ", "")
      ];

    const newId = loans.length + 1;
    const monthlyEMI = calculateEMI(
      loanAmount,
      parseFloat(newLoanApplication.interestRate),
      parseInt(newLoanApplication.tenureMonths)
    );

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(
      endDate.getMonth() + parseInt(newLoanApplication.tenureMonths)
    );

    const newLoanRecord = {
      id: newId,
      loanId: `LN${String(newId).padStart(3, "0")}`,
      employeeId: newLoanApplication.employeeId,
      employeeName: newLoanApplication.employeeName,
      department: newLoanApplication.department,
      designation: newLoanApplication.designation,
      loanType: newLoanApplication.loanType,
      amount: loanAmount,
      interestRate: parseFloat(newLoanApplication.interestRate),
      tenureMonths: parseInt(newLoanApplication.tenureMonths),
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      monthlyEMI: monthlyEMI,
      amountPaid: 0,
      amountPending: loanAmount,
      status: "Pending",
      nextDueDate: "N/A",
      applicationDate: new Date().toISOString().split("T")[0],
      applicationStatus: "submitted",
      approvalWorkflow: [
        {
          level: "supervisor",
          status: "pending",
          date: null,
          approvedBy: null,
        },
        { level: "hr", status: "pending", date: null, approvedBy: null },
        { level: "finance", status: "pending", date: null, approvedBy: null },
      ],
      eligibilityChecks: {
        serviceTenure: {
          required: requiredTenure,
          actual: `${serviceTenure} months`,
          status: serviceTenure >= 6 ? "pass" : "fail",
        },
        salaryRatio: {
          required: salaryMultiplier,
          actual: `${(loanAmount / monthlySalary).toFixed(1)}x`,
          status: loanAmount / monthlySalary <= 3 ? "pass" : "fail",
        },
        existingLoans: {
          count: parseInt(newLoanApplication.existingLoans),
          status:
            parseInt(newLoanApplication.existingLoans) < 2 ? "pass" : "fail",
        },
      },
      documents: {
        applicationForm: { uploaded: true, verified: false },
        identityProof: { uploaded: false, verified: false },
        salarySlips: { uploaded: false, verified: false },
        agreement: { generated: false, signed: false },
        certificate: { generated: false },
      },
      disbursement: {
        status: "pending",
        method: "",
        bankDetails: { accountNumber: "", bankName: "" },
        disbursementDate: null,
        disbursementAmount: loanAmount,
        transactionId: "",
      },
      paymentMethod: "payroll_deduction",
      autoDeduction: {
        enabled: false,
        deductionDate: 5,
        accountDetails: { accountNumber: "", bankName: "" },
      },
      emiSchedule: [],
      prepaymentRules: {
        allowed: true,
        minimumAmount: 10000,
        charges: "2% of prepayment amount",
      },
      foreclosureOptions: {
        allowedAfter: 12,
        charges: "3% of outstanding",
      },
      missedPayments: 0,
      overdueAmount: 0,
      completionStatus: "pending",
      certificateNumber: null,
    };

    setLoans([...loans, newLoanRecord]);
    setShowApplicationModal(false);
    setNewLoanApplication({
      employeeName: "",
      employeeId: "",
      department: "",
      designation: "",
      loanType: "Personal loan",
      amount: "",
      purpose: "",
      interestRate: "8.5",
      tenureMonths: "12",
      serviceTenure: "",
      monthlySalary: "",
      existingLoans: "0",
    });

    showNotification("Loan application submitted successfully!", "success");
  };

  // View Loan Details
  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  // Edit Loan
  const handleEditLoan = (loan) => {
    setEditLoan({
      id: loan.id,
      employeeName: loan.employeeName,
      employeeId: loan.employeeId,
      loanType: loan.loanType,
      amount: loan.amount,
      interestRate: loan.interestRate,
      tenureMonths: loan.tenureMonths,
      status: loan.status,
      monthlyEMI: loan.monthlyEMI,
      amountPaid: loan.amountPaid,
      amountPending: loan.amountPending,
    });
    setShowEditModal(true);
  };

  // Update Loan
  const handleUpdateLoan = () => {
    setLoans(
      loans.map((loan) =>
        loan.id === editLoan.id
          ? {
            ...loan,
            ...editLoan,
            amount: parseFloat(editLoan.amount),
            interestRate: parseFloat(editLoan.interestRate),
            tenureMonths: parseInt(editLoan.tenureMonths),
            monthlyEMI: calculateEMI(
              parseFloat(editLoan.amount),
              parseFloat(editLoan.interestRate),
              parseInt(editLoan.tenureMonths)
            ),
            amountPending:
              parseFloat(editLoan.amount) - parseFloat(editLoan.amountPaid),
          }
          : loan
      )
    );
    setShowEditModal(false);
    showNotification("Loan updated successfully!", "success");
  };

  // Handle Prepayment Click
  const handlePrepaymentClick = (loan) => {
    setSelectedLoan(loan);
    setPrepaymentData({
      loanId: loan.loanId,
      amount: "",
      charges: 0,
      totalAmount: 0,
    });
    setShowPrepaymentModal(true);
  };

  // Handle Prepayment Calculation
  const handlePrepaymentCalculate = () => {
    const amount = parseFloat(prepaymentData.amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      showNotification("Please enter a valid amount", "warning");
      return;
    }

    if (amount < selectedLoan.prepaymentRules.minimumAmount) {
      showNotification(
        `Minimum prepayment amount is ${formatCurrency(
          selectedLoan.prepaymentRules.minimumAmount
        )}`,
        "warning"
      );
      return;
    }

    const charges = amount * 0.02; // 2% charges as per prepaymentRules
    const totalAmount = amount + charges;

    setPrepaymentData({
      ...prepaymentData,
      charges: charges,
      totalAmount: totalAmount,
    });
  };

  // Process Prepayment
  const handleProcessPrepayment = () => {
    if (!prepaymentData.amount || prepaymentData.totalAmount === 0) {
      showNotification("Please calculate charges first", "warning");
      return;
    }

    setLoans((prevLoans) =>
      prevLoans.map((loan) => {
        if (loan.id === selectedLoan.id) {
          const newAmountPaid =
            loan.amountPaid + parseFloat(prepaymentData.amount);
          const newAmountPending = Math.max(
            0,
            loan.amountPending - parseFloat(prepaymentData.amount)
          );
          const newStatus = newAmountPending === 0 ? "Completed" : loan.status;

          return {
            ...loan,
            amountPaid: newAmountPaid,
            amountPending: newAmountPending,
            status: newStatus,
            ...(newAmountPending === 0 && {
              completionStatus: "prepaid",
              documents: {
                ...loan.documents,
                certificate: {
                  generated: true,
                  certificateNumber: `PREPAID-${Date.now()}`,
                },
              },
            }),
          };
        }
        return loan;
      })
    );

    setShowPrepaymentModal(false);
    showNotification(
      `Prepayment of ${formatCurrency(
        parseFloat(prepaymentData.amount)
      )} processed successfully!`,
      "success"
    );
  };

  // Handle Foreclosure Click
  const handleForeclosureClick = (loan) => {
    setSelectedLoan(loan);
    const charges = loan.amountPending * 0.03; // 3% charges as per foreclosureOptions
    const totalAmount = loan.amountPending + charges;

    setForeclosureData({
      loanId: loan.loanId,
      outstandingAmount: loan.amountPending,
      charges: charges,
      totalAmount: totalAmount,
    });
    setShowForeclosureModal(true);
  };

  // Process Foreclosure
  const handleProcessForeclosure = () => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) => {
        if (loan.id === selectedLoan.id) {
          return {
            ...loan,
            amountPaid: loan.amountPaid + loan.amountPending,
            amountPending: 0,
            status: "Completed",
            completionStatus: "foreclosed",
            documents: {
              ...loan.documents,
              certificate: {
                generated: true,
                certificateNumber: `FORECLOSED-${Date.now()}`,
              },
            },
          };
        }
        return loan;
      })
    );

    setShowForeclosureModal(false);
    showNotification("Loan foreclosed successfully!", "success");
  };

  // Delete Loan Confirmation
  const handleDeleteConfirmation = (loan) => {
    setLoanToDelete(loan);
    setShowDeleteModal(true);
  };

  // Delete Loan
  const handleDeleteLoan = () => {
    if (loanToDelete) {
      setLoans(loans.filter((loan) => loan.id !== loanToDelete.id));
      if (selectedLoan?.id === loanToDelete.id) {
        setShowModal(false);
      }
      setShowDeleteModal(false);
      setLoanToDelete(null);
      showNotification("Loan deleted successfully!", "success");
    }
  };

  // Make Payment
  const handleMakePayment = (loan) => {
    setPaymentData({
      loanId: loan.loanId,
      amount: loan.monthlyEMI,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "payroll_deduction",
      transactionId: "",
      remarks: "Monthly EMI Payment",
    });
    setSelectedLoan(loan);
    setShowPaymentModal(true);
  };

  // Process Payment
  const handleProcessPayment = () => {
    setLoans(
      loans.map((loan) => {
        if (loan.loanId === paymentData.loanId) {
          const newAmountPaid =
            loan.amountPaid + parseFloat(paymentData.amount);
          const newAmountPending = Math.max(
            0,
            loan.amountPending - parseFloat(paymentData.amount)
          );
          const newStatus = newAmountPending === 0 ? "Completed" : loan.status;

          // Update EMI schedule
          const updatedEMISchedule = [...(loan.emiSchedule || [])];
          const currentMonthIndex = updatedEMISchedule.findIndex(
            (emi) => emi.status === "due"
          );
          if (currentMonthIndex !== -1) {
            updatedEMISchedule[currentMonthIndex] = {
              ...updatedEMISchedule[currentMonthIndex],
              status: "paid",
              paymentDate: paymentData.paymentDate,
            };
          }

          return {
            ...loan,
            amountPaid: newAmountPaid,
            amountPending: newAmountPending,
            status: newStatus,
            emiSchedule: updatedEMISchedule,
            nextDueDate:
              updatedEMISchedule.find((emi) => emi.status === "due")?.dueDate ||
              "N/A",
          };
        }
        return loan;
      })
    );

    setShowPaymentModal(false);
    showNotification("Payment processed successfully!", "success");
  };

  // Approve Loan
  const handleApproveLoan = (loan, level) => {
    setLoans(
      loans.map((l) => {
        if (l.id === loan.id) {
          const updatedWorkflow = [...l.approvalWorkflow];
          const levelIndex = updatedWorkflow.findIndex(
            (w) => w.level === level
          );

          if (levelIndex !== -1) {
            updatedWorkflow[levelIndex] = {
              ...updatedWorkflow[levelIndex],
              status: "approved",
              date: new Date().toISOString().split("T")[0],
              approvedBy: "Current User",
            };
          }

          // Check what the next status should be
          const nextLevels = ["supervisor", "hr", "finance"];
          const currentIndex = nextLevels.indexOf(level);
          const nextLevel = nextLevels[currentIndex + 1];

          // If there's a next level, update its status to pending
          if (nextLevel) {
            const nextLevelIndex = updatedWorkflow.findIndex(
              (w) => w.level === nextLevel
            );
            if (
              nextLevelIndex !== -1 &&
              updatedWorkflow[nextLevelIndex].status === "pending"
            ) {
              updatedWorkflow[nextLevelIndex] = {
                ...updatedWorkflow[nextLevelIndex],
                status: "pending",
              };
            }
          }

          // Update application status based on current approval
          let newApplicationStatus = l.applicationStatus;
          if (level === "supervisor") {
            newApplicationStatus = "under_review";
          } else if (level === "hr") {
            newApplicationStatus = "under_review";
          } else if (level === "finance") {
            newApplicationStatus = "approved";
          }

          return {
            ...l,
            approvalWorkflow: updatedWorkflow,
            applicationStatus: newApplicationStatus,
            status: newApplicationStatus === "approved" ? "Active" : "Pending",
          };
        }
        return l;
      })
    );

    showNotification(`Loan ${level} approval completed!`, "success");
  };

  // Reject Loan
  const handleRejectLoan = (loan, level) => {
    setLoans(
      loans.map((l) => {
        if (l.id === loan.id) {
          const updatedWorkflow = [...l.approvalWorkflow];
          const levelIndex = updatedWorkflow.findIndex(
            (w) => w.level === level
          );
          if (levelIndex !== -1) {
            updatedWorkflow[levelIndex] = {
              ...updatedWorkflow[levelIndex],
              status: "rejected",
              date: new Date().toISOString().split("T")[0],
              approvedBy: "Current User",
            };
          }

          return {
            ...l,
            approvalWorkflow: updatedWorkflow,
            applicationStatus: "rejected",
            status: "Rejected",
          };
        }
        return l;
      })
    );

    showNotification("Loan application rejected!", "warning");
  };

  // Disburse Loan
  const handleDisburseLoan = (loan) => {
    setDisbursementData({
      loanId: loan.loanId,
      method: "bank_transfer",
      bankDetails: { accountNumber: "", bankName: "" },
      disbursementDate: new Date().toISOString().split("T")[0],
      transactionId: `TXN${Date.now()}`,
    });
    setSelectedLoan(loan);
    setShowDisbursementModal(true);
  };

  // Process Disbursement
  const handleProcessDisbursement = () => {
    setLoans(
      loans.map((loan) => {
        if (loan.loanId === disbursementData.loanId) {
          // Generate EMI schedule
          const emiSchedule = [];
          const startDate = new Date(loan.startDate);

          for (let i = 1; i <= loan.tenureMonths; i++) {
            const dueDate = new Date(startDate);
            dueDate.setMonth(dueDate.getMonth() + i);
            emiSchedule.push({
              month: i,
              dueDate: dueDate.toISOString().split("T")[0],
              amount: loan.monthlyEMI,
              status: i === 1 ? "due" : "pending",
            });
          }

          return {
            ...loan,
            disbursement: {
              status: "completed",
              method: disbursementData.method,
              bankDetails: disbursementData.bankDetails,
              disbursementDate: disbursementData.disbursementDate,
              disbursementAmount: loan.amount,
              transactionId: disbursementData.transactionId,
            },
            applicationStatus: "disbursed",
            status: "Active",
            emiSchedule: emiSchedule,
            nextDueDate: emiSchedule[0]?.dueDate || "N/A",
          };
        }
        return loan;
      })
    );

    setShowDisbursementModal(false);
    showNotification("Loan disbursed successfully!", "success");
  };

  // Generate Certificate
  const handleGenerateCertificate = (loan) => {
    setLoans(
      loans.map((l) => {
        if (l.id === loan.id) {
          const certificateNumber = `CERT${Date.now()}`;
          return {
            ...l,
            documents: {
              ...l.documents,
              certificate: { generated: true, certificateNumber },
            },
            completionStatus: "completed",
            status: "Completed",
          };
        }
        return l;
      })
    );

    setSelectedLoan(loan);
    setShowCertificateModal(true);
    showNotification("Certificate generated successfully!", "success");
  };

  // View Certificate
  const handleViewCertificate = (loan) => {
    setSelectedLoan(loan);
    setShowCertificateModal(true);
  };

  // Export functions
  const exportToCSV = () => {
    const headers = [
      "Loan ID",
      "Employee ID",
      "Employee Name",
      "Loan Type",
      "Amount",
      "Interest Rate",
      "Tenure (Months)",
      "Start Date",
      "End Date",
      "Monthly EMI",
      "Amount Paid",
      "Amount Pending",
      "Status",
      "Application Status",
      "Next Due Date",
    ];
    const csvData = [headers];

    sortedData.forEach((record) => {
      csvData.push([
        record.loanId,
        record.employeeId,
        record.employeeName,
        record.loanType,
        formatCurrency(record.amount),
        `${record.interestRate}%`,
        record.tenureMonths,
        formatDate(record.startDate),
        formatDate(record.endDate),
        formatCurrency(record.monthlyEMI),
        formatCurrency(record.amountPaid),
        formatCurrency(record.amountPending),
        record.status,
        record.applicationStatus,
        formatDate(record.nextDueDate),
      ]);
    });

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loan_management_export_${new Date().toISOString().split("T")[0]
      }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showNotification("Data exported to CSV successfully!", "success");
  };

  const refreshData = () => {
    setCurrentPage(1);
    setSearchTerm("");
    setLoanTypeFilter("All");
    setStatusFilter("All");
    setSortConfig({ key: "employeeName", direction: "asc" });
    showNotification("Data refreshed successfully!", "info");
  };

  return (
    <>
      <div className="container-fluid">
        {/* Notification */}
        {notification && (
          <div
            className={`alert alert-${notification.type} alert-dismissible fade show position-fixed top-0 end-0 m-3`}
            role="alert"
            style={{ zIndex: 9999 }}
          >
            <Icon
              icon={
                notification.type === "success"
                  ? "heroicons:check-circle"
                  : "heroicons:information-circle"
              }
              className="me-2"
            />
            {notification.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setNotification(null)}
            ></button>
          </div>
        )}

        {/* Header */}
        <div className="mb-4">
          <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
            <Icon icon="heroicons:banknotes" />
            Advances & Loan Management
          </h5>
          <p className="text-muted">
            Manage employee loans, advances, EMI schedules, and repayment
            tracking.
          </p>
        </div>

        {/* Tabs */}
        <div className="col-12 mb-4">
          <div className="d-flex overflow-auto">
            <div className="d-flex flex-nowrap gap-2 w-100">
              {/* All Loans */}
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`btn d-flex align-items-center gap-2 px-4 py-2.5 rounded flex-shrink-0 ${activeTab === "all"
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
                  }`}
              >
                <span>All Loans</span>
                <span className="badge bg-light text-dark ms-2">
                  {loans.length}
                </span>
              </button>

              {/* Pending Applications */}
              <button
                type="button"
                onClick={() => setActiveTab("pending")}
                className={`btn d-flex align-items-center gap-2 px-4 py-2.5 rounded flex-shrink-0 ${activeTab === "pending"
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
                  }`}
              >
                <span>Pending</span>
                <span className="badge bg-light text-dark ms-2">
                  {kpis.pendingApplications}
                </span>
              </button>

              {/* Active Loans */}
              <button
                type="button"
                onClick={() => setActiveTab("active")}
                className={`btn d-flex align-items-center gap-2 px-4 py-2.5 rounded flex-shrink-0 ${activeTab === "active"
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
                  }`}
              >
                <span>Active</span>
                <span className="badge bg-light text-dark ms-2">
                  {kpis.activeLoans}
                </span>
              </button>

              {/* Completed Loans */}
              <button
                type="button"
                onClick={() => setActiveTab("completed")}
                className={`btn d-flex align-items-center gap-2 px-4 py-2.5 rounded flex-shrink-0 ${activeTab === "completed"
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
                  }`}
              >
                <span>Completed</span>
                <span className="badge bg-light text-dark ms-2">
                  {kpis.completedLoans}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="w-60-px h-60-px bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon
                      icon="heroicons:banknotes"
                      className="text-primary text-2xl"
                    />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-bold mb-1">Total Loans</h6>
                  <div className="text-muted fs-4">{kpis.totalLoans}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="w-60-px h-60-px bg-success-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon
                      icon="heroicons:check-circle"
                      className="text-success text-2xl"
                    />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-bold mb-1">Active Loans</h6>
                  <div className="text-muted fs-4">{kpis.activeLoans}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="w-60-px h-60-px bg-info-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon
                      icon="heroicons:currency-rupee"
                      className="text-info text-2xl"
                    />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-bold mb-1">Total Amount</h6>
                  <div className="text-muted fs-4">
                    {formatCurrency(kpis.totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="w-60-px h-60-px bg-warning-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon
                      icon="heroicons:clock"
                      className="text-warning text-2xl"
                    />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-bold mb-1">Pending Amount</h6>
                  <div className="text-muted fs-4">
                    {formatCurrency(kpis.totalPending)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card border shadow-none mb-4">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-3 align-items-center">
              {/* Search */}
              <div className="position-relative col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                <Icon
                  icon="heroicons:magnifying-glass"
                  className="position-absolute top-50 translate-middle-y text-muted ms-3"
                />
                <input
                  type="text"
                  placeholder="Search by employee name, ID, or loan ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control ps-5"
                />
              </div>

              {/* Loan Type Filter */}
              <div className="col-6 col-sm-3 col-md-2 col-lg-2">
                <select
                  value={loanTypeFilter}
                  onChange={(e) => setLoanTypeFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="All">All Loan Types</option>
                  {loanTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="col-4 col-sm-2 col-md-2 col-lg-1">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-md-row flex-wrap gap-2">
                <button
                  onClick={() => setShowApplicationModal(true)}
                  className="btn btn-success d-flex align-items-center justify-content-center flex-fill flex-md-grow-0"
                >
                  <Icon icon="heroicons:document-plus" className="me-2" />
                  <span>Apply for Loan</span>
                </button>

                <button
                  onClick={exportToCSV}
                  className="btn btn-primary d-flex align-items-center justify-content-center flex-fill flex-md-grow-0"
                >
                  <Icon icon="heroicons:document-arrow-down" className="me-2" />
                  <span>Export</span>
                </button>

                <button
                  onClick={refreshData}
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center flex-fill flex-md-grow-0"
                >
                  <Icon icon="heroicons:arrow-path" className="me-2" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loans Table */}
        <div className="card border shadow-none">
          <div className="card-header bg-transparent border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0">
                {activeTab === "all" && "All Loan Records"}
                {activeTab === "pending" && "Pending Applications"}
                {activeTab === "active" && "Active Loans"}
                {activeTab === "completed" && "Completed Loans"}
              </h6>
              <div className="text-muted">
                Showing {paginatedData.length} of {sortedData.length} records
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th
                      className="border-0 px-4 py-3 text-uppercase fw-bold text-dark text-start"
                      onClick={() => handleSort("employeeName")}
                      style={{ cursor: "pointer", width: "15%" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        Employee Details
                        <Icon
                          icon={`heroicons:chevron-${sortConfig.key === "employeeName" &&
                            sortConfig.direction === "asc"
                            ? "up"
                            : "down"
                            }`}
                          className="small"
                        />
                      </div>
                    </th>
                    <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark text-start" style={{ width: "10%" }}>
                      DESIGNATION
                    </th>
                    <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark text-start" style={{ width: "10%" }}>
                      DEPARTMENT
                    </th>
                    <th
                      className="border-0 px-3 py-3 text-uppercase fw-bold text-dark text-start"
                      onClick={() => handleSort("loanType")}
                      style={{ cursor: "pointer", width: "12%" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        LOAN TYPE
                        <Icon
                          icon={`heroicons:chevron-${sortConfig.key === "loanType" &&
                            sortConfig.direction === "asc"
                            ? "up"
                            : "down"
                            }`}
                          className="small"
                        />
                      </div>
                    </th>
                    <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark text-center" style={{ width: "10%" }}>
                      STATUS
                    </th>
                    <th
                      className="border-0 px-3 py-3 text-uppercase fw-bold text-dark text-center"
                      onClick={() => handleSort("startDate")}
                      style={{ cursor: "pointer", width: "10%" }}
                    >
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        ISSUE DATE
                        <Icon
                          icon={`heroicons:chevron-${sortConfig.key === "startDate" &&
                            sortConfig.direction === "asc"
                            ? "up"
                            : "down"
                            }`}
                          className="small"
                        />
                      </div>
                    </th>
                    <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark text-center" style={{ width: "10%" }}>
                      INTEREST METHOD
                    </th>
                    <th
                      className="border-0 px-3 py-3 text-uppercase fw-bold text-dark text-end"
                      onClick={() => handleSort("amount")}
                      style={{ cursor: "pointer", width: "12%" }}
                    >
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        AMOUNT DETAILS
                        <Icon
                          icon={`heroicons:chevron-${sortConfig.key === "amount" &&
                            sortConfig.direction === "asc"
                            ? "up"
                            : "down"
                            }`}
                          className="small"
                        />
                      </div>
                    </th>
                    <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark text-end" style={{ width: "11%" }}>
                      EMI & TENURE
                    </th>
                    <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark text-center" style={{ width: "10%" }}>
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((loan) => (
                    <tr key={loan.id} className="border-bottom">

                      {/* Employee Details Column */}
                      <td className="px-4 py-3 text-start">
                        <div>
                          <div className="fw-medium text-dark">
                            {loan.employeeName}
                          </div>
                          <div className="small text-muted">
                            ID: {loan.employeeId}
                          </div>
                          <div className="small text-muted">
                            Loan ID: {loan.loanId}
                          </div>
                        </div>
                      </td>


                      {/* Designation Column */}
                      <td className="px-4 py-3 text-start">
                        <div className="fw-medium text-dark">
                          {loan.designation || "N/A"}
                        </div>
                      </td>

                      {/* Department Column */}
                      <td className="px-4 py-3 text-start">
                        <div className="fw-medium text-dark">
                          {loan.department || "N/A"}
                        </div>
                      </td>

                      {/* Loan Type Column (Separated) */}
                      <td className="px-4 py-3 text-start">
                        <div className="mb-2">
                          {getLoanTypeBadge(loan.loanType)}
                        </div>
                        <div className="small text-muted">
                          {loan.interestRate}% interest
                        </div>
                        {loan.paymentMethod && (
                          <div className="small text-muted mt-1">
                            {loan.paymentMethod === "payroll_deduction"
                              ? "Payroll Deduction"
                              : loan.paymentMethod === "bank_transfer"
                                ? "Bank Transfer"
                                : loan.paymentMethod.charAt(0).toUpperCase() +
                                loan.paymentMethod.slice(1)}
                          </div>
                        )}
                      </td>

                      {/* Status Column (Separated) - Updated to remove icons for pending tab */}
                      <td className="px-4 py-3 text-center">
                        <div className="mb-2 d-flex justify-content-center">
                          {activeTab === "pending" ? (
                            <span
                              className={`badge d-flex align-items-center justify-content-center bg-warning-subtle text-warning`}
                              style={{ minWidth: "80px" }}
                            >
                              {loan.status}
                            </span>
                          ) : (
                            getStatusBadge(loan.status)
                          )}
                        </div>
                        {loan.applicationStatus && (
                          <div className="mb-1 d-flex justify-content-center">
                            {getApplicationStatusBadge(loan.applicationStatus)}
                          </div>
                        )}
                        <div className="small text-muted">
                          {formatDate(loan.applicationDate)}
                        </div>
                      </td>

                      {/* Issue Date Column */}
                      <td className="px-4 py-3 text-center">
                        <div className="fw-medium text-dark">
                          {formatDate(loan.startDate)}
                        </div>
                        <div className="small text-muted">
                          End: {formatDate(loan.endDate)}
                        </div>
                      </td>

                      {/* Interest Method Column */}
                      <td className="px-4 py-3 text-center">
                        <div className="fw-medium text-dark">
                          {loan.interestRate > 0
                            ? "Reducing Balance"
                            : "No Interest"}
                        </div>
                        <div className="small text-muted">
                          {loan.interestRate > 0
                            ? `${loan.interestRate}% per annum`
                            : "Interest Free"}
                        </div>
                      </td>

                      {/* Amount Details Column */}
                      <td className="px-4 py-3 text-end">
                        <div className="fw-semibold text-dark">
                          {formatCurrency(loan.amount)}
                        </div>
                        <div className="small text-muted">
                          <div>Paid: {formatCurrency(loan.amountPaid)}</div>
                          <div>
                            Pending: {formatCurrency(loan.amountPending)}
                          </div>
                        </div>
                        {loan.overdueAmount > 0 && (
                          <div className="small text-danger mt-1">
                            Overdue: {formatCurrency(loan.overdueAmount)}
                          </div>
                        )}
                      </td>

                      {/* EMI & Tenure Column */}
                      <td className="px-4 py-3 text-end">
                        <div className="fw-semibold text-dark">
                          {formatCurrency(loan.monthlyEMI)}/month
                        </div>
                        <div className="small text-muted">
                          {loan.tenureMonths} months
                        </div>
                        <div className="small text-muted">
                          Next due: {formatDate(loan.nextDueDate)}
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 py-3 text-center">
                        <div className="d-flex flex-wrap gap-1 justify-content-center">
                          <button
                            onClick={() => handleViewDetails(loan)}
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            title="View Details"
                          >
                            <Icon icon="heroicons:eye" />
                          </button>
                          {loan.status === "Active" && (
                            <button
                              onClick={() => handleMakePayment(loan)}
                              className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                              title="Make Payment"
                            >
                              <Icon icon="heroicons:currency-rupee" />
                            </button>
                          )}
                          {/* Single approval/reject buttons that change dynamically */}

                          {loan.applicationStatus === "submitted" ||
                            loan.applicationStatus === "under_review" ? (
                            <>
                              {/* Show approve button for the next pending level */}
                              {(loan.approvalWorkflow?.find(
                                (w) => w.status === "pending"
                              )?.level === "supervisor" ||
                                (loan.approvalWorkflow?.find(
                                  (w) => w.level === "supervisor"
                                )?.status === "pending" &&
                                  loan.applicationStatus === "submitted")) && (
                                  <button
                                    onClick={() =>
                                      handleApproveLoan(loan, "supervisor")
                                    }
                                    className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                                    title="Supervisor Approve"
                                  >
                                    <Icon icon="heroicons:check" />
                                  </button>
                                )}

                              {(loan.approvalWorkflow?.find(
                                (w) => w.status === "pending"
                              )?.level === "hr" ||
                                (loan.approvalWorkflow?.find(
                                  (w) => w.level === "supervisor"
                                )?.status === "approved" &&
                                  loan.approvalWorkflow?.find(
                                    (w) => w.level === "hr"
                                  )?.status === "pending")) && (
                                  <button
                                    onClick={() => handleApproveLoan(loan, "hr")}
                                    className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                                    title="HR Approve"
                                  >
                                    <Icon icon="heroicons:check" />
                                  </button>
                                )}

                              {(loan.approvalWorkflow?.find(
                                (w) => w.status === "pending"
                              )?.level === "finance" ||
                                (loan.approvalWorkflow?.find(
                                  (w) => w.level === "hr"
                                )?.status === "approved" &&
                                  loan.approvalWorkflow?.find(
                                    (w) => w.level === "finance"
                                  )?.status === "pending")) && (
                                  <button
                                    onClick={() =>
                                      handleApproveLoan(loan, "finance")
                                    }
                                    className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                                    title="Finance Approve"
                                  >
                                    <Icon icon="heroicons:check" />
                                  </button>
                                )}

                              {/* Single reject button that rejects at current pending level */}
                              <button
                                onClick={() => {
                                  const pendingLevel =
                                    loan.approvalWorkflow?.find(
                                      (w) => w.status === "pending"
                                    )?.level || "supervisor";
                                  handleRejectLoan(loan, pendingLevel);
                                }}
                                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                title="Reject"
                              >
                                <Icon icon="heroicons:x-mark" />
                              </button>
                            </>
                          ) : null}

                          {loan.applicationStatus === "approved" &&
                            loan.disbursement.status !== "completed" && (
                              <button
                                onClick={() => handleDisburseLoan(loan)}
                                className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
                                title="Disburse"
                              >
                                <Icon icon="heroicons:arrow-up-tray" />
                              </button>
                            )}

                          {loan.status === "Active" && (
                            <>
                              <button
                                onClick={() => handlePrepaymentClick(loan)}
                                className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
                                title="Prepayment"
                              >
                                <Icon icon="heroicons:forward" />
                              </button>
                              <button
                                onClick={() => handleForeclosureClick(loan)}
                                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                title="Foreclosure"
                              >
                                <Icon icon="heroicons:lock-closed" />
                              </button>
                            </>
                          )}

                          {loan.status === "Completed" &&
                            loan.documents.certificate.generated && (
                              <button
                                onClick={() => handleViewCertificate(loan)}
                                className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
                                title="View Certificate"
                              >
                                <Icon icon="heroicons:document-text" />
                              </button>
                            )}
                          <button
                            onClick={() => handleEditLoan(loan)}
                            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                            title="Edit"
                          >
                            <Icon icon="heroicons:pencil-square" />
                          </button>
                          <button
                            onClick={() => handleDeleteConfirmation(loan)}
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                            title="Delete"
                          >
                            <Icon icon="heroicons:trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {paginatedData.length === 0 && (
              <div className="text-center py-5 text-muted">
                <h5>No loan records found</h5>
                <p>No records found matching your search criteria.</p>
              </div>
            )}


            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-top d-flex align-items-center justify-content-between">
                <div className="small text-muted">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
                  {sortedData.length} loans
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`btn btn-sm ${currentPage === i + 1
                        ? "btn-primary"
                        : "btn-outline-secondary"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && loanToDelete && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title d-flex align-items-center gap-2 text-danger">
                    <Icon icon="heroicons:exclamation-triangle" />
                    Confirm Delete
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <div className="mb-4">
                    <div className="w-80-px h-80-px bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                      <Icon
                        icon="heroicons:exclamation-triangle"
                        className="text-danger text-3xl"
                      />
                    </div>
                    <h5 className="fw-bold">Delete Loan Record</h5>
                    <p className="text-muted">
                      Are you sure you want to delete the loan record for{" "}
                      <strong>{loanToDelete.employeeName}</strong>?
                    </p>
                    <div className="alert alert-warning mt-3">
                      <div className="d-flex align-items-start">
                        <Icon
                          icon="heroicons:information-circle"
                          className="text-warning me-2 mt-1"
                        />
                        <div className="small">
                          <strong>Warning:</strong> This action cannot be undone.
                          All loan data including payment history will be
                          permanently deleted.
                        </div>
                      </div>
                    </div>
                    <div className="card bg-light mt-3">
                      <div className="card-body p-3">
                        <div className="row">
                          <div className="col-6">
                            <div className="small text-muted">Loan ID</div>
                            <div className="fw-semibold">
                              {loanToDelete.loanId}
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="small text-muted">Loan Type</div>
                            <div className="fw-semibold">
                              {loanToDelete.loanType}
                            </div>
                          </div>
                          <div className="col-6 mt-2">
                            <div className="small text-muted">Amount</div>
                            <div className="fw-semibold">
                              {formatCurrency(loanToDelete.amount)}
                            </div>
                          </div>
                          <div className="col-6 mt-2">
                            <div className="small text-muted">Status</div>
                            <div>
                              {getStatusBadge(loanToDelete.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger d-flex align-items-center gap-2"
                    onClick={handleDeleteLoan}
                  >
                    <Icon icon="heroicons:trash" />
                    Delete Loan
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loan Application Modal */}
        {showApplicationModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon="heroicons:document-plus" />
                    Apply for Loan
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowApplicationModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Employee Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newLoanApplication.employeeName}
                        onChange={(e) =>
                          setNewLoanApplication({
                            ...newLoanApplication,
                            employeeName: e.target.value,
                          })
                        }
                        placeholder="Enter employee name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Employee ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newLoanApplication.employeeId}
                        onChange={(e) =>
                          setNewLoanApplication({
                            ...newLoanApplication,
                            employeeId: e.target.value,
                          })
                        }
                        placeholder="Enter employee ID"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newLoanApplication.department}
                        onChange={(e) =>
                          setNewLoanApplication({
                            ...newLoanApplication,
                            department: e.target.value,
                          })
                        }
                        placeholder="Enter department"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newLoanApplication.designation}
                        onChange={(e) =>
                          setNewLoanApplication({
                            ...newLoanApplication,
                            designation: e.target.value,
                          })
                        }
                        placeholder="Enter designation"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Loan Type *</label>
                      <select
                        className="form-select"
                        value={newLoanApplication.loanType}
                        onChange={(e) =>
                          setNewLoanApplication({
                            ...newLoanApplication,
                            loanType: e.target.value,
                          })
                        }
                      >
                        {loanTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Loan Amount (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newLoanApplication.amount}
                        onChange={(e) =>
                          setNewLoanApplication({
                            ...newLoanApplication,
                            amount: e.target.value,
                          })
                        }
                        placeholder="Enter loan amount"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Purpose of Loan</label>
                      <textarea
                        className="form-control"
                        value={newLoanApplication.purpose}
                        onChange={(e) =>
                          setNewLoanApplication({
                            ...newLoanApplication,
                            purpose: e.target.value,
                          })
                        }
                        placeholder="Enter loan purpose"
                        rows="2"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Interest Rate (%)</label>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={newLoanApplication.interestRate}
                          onChange={(e) =>
                            setNewLoanApplication({
                              ...newLoanApplication,
                              interestRate: e.target.value,
                            })
                          }
                          placeholder="Enter interest rate"
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Tenure (Months) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newLoanApplication.tenureMonths}
                        onChange={(e) =>
                          setNewLoanApplication({
                            ...newLoanApplication,
                            tenureMonths: e.target.value,
                          })
                        }
                        placeholder="Enter tenure in months"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Service Tenure (Months) *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={newLoanApplication.serviceTenure}
                        onChange={(e) =>
                          setNewLoanApplication({
                            ...newLoanApplication,
                            serviceTenure: e.target.value,
                          })
                        }
                        placeholder="Enter service tenure"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Monthly Salary (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newLoanApplication.monthlySalary}
                        onChange={(e) =>
                          setNewLoanApplication({
                            ...newLoanApplication,
                            monthlySalary: e.target.value,
                          })
                        }
                        placeholder="Enter monthly salary"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Existing Loans Count</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newLoanApplication.existingLoans}
                        onChange={(e) =>
                          setNewLoanApplication({
                            ...newLoanApplication,
                            existingLoans: e.target.value,
                          })
                        }
                        placeholder="Enter existing loans count"
                      />
                    </div>
                    <div className="col-md-12">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="mb-3">Eligibility Check</h6>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="mb-2">
                                <small className="text-muted">Loan Type:</small>
                                <div className="fw-semibold">
                                  {newLoanApplication.loanType}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-2">
                                <small className="text-muted">
                                  Required Service:
                                </small>
                                <div className="fw-semibold">
                                  {
                                    eligibilityCriteria.serviceTenure[
                                    newLoanApplication.loanType
                                      .toLowerCase()
                                      .replace(" ", "")
                                    ]
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-2">
                                <small className="text-muted">
                                  Max Loan Amount:
                                </small>
                                <div className="fw-semibold">
                                  {
                                    eligibilityCriteria.salaryMultiplier[
                                    newLoanApplication.loanType
                                      .toLowerCase()
                                      .replace(" ", "")
                                    ]
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">
                        Calculated Monthly EMI
                      </label>
                      <div className="form-control bg-light fw-bold">
                        {newLoanApplication.amount &&
                          newLoanApplication.interestRate &&
                          newLoanApplication.tenureMonths
                          ? formatCurrency(
                            calculateEMI(
                              parseFloat(newLoanApplication.amount),
                              parseFloat(newLoanApplication.interestRate),
                              parseInt(newLoanApplication.tenureMonths)
                            )
                          )
                          : "--"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowApplicationModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success d-flex align-items-center gap-2"
                    onClick={handleApplyForLoan}
                    disabled={
                      !newLoanApplication.employeeName ||
                      !newLoanApplication.employeeId ||
                      !newLoanApplication.amount ||
                      !newLoanApplication.tenureMonths
                    }
                  >
                    <Icon icon="heroicons:paper-airplane" />
                    Submit Application
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Loan Modal */}
        {showEditModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon="heroicons:pencil-square" />
                    Edit Loan - {editLoan.employeeName}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Employee Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editLoan.employeeName}
                        onChange={(e) =>
                          setEditLoan({
                            ...editLoan,
                            employeeName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Employee ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editLoan.employeeId}
                        onChange={(e) =>
                          setEditLoan({
                            ...editLoan,
                            employeeId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Loan Type</label>
                      <select
                        className="form-select"
                        value={editLoan.loanType}
                        onChange={(e) =>
                          setEditLoan({ ...editLoan, loanType: e.target.value })
                        }
                      >
                        {loanTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Loan Amount (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editLoan.amount}
                        onChange={(e) =>
                          setEditLoan({ ...editLoan, amount: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={editLoan.interestRate}
                        onChange={(e) =>
                          setEditLoan({
                            ...editLoan,
                            interestRate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Tenure (Months)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editLoan.tenureMonths}
                        onChange={(e) =>
                          setEditLoan({
                            ...editLoan,
                            tenureMonths: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Monthly EMI (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editLoan.monthlyEMI}
                        onChange={(e) =>
                          setEditLoan({
                            ...editLoan,
                            monthlyEMI: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Amount Paid (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editLoan.amountPaid}
                        onChange={(e) =>
                          setEditLoan({
                            ...editLoan,
                            amountPaid: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={editLoan.status}
                        onChange={(e) =>
                          setEditLoan({ ...editLoan, status: e.target.value })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={handleUpdateLoan}
                  >
                    <Icon icon="heroicons:check-circle" />
                    Update Loan
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}
        {/* Prepayment Modal */}
        {showPrepaymentModal && selectedLoan && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon="heroicons:forward" />
                    Prepayment - {selectedLoan.loanId}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPrepaymentModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* First Card - Loan Details */}
                    <div className="col-12">
                      <div className="card border shadow-none">
                        <div className="card-body">
                          <h6 className="fw-semibold mb-3">Loan Details</h6>
                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <label className="form-label small">Loan Amount</label>
                              <div className="fw-bold text-primary fs-5">
                                {formatCurrency(selectedLoan.amount)}
                              </div>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label small">Amount Paid</label>
                              <div className="fw-bold text-success fs-5">
                                {formatCurrency(selectedLoan.amountPaid)}
                              </div>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label small">Outstanding</label>
                              <div className="fw-bold text-warning fs-5">
                                {formatCurrency(selectedLoan.amountPending)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <label className="form-label small fw-semibold">Prepayment Rules</label>
                            <div className="card bg-light">
                              <div className="card-body p-3">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-2">
                                      <span className="text-muted">Minimum Amount:</span>
                                      <div className="fw-bold">
                                        {formatCurrency(selectedLoan.prepaymentRules.minimumAmount)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-2">
                                      <span className="text-muted">Charges:</span>
                                      <div className="fw-bold">
                                        {selectedLoan.prepaymentRules.charges}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Second Card - Prepayment Calculation */}
                    <div className="col-12">
                      <div className="card border shadow-none">
                        <div className="card-body">
                          <h6 className="fw-semibold mb-3">Prepayment Calculation</h6>
                          <div className="mb-4">
                            <label className="form-label">Prepayment Amount (₹)</label>
                            <div className="input-group">
                              <span className="input-group-text">₹</span>
                              <input
                                type="number"
                                className="form-control"
                                value={prepaymentData.amount}
                                onChange={(e) =>
                                  setPrepaymentData({
                                    ...prepaymentData,
                                    amount: e.target.value,
                                    charges: 0,
                                    totalAmount: 0,
                                  })
                                }
                                placeholder="Enter prepayment amount"
                              />
                            </div>
                            <div className="small text-muted mt-2">
                              Minimum:{" "}
                              {formatCurrency(selectedLoan.prepaymentRules.minimumAmount)}
                            </div>
                          </div>

                          {prepaymentData.totalAmount > 0 && (
                            <div className="alert alert-info">
                              <div className="d-flex justify-content-between mb-2">
                                <span>Prepayment Amount:</span>
                                <span className="fw-bold">
                                  {formatCurrency(parseFloat(prepaymentData.amount))}
                                </span>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span>Charges (2%):</span>
                                <span className="fw-bold text-danger">
                                  {formatCurrency(prepaymentData.charges)}
                                </span>
                              </div>
                              <hr className="my-2" />
                              <div className="d-flex justify-content-between">
                                <span className="fw-bold">Total Payable:</span>
                                <span className="fw-bold text-primary fs-5">
                                  {formatCurrency(prepaymentData.totalAmount)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary d-flex align-items-center gap-2"
                    onClick={() => setShowPrepaymentModal(false)}
                  >
                    <Icon icon="heroicons:x-mark" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning d-flex align-items-center gap-2"
                    onClick={handlePrepaymentCalculate}
                    disabled={
                      !prepaymentData.amount ||
                      parseFloat(prepaymentData.amount) <= 0
                    }
                  >
                    <Icon icon="heroicons:calculator" />
                    Calculate Charges
                  </button>
                  <button
                    type="button"
                    className="btn btn-success d-flex align-items-center gap-2"
                    onClick={handleProcessPrepayment}
                    disabled={
                      !prepaymentData.amount || prepaymentData.totalAmount === 0
                    }
                  >
                    <Icon icon="heroicons:check-circle" />
                    Confirm Prepayment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Foreclosure Modal */}
        {showForeclosureModal && selectedLoan && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon="heroicons:lock-closed" />
                    Loan Foreclosure - {selectedLoan.loanId}
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowForeclosureModal(false);
                      setForeclosureConfirmed(false); // Reset checkbox when modal closes
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* First Card - Current Loan Status */}
                    <div className="col-12">
                      <div className="card border shadow-none">
                        <div className="card-body">
                          <h6 className="fw-semibold mb-3">Current Loan Status</h6>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label small">Outstanding Amount</label>
                              <div className="fw-bold text-warning fs-4">
                                {formatCurrency(selectedLoan.amountPending)}
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label small">Paid Months</label>
                              <div className="fw-bold fs-4">
                                {
                                  selectedLoan.emiSchedule.filter(
                                    (emi) => emi.status === "paid"
                                  ).length
                                }{" "}
                                of {selectedLoan.tenureMonths}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <label className="form-label small fw-semibold">Foreclosure Rules</label>
                            <div className="card bg-light">
                              <div className="card-body p-3">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-2">
                                      <span className="text-muted">Allowed After:</span>
                                      <div className="fw-bold">
                                        {selectedLoan.foreclosureOptions.allowedAfter} months
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-2">
                                      <span className="text-muted">Charges:</span>
                                      <div className="fw-bold">
                                        {selectedLoan.foreclosureOptions.charges}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Second Card - Foreclosure Calculation */}
                    <div className="col-12">
                      <div className="card border shadow-none">
                        <div className="card-body">
                          <h6 className="fw-semibold mb-3">Foreclosure Calculation</h6>

                          <div className="alert alert-warning mb-4">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <Icon icon="heroicons:exclamation-triangle" />
                              <h6 className="mb-0">Foreclosure Warning</h6>
                            </div>
                            <p className="small mb-0">
                              This action will close your loan account permanently. All outstanding dues must be cleared.
                            </p>
                          </div>

                          <div className="table-responsive">
                            <table className="table table-sm">
                              <tbody>
                                <tr>
                                  <td>Outstanding Principal</td>
                                  <td className="text-end fw-bold">
                                    {formatCurrency(foreclosureData.outstandingAmount)}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Foreclosure Charges (3%)</td>
                                  <td className="text-end fw-bold text-danger">
                                    {formatCurrency(foreclosureData.charges)}
                                  </td>
                                </tr>
                                <tr className="table-active">
                                  <td className="fw-bold">Total Payable</td>
                                  <td className="text-end fw-bold text-primary fs-5">
                                    {formatCurrency(foreclosureData.totalAmount)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Checkbox with tick mark */}
                          <div className="form-check mt-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="confirmForeclosure"
                              checked={foreclosureConfirmed}
                              onChange={(e) => setForeclosureConfirmed(e.target.checked)}
                              style={{
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                                position: "relative"
                              }}
                            />
                            <label
                              className="form-check-label small d-flex align-items-center gap-2"
                              htmlFor="confirmForeclosure"
                              style={{ cursor: "pointer" }}
                            >
                              <span>
                                I understand that foreclosure charges are applicable and this action cannot be undone.
                              </span>
                              {foreclosureConfirmed && (
                                <span className="text-success d-flex align-items-center">
                                  <Icon icon="heroicons:check-circle" style={{ width: "18px", height: "18px" }} />
                                </span>
                              )}
                            </label>
                          </div>

                          {/* Additional visual feedback when checked */}
                          {foreclosureConfirmed && (
                            <div className="alert alert-success mt-3 mb-0 p-2 d-flex align-items-center gap-2">
                              <Icon icon="heroicons:check-circle" className="text-success" />
                              <small className="mb-0">You have acknowledged the foreclosure terms.</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary d-flex align-items-center gap-2"
                    onClick={() => {
                      setShowForeclosureModal(false);
                      setForeclosureConfirmed(false); // Reset checkbox when modal closes
                    }}
                  >
                    <Icon icon="heroicons:x-mark" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger d-flex align-items-center gap-2"
                    onClick={handleProcessForeclosure}
                    disabled={!foreclosureConfirmed}
                    style={{
                      opacity: foreclosureConfirmed ? 1 : 0.6,
                      cursor: foreclosureConfirmed ? "pointer" : "not-allowed"
                    }}
                  >
                    <Icon icon="heroicons:check-circle" />
                    Confirm Foreclosure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedLoan && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon="heroicons:currency-rupee" />
                    Make Payment - {selectedLoan.loanId}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPaymentModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Payment Amount (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={paymentData.amount}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          amount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={paymentData.paymentDate}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          paymentDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      value={paymentData.paymentMethod}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          paymentMethod: e.target.value,
                        })
                      }
                    >
                      <option value="payroll_deduction">
                        Payroll Deduction
                      </option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Transaction ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={paymentData.transactionId}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          transactionId: e.target.value,
                        })
                      }
                      placeholder="Enter transaction ID"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Remarks</label>
                    <textarea
                      className="form-control"
                      value={paymentData.remarks}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          remarks: e.target.value,
                        })
                      }
                      rows="2"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleProcessPayment}
                  >
                    <Icon icon="heroicons:check-circle" className="me-2" />
                    Process Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EMI Schedule Modal */}
        {showEMIScheduleModal && selectedLoan && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon="heroicons:calendar-days" />
                    EMI Schedule - {selectedLoan.loanId}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEMIScheduleModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Due Date</th>
                          <th>Amount (₹)</th>
                          <th>Status</th>
                          <th>Payment Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedLoan.emiSchedule &&
                          selectedLoan.emiSchedule.length > 0 ? (
                          selectedLoan.emiSchedule.map((emi, index) => (
                            <tr key={index}>
                              <td>{emi.month}</td>
                              <td>{formatDate(emi.dueDate)}</td>
                              <td>{formatCurrency(emi.amount)}</td>
                              <td>
                                <span
                                  className={`badge ${emi.status === "paid"
                                    ? "bg-success"
                                    : emi.status === "due"
                                      ? "bg-warning"
                                      : "bg-secondary"
                                    }`}
                                >
                                  {emi.status}
                                </span>
                              </td>
                              <td>
                                {emi.paymentDate
                                  ? formatDate(emi.paymentDate)
                                  : "--"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center text-muted">
                              No EMI schedule available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEMIScheduleModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Disbursement Modal */}
        {showDisbursementModal && selectedLoan && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon="heroicons:arrow-up-tray" />
                    Disburse Loan - {selectedLoan.loanId}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDisbursementModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Disbursement Method</label>
                    <select
                      className="form-select"
                      value={disbursementData.method}
                      onChange={(e) =>
                        setDisbursementData({
                          ...disbursementData,
                          method: e.target.value,
                        })
                      }
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cheque">Cheque</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={disbursementData.bankDetails.bankName}
                      onChange={(e) =>
                        setDisbursementData({
                          ...disbursementData,
                          bankDetails: {
                            ...disbursementData.bankDetails,
                            bankName: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Account Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={disbursementData.bankDetails.accountNumber}
                      onChange={(e) =>
                        setDisbursementData({
                          ...disbursementData,
                          bankDetails: {
                            ...disbursementData.bankDetails,
                            accountNumber: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Disbursement Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={disbursementData.disbursementDate}
                      onChange={(e) =>
                        setDisbursementData({
                          ...disbursementData,
                          disbursementDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Transaction ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={disbursementData.transactionId}
                      onChange={(e) =>
                        setDisbursementData({
                          ...disbursementData,
                          transactionId: e.target.value,
                        })
                      }
                      placeholder="Enter transaction ID"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDisbursementModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleProcessDisbursement}
                  >
                    <Icon icon="heroicons:check-circle" className="me-2" />
                    Process Disbursement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Modal - Updated heading size */}
        {showCertificateModal && selectedLoan && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon="heroicons:document-text" />
                    Loan Repayment Completion Certificate
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCertificateModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="certificate border p-5">
                    <div className="text-center mb-4">
                      {/* Changed from h3 to h4 and reduced font size */}
                      <h6 className="fw-bold text-primary">
                        LOAN REPAYMENT COMPLETION CERTIFICATE
                      </h6>
                      <p className="text-muted">
                        Certificate No:{" "}
                        {selectedLoan.documents.certificate.certificateNumber ||
                          "CERT" + Date.now()}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p>
                        This is to certify that{" "}
                        <strong>{selectedLoan.employeeName}</strong> (Employee
                        ID: {selectedLoan.employeeId})
                      </p>
                      <p>
                        has successfully completed the repayment of the loan
                        with the following details:
                      </p>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <p>
                          <strong>Loan ID:</strong> {selectedLoan.loanId}
                        </p>
                        <p>
                          <strong>Loan Type:</strong> {selectedLoan.loanType}
                        </p>
                        <p>
                          <strong>Loan Amount:</strong>{" "}
                          {formatCurrency(selectedLoan.amount)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Start Date:</strong>{" "}
                          {formatDate(selectedLoan.startDate)}
                        </p>
                        <p>
                          <strong>Completion Date:</strong>{" "}
                          {formatDate(new Date().toISOString().split("T")[0])}
                        </p>
                        <p>
                          <strong>Total Interest Paid:</strong>{" "}
                          {formatCurrency(
                            calculateInterest(
                              selectedLoan.amount,
                              selectedLoan.interestRate,
                              selectedLoan.tenureMonths
                            )
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p>
                        The loan account has been closed and all dues have been
                        cleared.
                      </p>
                      <p className="fw-bold">
                        No dues certificate is hereby issued.
                      </p>
                    </div>

                    <div className="row mt-5">
                      <div className="col-md-6">
                        <p className="border-top pt-3">Authorized Signatory</p>
                        <p>
                          <strong>Finance Department</strong>
                        </p>
                      </div>
                      <div className="col-md-6 text-end">
                        <p className="border-top pt-3">
                          Date:{" "}
                          {formatDate(new Date().toISOString().split("T")[0])}
                        </p>
                        <p>
                          <strong>Company Seal</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCertificateModal(false)}
                  >
                    Close
                  </button>
                  {!selectedLoan.documents.certificate.generated && (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleGenerateCertificate(selectedLoan)}
                    >
                      <Icon icon="heroicons:check-circle" className="me-2" />
                      Generate Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loan Details Modal (existing) */}
        {showModal && selectedLoan && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", paddingLeft: "400px" }}
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon="heroicons:document-text" />
                    Loan Details - {selectedLoan.loanId}
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <ul
                    className="nav nav-tabs"
                    id="loanDetailsTab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="basic-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#basic"
                        type="button"
                        role="tab"
                      >
                        Basic Details
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="approval-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#approval"
                        type="button"
                        role="tab"
                      >
                        Approval Workflow
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="documents-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#documents"
                        type="button"
                        role="tab"
                      >
                        Documents
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="disbursement-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#disbursement"
                        type="button"
                        role="tab"
                      >
                        Disbursement
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content p-3" id="loanDetailsTabContent">
                    {/* Basic Details Tab */}
                    <div
                      className="tab-pane fade show active"
                      id="basic"
                      role="tabpanel"
                    >
                      <div className="row g-3">
                        <div className="col-md-6">
                          <h6 className="fw-semibold mb-3">Loan Information</h6>
                          <div className="mb-2">
                            <label className="form-label small fw-semibold">
                              Loan ID
                            </label>
                            <p className="form-control-plaintext">
                              {selectedLoan.loanId}
                            </p>
                          </div>
                          <div className="mb-2">
                            <label className="form-label small fw-semibold">
                              Loan Type
                            </label>
                            <p className="form-control-plaintext">
                              {getLoanTypeBadge(selectedLoan.loanType)}
                            </p>
                          </div>
                          <div className="mb-2">
                            <label className="form-label small fw-semibold">
                              Total Amount
                            </label>
                            <p className="form-control-plaintext text-primary fw-bold">
                              {formatCurrency(selectedLoan.amount)}
                            </p>
                          </div>
                          <div className="mb-2">
                            <label className="form-label small fw-semibold">
                              Interest Rate
                            </label>
                            <p className="form-control-plaintext">
                              {selectedLoan.interestRate}%
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <h6 className="fw-semibold mb-3">
                            Employee Information
                          </h6>
                          <div className="mb-2">
                            <label className="form-label small fw-semibold">
                              Employee Name
                            </label>
                            <p className="form-control-plaintext">
                              {selectedLoan.employeeName}
                            </p>
                          </div>
                          <div className="mb-2">
                            <label className="form-label small fw-semibold">
                              Employee ID
                            </label>
                            <p className="form-control-plaintext">
                              {selectedLoan.employeeId}
                            </p>
                          </div>
                          <div className="mb-2">
                            <label className="form-label small fw-semibold">
                              Department
                            </label>
                            <p className="form-control-plaintext">
                              {selectedLoan.department}
                            </p>
                          </div>
                          <div className="mb-2">
                            <label className="form-label small fw-semibold">
                              Designation
                            </label>
                            <p className="form-control-plaintext">
                              {selectedLoan.designation}
                            </p>
                          </div>
                          <div className="mb-2">
                            <label className="form-label small fw-semibold">
                              Status
                            </label>
                            <p className="form-control-plaintext">
                              {getStatusBadge(selectedLoan.status)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="row g-3 mt-3">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Start Date
                          </label>
                          <p className="form-control-plaintext">
                            {formatDate(selectedLoan.startDate)}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            End Date
                          </label>
                          <p className="form-control-plaintext">
                            {formatDate(selectedLoan.endDate)}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Tenure
                          </label>
                          <p className="form-control-plaintext">
                            {selectedLoan.tenureMonths} months
                          </p>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Monthly EMI
                          </label>
                          <p className="form-control-plaintext text-success fw-bold">
                            {formatCurrency(selectedLoan.monthlyEMI)}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Amount Paid
                          </label>
                          <p className="form-control-plaintext text-info fw-bold">
                            {formatCurrency(selectedLoan.amountPaid)}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Amount Pending
                          </label>
                          <p className="form-control-plaintext text-warning fw-bold">
                            {formatCurrency(selectedLoan.amountPending)}
                          </p>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label fw-semibold">
                            Next Due Date
                          </label>
                          <p className="form-control-plaintext">
                            {formatDate(selectedLoan.nextDueDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Approval Workflow Tab */}
                    <div
                      className="tab-pane fade"
                      id="approval"
                      role="tabpanel"
                    >
                      <h6 className="fw-semibold mb-3">Approval Workflow</h6>
                      <div className="timeline">
                        {selectedLoan.approvalWorkflow &&
                          selectedLoan.approvalWorkflow.map(
                            (approval, index) => (
                              <div key={index} className="timeline-item mb-3">
                                <div className="d-flex">
                                  <div className="timeline-marker">
                                    <Icon
                                      icon={
                                        approval.status === "approved"
                                          ? "heroicons:check-circle"
                                          : approval.status === "rejected"
                                            ? "heroicons:x-circle"
                                            : "heroicons:clock"
                                      }
                                      className={`text-${approval.status === "approved"
                                        ? "success"
                                        : approval.status === "rejected"
                                          ? "danger"
                                          : "warning"
                                        }`}
                                    />
                                  </div>
                                  <div className="timeline-content ms-3">
                                    <h6 className="mb-1 text-capitalize">
                                      {approval.level}
                                    </h6>
                                    <p className="mb-1">
                                      <span
                                        className={`badge bg-${approval.status === "approved"
                                          ? "success"
                                          : approval.status === "rejected"
                                            ? "danger"
                                            : "secondary"
                                          }`}
                                      >
                                        {approval.status}
                                      </span>
                                    </p>
                                    {approval.approvedBy && (
                                      <p className="small text-muted mb-1">
                                        Approved by: {approval.approvedBy}
                                      </p>
                                    )}
                                    {approval.date && (
                                      <p className="small text-muted">
                                        Date: {formatDate(approval.date)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                    {/* Documents Tab */}
                    <div
                      className="tab-pane fade"
                      id="documents"
                      role="tabpanel"
                    >
                      <h6 className="fw-semibold mb-3">Documents Status</h6>

                      <div className="d-flex flex-column gap-3">
                        {selectedLoan.documents &&
                          Object.entries(selectedLoan.documents).map(([doc, status]) => {
                            const isCompleted =
                              status.verified || status.generated || status.signed;

                            return (
                              <div key={doc} className="card shadow-sm">
                                <div className="card-body d-flex justify-content-between align-items-center">

                                  {/* Left content */}
                                  <div>
                                    <h6 className="mb-1">
                                      {getDocumentLabel(doc)}
                                    </h6>

                                    <span
                                      className={`badge ${isCompleted ? "bg-success" : "bg-warning"
                                        }`}
                                    >
                                      {status.verified
                                        ? "Verified"
                                        : status.generated
                                          ? "Generated"
                                          : status.signed
                                            ? "Signed"
                                            : "Pending"}
                                    </span>
                                  </div>

                                  {/* View Button */}
                                  <button
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                    onClick={() => handleViewDocument(doc)}
                                  >
                                    <Icon icon="heroicons:eye" />
                                    View
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>



                    {/* Disbursement Tab */}
                    <div
                      className="tab-pane fade"
                      id="disbursement"
                      role="tabpanel"
                    >
                      <h6 className="fw-semibold mb-3">Disbursement Details</h6>
                      {selectedLoan.disbursement &&
                        selectedLoan.disbursement.status === "completed" ? (
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Status
                            </label>
                            <p className="form-control-plaintext">
                              <span className="badge bg-success">
                                Completed
                              </span>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Method
                            </label>
                            <p className="form-control-plaintext">
                              {selectedLoan.disbursement.method}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Bank Name
                            </label>
                            <p className="form-control-plaintext">
                              {selectedLoan.disbursement.bankDetails.bankName}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Account Number
                            </label>
                            <p className="form-control-plaintext">
                              {
                                selectedLoan.disbursement.bankDetails
                                  .accountNumber
                              }
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Disbursement Date
                            </label>
                            <p className="form-control-plaintext">
                              {formatDate(
                                selectedLoan.disbursement.disbursementDate
                              )}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Transaction ID
                            </label>
                            <p className="form-control-plaintext">
                              {selectedLoan.disbursement.transactionId}
                            </p>
                          </div>
                          <div className="col-md-12">
                            <label className="form-label fw-semibold">
                              Disbursement Amount
                            </label>
                            <p className="form-control-plaintext text-primary fw-bold">
                              {formatCurrency(
                                selectedLoan.disbursement.disbursementAmount
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="alert alert-warning">
                          Disbursement not completed yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Document Preview Modal */}
        {showDocModal && (
          <>
            <div className="modal-backdrop fade show" />

            <div
              className="modal fade show d-block"
              style={{ zIndex: 1200 }}
            >
              <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content rounded-3">

                  <div className="modal-header">
                    <h6 className="modal-title">
                      {getDocumentLabel(activeDoc)}
                    </h6>

                    <button
                      className="btn-close"
                      onClick={() => setShowDocModal(false)}
                    />
                  </div>

                  <div className="modal-body text-center">
                    <Icon
                      icon="heroicons:document-text"
                      width="40"
                      className="text-primary mb-2"
                    />
                    <p className="mb-0 small text-muted">
                      Document preview will appear here.
                    </p>
                  </div>

                  <div className="modal-footer justify-content-center">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowDocModal(false)}
                    >
                      Close
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </>
  );
};

export default LoansAdvances;