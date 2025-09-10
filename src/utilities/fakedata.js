import {

  ArrowDownCircleIcon,
  ArrowPathIcon,
  ArrowUpCircleIcon,
  BuildingOffice2Icon,
  ClockIcon,
  DocumentIcon,
  HomeIcon,
  HomeModernIcon,
} from '@heroicons/react/24/outline'
import moment from 'moment'

import { FaCcVisa, FaCcMastercard, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

const payer = 427870.00
const impaye = 245988.00


export const navigation = (client) => (client === 1) ? [
    { name: 'Tableau de bord', href: '/', icon: HomeIcon, current: true },
    { name: "Les déclarations de l'IRL", href: '/declarations', icon: DocumentIcon, current: false},
   //{ name: 'Locations', href: '/locations', icon: BuildingOffice2Icon, current: false },
    //{ name: 'GOV', href: '/gov', icon: BuildingLibraryIcon, current: false },
    { name: 'Societé', href: '/entreprise', icon:  HomeModernIcon , current: false },

   // { name: 'Civil', href: '/civil', icon: UsersIcon, current: false },
    //{ name: 'Dossiers', href: '/dossiers', icon: FolderIcon, current: false },
    //{ name: 'Rapport', href: '/rapport', icon: ChartPieIcon, current: false },
  ] : [
    { name: "Déclaration de l'IRL", href: '/declaration', icon: BuildingOffice2Icon, current: false },
  ]
  export const teams = (client) => [
    { id: 1, name: 'Approuvée', href: '/approved', initial: 'A', current: false, textcolor: 'text-green-700', color:'bg-green-100' },
    { id: 2, name: "En Cours d’Approvement", href: '/pending', initial: 'ECA', current: false,textcolor: 'text-green-700', color:'bg-green-100' },
    { id: 3, name: 'Non Approuvée', href: '/notapproved', initial: 'NA', current: false,textcolor: 'text-red-700', color:'bg-red-100' },
  ] 


  export const stats = [
    { name: 'Nombre de societés', value: '200,567', change: '+4.75%', changeType: 'positive' },
    { name: 'Taxe payé', value: `$${payer}`, change: '+54.02%', changeType: 'negative' },
    { name: 'Taxe impayé', value: `$${impaye}`, change: '-1.39%', changeType: 'negative' },
    { name: 'Balances', value: `$${(payer-impaye)}`, change: '+10.18%', changeType: 'positieve' },
  ]

  export const days = [
    {
      date: "Aujourd'hui",
      dateTime: moment().format('YYYY-MM-DD'),
      transactions: [
        {
          id: 1,
          invoiceNumber: '00012',
          href: '#',
          amount: '$7,600.00 USD',
          tax: '$500.00',
          status: 'Paid',
          client: 'Reform',
          description: 'Website redesign',
          icon: ArrowUpCircleIcon,
        },
       /*  {
          id: 2,
          invoiceNumber: '00011',
          href: '#',
          amount: '$10,000.00 USD',
          status: 'Withdraw',
          client: 'Tom Cook',
          description: 'Salary',
          icon: ArrowDownCircleIcon,
        }, */
        {
          id: 2,
          invoiceNumber: '00013',
          href: '#',
          amount: '$12,450.00 USD',
          tax: '$850.00',
          status: 'Pending',
          client: 'Acme Corp',
          description: 'Mobile app development',
          icon: ArrowDownCircleIcon,
        },
        {
          id: 3,
          invoiceNumber: '00014',
          href: '#',
          amount: '$3,200.00 USD',
          tax: '$200.00',
          status: 'Overdue',
          client: 'Globex',
          description: 'Marketing campaign',
          icon: ClockIcon,
        },
        {
          id: 4,
          invoiceNumber: '00015',
          href: '#',
          amount: '$18,900.00 USD',
          tax: '$1,200.00',
          status: 'Paid',
          client: 'Stark Industries',
          description: 'Cloud infrastructure setup',
          icon: ArrowUpCircleIcon,
        },
        {
          id: 5,
          invoiceNumber: '00016',
          href: '#',
          amount: '$980.00 USD',
          tax: '$70.00',
          status: 'Pending',
          client: 'Wayne Enterprises',
          description: 'Consulting services',
          icon: ArrowDownCircleIcon,
        },
        {
          id: 6,
          invoiceNumber: '00017',
          href: '#',
          amount: '$5,600.00 USD',
          tax: '$400.00',
          status: 'Paid',
          client: 'Initech',
          description: 'Software license renewal',
          icon: ArrowUpCircleIcon,
        },
        {
          id: 7,
          invoiceNumber: '00018',
          href: '#',
          amount: '$22,300.00 USD',
          tax: '$1,500.00',
          status: 'Overdue',
          client: 'Umbrella Corp',
          description: 'Security system upgrade',
          icon: ClockIcon,
        },
        {
          id: 8,
          invoiceNumber: '00009',
          href: '#',
          amount: '$2,000.00 USD',
          tax: '$130.00',
          status: 'Overdue',
          client: 'Tuple',
          description: 'Logo design',
          icon: ArrowPathIcon,
        },
        
      ],
    },
    {
      date: 'Hier',
      dateTime: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      transactions: [
        {
          id: 9,
          invoiceNumber: '00010',
          href: '#',
          amount: '$14,000.00 USD',
          tax: '$900.00',
          status: 'Paid',
          client: 'SavvyCal',
          description: 'Website redesign',
          icon: ArrowUpCircleIcon,
        },
        {
          id: 10,
          invoiceNumber: '00011',
          href: '#',
          amount: '$8,750.00 USD',
          tax: '$600.00',
          status: 'Pending',
          client: 'Linear',
          description: 'Product launch campaign',
          icon: ArrowDownCircleIcon,
        },
        {
          id: 11,
          invoiceNumber: '00012',
          href: '#',
          amount: '$21,300.00 USD',
          tax: '$1,400.00',
          status: 'Paid',
          client: 'Notion',
          description: 'Custom API integration',
          icon: ArrowUpCircleIcon,
        },
        {
          id: 12,
          invoiceNumber: '00013',
          href: '#',
          amount: '$4,500.00 USD',
          tax: '$300.00',
          status: 'Overdue',
          client: 'Figma',
          description: 'UX/UI consulting',
          icon: ClockIcon,
        },
        {
          id: 13,
          invoiceNumber: '00014',
          href: '#',
          amount: '$16,900.00 USD',
          tax: '$1,050.00',
          status: 'Pending',
          client: 'Stripe',
          description: 'Payment gateway integration',
          icon: ArrowDownCircleIcon,
        },
        {
          id: 14,
          invoiceNumber: '00015',
          href: '#',
          amount: '$2,800.00 USD',
          tax: '$180.00',
          status: 'Paid',
          client: 'Loom',
          description: 'Video production',
          icon: ArrowUpCircleIcon,
        },
        {
          id: 15,
          invoiceNumber: '00016',
          href: '#',
          amount: '$11,200.00 USD',
          tax: '$750.00',
          status: 'Overdue',
          client: 'Zapier',
          description: 'Automation workflow setup',
          icon: ClockIcon,
        }
        
      ],
    },
  ]

  export const clients = [
    {
      id: 1,
      name: 'Tuple',
      imageUrl: 'https://tailwindcss.com/plus-assets/img/logos/48x48/tuple.svg',
      lastInvoice: { date: 'December 13, 2022', dateTime: '2022-12-13', amount: '$2,000.00', status: 'Overdue' },
    },
    {
      id: 2,
      name: 'SavvyCal',
      imageUrl: 'https://tailwindcss.com/plus-assets/img/logos/48x48/savvycal.svg',
      lastInvoice: { date: 'January 22, 2023', dateTime: '2023-01-22', amount: '$14,000.00', status: 'Paid' },
    },
    {
      id: 3,
      name: 'Reform',
      imageUrl: 'https://tailwindcss.com/plus-assets/img/logos/48x48/reform.svg',
      lastInvoice: { date: 'January 23, 2023', dateTime: '2023-01-23', amount: '$7,600.00', status: 'Paid' },
    },
  ]

  export const statuses = {
    Paid: 'text-green-700 bg-green-50 ring-green-600/20',
    Pending: 'text-blue-700 bg-blue-50 ring-blue-600/20',
    Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
  }

 export const payments = [
    { name: "Visa", icon: <FaCcVisa className="text-blue-600 w-10 h-10" /> },
    { name: "Mastercard", icon: <FaCcMastercard className="text-red-600 w-10 h-10" /> },
    { name: "M-Pesa", icon: <img alt='logo M-Pesa' src={require('../assets/bank/mpesa.png')} className="w-20 h-10" /> },
    { name: "Orange Money", icon: <img alt='logo orange money' src={require('../assets/bank/orange-money-logo-png.png')} className="w-10 h-10" /> },
    { name: "Cheque", icon: <FaCreditCard className="text-gray-700 w-10 h-10" /> },
    { name: "Espèce", icon: <FaMoneyBillWave className="text-green-500 w-10 h-10" /> },
  ];


  export const status_payement = {
    1 : "Payee",
    2 : "Non Payee",
  }

  export const status_approv = {
    0 : "En Attente" ,
    1 : "Approuvée",
    2 : "Non Approuvée",
  }