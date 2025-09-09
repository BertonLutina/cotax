import moment from "moment";
import "moment/locale/fr"; // 👈 important for French locale
import {

  ArrowDownCircleIcon,
  ArrowPathIcon,
  ArrowUpCircleIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  ChartPieIcon,
  ClockIcon,
  CreditCardIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  HomeModernIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export const getIconStatus = (status) => {
  switch (status) {
    case "Paid" : 
    return ArrowUpCircleIcon;
    case "Overdue" : 
    return ArrowDownCircleIcon;
    case "ClockIcon" : 
    return ArrowDownCircleIcon;
    default:
      return ArrowUpCircleIcon;
  }
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function setStorage(cle, val) {
  localStorage.setItem(cle, val);
}

export function getStorage(key, datatype = "string") {
  let data = localStorage.getItem(key);

  if (data === null) return null; // nothing saved

  switch (datatype) {
    case "number":
      return Number(data); // "123" -> 123
    case "boolean":
      return data === "true"; // only true string becomes true
    case "json":
      try {
        return JSON.parse(data); // safely parse objects/arrays
      } catch (e) {
        console.error("Invalid JSON in localStorage for key:", key, e);
        return null;
      }
    case "date":
      return new Date(data); // convert string back to Date
    case "string":
    default:
      return data; // fallback
  }
}

export function formatCDF(amount) {
  const val = amount * 2800;
  return new Intl.NumberFormat("fr-CD", {
    style: "currency",
    currency: "CDF",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatUSD(amount) {

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2, // force at least 2 decimals
    maximumFractionDigits: 2,
  }).format(amount);
}

export const groupTransactionsByDay = (data) => {
  const grouped = data.reduce((acc, item) => {
    const dateKey = moment(item?.created_at).local("fr").format("YYYY-MM-DD");
    const dateLabel = moment(item?.created_at).local("fr").calendar(null, {
      sameDay: "[Aujourd'hui]",
      lastDay: "[Hier]",
      lastWeek: "[La Semaine passee]",
      nextDay: "[Demain]",
      sameElse: "DD/MM/YYYY",
      nextWeek:"[La Semaine prochaine]",

    });

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateLabel,
        dateTime: dateKey,
        transactions: [],
      };
    }

    acc[dateKey].transactions.push({
      id: item.id,
      invoiceNumber: item.invoice_number,
      href: item.href || "#",
      amount: `${item.amount} ${item.currency}`,
      tax: item.tax || null,
      status: item.status,
      client: item.client,
      description: item.description,
      icon: getIconStatus(item.status) || null, // you can map status -> icon here
    });

    return acc;
  }, {});

  // Return as array, sorted by date descending
  return Object.values(grouped).sort(
    (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
  );
};
