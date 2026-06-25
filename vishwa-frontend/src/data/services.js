import { FiCamera, FiTool, FiWifi, FiMonitor, FiHardDrive, FiShield, FiDatabase, FiAlertCircle, FiGlobe, FiFileText } from 'react-icons/fi';

export const services = [
  {
    id: 1,
    title: 'CCTV Installation',
    description: 'Complete end-to-end CCTV installation with HD/IP cameras, DVR/NVR setup, structured cabling, and remote viewing configuration for homes and businesses.',
    icon: 'FiCamera',
    features: ['HD & IP Cameras', 'DVR/NVR Setup', 'Mobile Viewing', 'Night Vision'],
  },
  {
    id: 2,
    title: 'CCTV Maintenance',
    description: 'Regular maintenance and servicing of existing CCTV systems including lens cleaning, cable inspection, recording health checks, and firmware updates.',
    icon: 'FiTool',
    features: ['Lens Cleaning', 'Cable Check', 'Storage Health', 'Firmware Updates'],
  },
  {
    id: 3,
    title: 'IP Camera Solutions',
    description: 'Advanced IP-based surveillance with PoE cameras, cloud storage integration, AI-powered analytics, and enterprise-grade network security.',
    icon: 'FiWifi',
    features: ['PoE Cameras', 'Cloud Storage', 'AI Analytics', 'Network Security'],
  },
  {
    id: 4,
    title: 'Networking Solutions',
    description: 'Professional LAN/WAN setup, structured cabling, router configuration, firewall deployment, and network performance optimization for offices.',
    icon: 'FiGlobe',
    features: ['LAN/WAN Setup', 'Structured Cabling', 'Firewall Config', 'Performance Tuning'],
  },
  {
    id: 5,
    title: 'Computer Hardware Support',
    description: 'Expert hardware troubleshooting, component upgrades, system assembly, peripheral setup, and performance tuning for desktops and workstations.',
    icon: 'FiMonitor',
    features: ['Hardware Repair', 'Component Upgrades', 'System Assembly', 'Diagnostics'],
  },
  {
    id: 6,
    title: 'Biometric Systems',
    description: 'Installation and configuration of fingerprint, face recognition, and iris scanners for access control, attendance tracking, and security integration.',
    icon: 'FiShield',
    features: ['Fingerprint Scanners', 'Face Recognition', 'Access Control', 'Attendance'],
  },
  {
    id: 7,
    title: 'Data Backup Solutions',
    description: 'Automated backup systems, NAS/SAN deployment, disaster recovery planning, cloud backup integration, and data redundancy solutions.',
    icon: 'FiDatabase',
    features: ['Automated Backups', 'NAS/SAN Setup', 'Disaster Recovery', 'Cloud Sync'],
  },
  {
    id: 8,
    title: 'Troubleshooting',
    description: 'Rapid on-site and remote diagnostics for system failures, network outages, software issues, virus removal, and performance degradation.',
    icon: 'FiAlertCircle',
    features: ['On-site Support', 'Remote Diagnostics', 'Virus Removal', 'System Recovery'],
  },
  {
    id: 9,
    title: 'Internet Support',
    description: 'ISP coordination, broadband setup, WiFi coverage optimization, speed troubleshooting, and seamless connectivity for multi-floor offices.',
    icon: 'FiHardDrive',
    features: ['Broadband Setup', 'WiFi Optimization', 'Speed Testing', 'ISP Coordination'],
  },
  {
    id: 10,
    title: 'AMC Maintenance',
    description: 'Annual Maintenance Contracts with scheduled visits, priority support, spare parts coverage, preventive maintenance, and detailed reporting.',
    icon: 'FiFileText',
    features: ['Scheduled Visits', 'Priority Support', 'Spare Parts', 'Monthly Reports'],
  },
];

export const serviceIcons = {
  FiCamera, FiTool, FiWifi, FiMonitor, FiHardDrive, FiShield, FiDatabase, FiAlertCircle, FiGlobe, FiFileText,
};
