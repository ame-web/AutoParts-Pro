import { useState, useMemo, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Car,
  LayoutDashboard,
  Package,
  CircleDollarSign,
  AlertTriangle,
  Users,
  Warehouse,
  Headset,
  Star,
  Plus,
  QrCode,
  Download,
  FileText,
  Send,
  ChevronDown,
  X,
  CheckCircle2,
  Calendar,
  Shield,
  Clock,
  Coins,
  Search,
  Check,
  Building,
  User,
  ArrowRightLeft,
  Settings,
  RefreshCw,
  Menu
} from 'lucide-react';
import { Language, translations } from './translations';
import {
  Vehicle,
  Incident,
  Customer,
  Part,
  Order,
  TeamMember,
  faqs,
  supportFaqs
} from './data';

export default function App() {
  // Locale State
  const [lang, setLang] = useState<Language>('en');

  // Navigation State (Client tabs)
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Loading State
  const [loading, setLoading] = useState<boolean>(true);

  // Core Data States (Synced from server.ts)
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Subscription States
  const [activeSubscription, setActiveSubscription] = useState<string>('Pro');
  const [subscriptionDaysRemaining, setSubscriptionDaysRemaining] = useState<number>(214);

  // Financial States
  const [walletTotal, setWalletTotal] = useState<number>(3847);
  const [walletAvailable, setWalletAvailable] = useState<number>(1200);
  const [walletPending, setWalletPending] = useState<number>(650);

  // Search & Filters state (Client Dashboard)
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [customerFilterTier, setCustomerFilterTier] = useState<string>('');

  // Modals visibility state
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState<boolean>(false);
  const [isAddPartOpen, setIsAddPartOpen] = useState<boolean>(false);
  const [isAddIncidentOpen, setIsAddIncidentOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);

  // Dynamic Form Field states
  const [newPlate, setNewPlate] = useState<string>('');
  const [newModel, setNewModel] = useState<string>('');

  const [newPartName, setNewPartName] = useState<string>('');
  const [newPartModel, setNewPartModel] = useState<string>('');
  const [newPartStock, setNewPartStock] = useState<number>(100);
  const [newPartPrice, setNewPartPrice] = useState<number>(25);

  const [newIncidentDesc, setNewIncidentDesc] = useState<string>('');
  const [newIncidentPlate, setNewIncidentPlate] = useState<string>('');
  const [newIncidentStatus, setNewIncidentStatus] = useState<'Closed' | 'Processing' | 'Under Review'>('Under Review');

  const [withdrawAmount, setWithdrawAmount] = useState<string>('150');

  // Support Form Input State
  const [supportCategory, setSupportCategory] = useState<string>('sp-opt1');
  const [supportText, setSupportText] = useState<string>('');

  // Expanded FAQs Map
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});

  // Advanced Demo Mode Premium States
  const [isVipMember, setIsVipMember] = useState<boolean>(false);
  const [isVipCheckoutOpen, setIsVipCheckoutOpen] = useState<boolean>(false);
  const [qualificationStatus, setQualificationStatus] = useState<'None' | 'Submitting' | 'Approved'>('None');
  const [qualificationFile, setQualificationFile] = useState<string | null>(null);
  const [isAddVehicleScanMode, setIsAddVehicleScanMode] = useState<boolean>(false);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(false);
  const [isCorrectionMode, setIsCorrectionMode] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: 1, sender: 'bot', text: 'Hello! I am your AutoParts Pro Digital Intelligent Agent. How can I assist you today?', time: 'Just now' }
  ]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([
    { id: 'W-902', amount: 150, date: '2026-06-02', status: 'Completed' },
    { id: 'W-901', amount: 200, date: '2026-05-28', status: 'Completed' }
  ]);
  const [walletFrozen, setWalletFrozen] = useState<number>(125);

  // Feedback Notification toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile responsive sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Fetch / Sync Data from Express server.ts
  const syncData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        setVehicles(data.vehicles);
        setIncidents(data.incidents);
        setParts(data.parts);
        setCustomers(data.customers);
        setOrders(data.orders);
        setTeamMembers(data.teamMembers);
        
        setActiveSubscription(data.activeSubscription);
        setSubscriptionDaysRemaining(data.subscriptionDaysRemaining);
        setWalletTotal(data.walletTotal);
        setWalletAvailable(data.walletAvailable);
        setWalletPending(data.walletPending);

        // Intelligently bind selected vehicle if unset
        if (data.vehicles && data.vehicles.length > 0) {
          setSelectedVehicle((prev) => {
            const matches = data.vehicles.find((v: Vehicle) => v.plate === prev?.plate);
            return matches || data.vehicles[0];
          });
          setNewIncidentPlate((prevPlate) => {
            if (prevPlate) return prevPlate;
            return data.vehicles[0].plate;
          });
        }
      }
    } catch (e) {
      console.error("Error communicating with central Express Server:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncData();
  }, []);

  // Translation helper
  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  // Trigger toasts
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Accordion toggle helper
  const toggleFaq = (id: string) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Action: Add Vehicle to Server
  const handleAddVehicle = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim() || !newModel.trim()) {
      triggerToast(t('toast-fail'));
      return;
    }
    try {
      const iconChoices = ['🚗', '🚙', '🚐', '🏎️', '🚐'];
      const randomIcon = iconChoices[Math.floor(Math.random() * iconChoices.length)];
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plate: newPlate.toUpperCase(),
          model: newModel,
          icon: randomIcon
        })
      });
      if (res.ok) {
        setNewPlate('');
        setNewModel('');
        setIsAddVehicleOpen(false);
        await syncData();
        triggerToast(`Vehicle ${newPlate.toUpperCase()} bound successfully!`);
      } else {
        triggerToast("Failed to binding vehicle on server.");
      }
    } catch (err) {
      triggerToast("Network error submitting vehicle details.");
    }
  };

  // Action: Add Part to Server
  const handleAddPart = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim() || !newPartModel.trim() || newPartStock < 0 || newPartPrice <= 0) {
      triggerToast(t('toast-fail'));
      return;
    }
    try {
      const res = await fetch('/api/parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPartName,
          model: newPartModel,
          stock: newPartStock,
          price: newPartPrice
        })
      });
      if (res.ok) {
        setNewPartName('');
        setNewPartModel('');
        setNewPartStock(100);
        setNewPartPrice(25);
        setIsAddPartOpen(false);
        await syncData();
        triggerToast(`Part ${newPartName} added to stock database.`);
      }
    } catch (err) {
      triggerToast("Network error adding stock.");
    }
  };

  // Action: Submit Incident to Server
  const handleAddIncident = async (e: FormEvent) => {
    e.preventDefault();
    if (!newIncidentDesc.trim()) {
      triggerToast(t('toast-fail'));
      return;
    }
    const assocPlate = newIncidentPlate || (vehicles[0]?.plate || '');
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newIncidentDesc,
          vehiclePlate: assocPlate,
          status: newIncidentStatus
        })
      });
      if (res.ok) {
        setNewIncidentDesc('');
        setIsAddIncidentOpen(false);
        await syncData();
        triggerToast(`Incident reported successfully.`);
      }
    } catch (e) {
      triggerToast("Network error creating report.");
    }
  };

  // Action: Withdraw Amount to Server
  const handleWithdraw = async (e: FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(withdrawAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      triggerToast(t('toast-fail'));
      return;
    }
    if (parsedAmount > walletAvailable) {
      triggerToast(`Insufficient available funds to withdraw $${parsedAmount}`);
      return;
    }
    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parsedAmount })
      });
      if (res.ok) {
        setIsWithdrawOpen(false);
        setWithdrawAmount('150');
        setWithdrawalHistory(prev => [
          { id: `W-${Math.floor(904 + Math.random() * 100)}`, amount: parsedAmount, date: new Date().toISOString().split('T')[0], status: 'Completed' },
          ...prev
        ]);
        await syncData();
        triggerToast(`Withdrawal of $${parsedAmount} initiated successfully!`);
      }
    } catch (e) {
      triggerToast("Network error processing request.");
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "TransactionID,Type,Partner_Or_Recipient,Amount,Date,Status\n";
    teamMembers.forEach(tm => {
      csvContent += `${tm.id},Commission,${tm.name},${tm.earnings},2026-06-08,Mapped\n`;
    });
    withdrawalHistory.forEach(w => {
      csvContent += `${w.id},Withdrawal,Self,${w.amount},${w.date},Approved\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "AutoParts_Broker_Statement.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Broker accounts statement exported to AutoParts_Broker_Statement.csv!");
  };

  // Action: Buy / Upgrade Package (with auto price differential)
  const handleBuyPackage = async (packageName: string, rawPrice: number) => {
    let priceToPay = rawPrice;
    let isUpgrade = false;

    // Check if upgrade difference is applicable
    if (activeSubscription === 'Pro' && packageName === 'Enterprise') {
      priceToPay = 199 - 79; // $120
      isUpgrade = true;
    } else if (activeSubscription === 'Basic' && packageName === 'Pro') {
      priceToPay = 79 - 29; // $50
      isUpgrade = true;
    } else if (activeSubscription === 'Basic' && packageName === 'Enterprise') {
      priceToPay = 199 - 29; // $170
      isUpgrade = true;
    }

    try {
      const res = await fetch('/api/buy-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageName, price: priceToPay })
      });
      if (res.ok) {
        await syncData();
        if (isUpgrade) {
          triggerToast(`Upgraded to ${packageName}! Paid differential price of $${priceToPay}.`);
        } else {
          triggerToast(`Successfully purchased ${packageName} package! Your plan remaining is renewed.`);
        }
      }
    } catch (err) {
      triggerToast("Failed to record package order purchase.");
    }
  };

  // Action: Submit ticket
  const handleSendTicket = () => {
    if (!supportText.trim()) {
      triggerToast(t('toast-fail'));
      return;
    }
    triggerToast(t('toast-sent'));
    setSupportText('');
  };

  // Computed values
  const stockAlerts = useMemo(() => {
    return parts.filter((p) => p.stock <= 15);
  }, [parts]);

  const filteredCustomersList = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(customerSearch.toLowerCase());
      const matchTier = !customerFilterTier || c.tier === customerFilterTier;
      return matchSearch && matchTier;
    });
  }, [customers, customerSearch, customerFilterTier]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#FAF9F5] select-none text-gray-900 overflow-hidden">
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3 bg-[#FAF9F5]">
          <RefreshCw className="w-8 h-8 text-brand-red animate-spin" />
          <p className="text-xs font-semibold text-gray-550">Mounting sandbox environment and syncing database entities...</p>
        </div>
      ) : (
        /* CLIENT VIEWPORT CONTAINER */
        <div className="flex-1 flex h-full w-full bg-[#FAF9F5] text-gray-900 overflow-hidden relative">
          
          {/* Toast Notification Banner */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1e1e1e] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-850 text-sm font-medium"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MOBILE DRAWER SIDEBAR NAVIGATION */}
          <AnimatePresence>
            {isMobileSidebarOpen && (
              <motion.div
                key="client-mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs lg:hidden"
              />
            )}

            {isMobileSidebarOpen && (
              <motion.aside
                key="client-mobile-drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col justify-between selection:bg-brand-red-bg select-none shadow-2xl lg:hidden"
              >
                  <div>
                    {/* Header with Close option */}
                    <div className="p-5 border-b border-[#EBEAE4] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-white shadow-md">
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <h1 className="font-heading font-semibold text-base leading-tight text-gray-900 font-bold">AutoParts Pro</h1>
                          <span className="text-[10px] font-mono text-gray-400 font-extrabold tracking-wider">DEMO VERSION</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 cursor-pointer"
                        aria-label="Close menu"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Language Selector */}
                    <div className="px-5 py-3 border-b border-[#EBEAE4] bg-[#FAF9F5]/40">
                      <label htmlFor="mobile-lang-switcher" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        System Language
                      </label>
                      <select
                        id="mobile-lang-switcher"
                        value={lang}
                        onChange={(e) => setLang(e.target.value as Language)}
                        className="w-full text-xs font-semibold py-1.5 px-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-50 focus:outline-[#1e1e1e] transition-colors cursor-pointer"
                      >
                        <option value="uz">🇺🇿 O'zbekcha</option>
                        <option value="ru">🇷🇺 Русский</option>
                        <option value="cn">🇨🇳 中文</option>
                        <option value="en">🇬🇧 English</option>
                      </select>
                    </div>

                    <nav className="p-4 space-y-6">
                      {/* Client section */}
                      <div>
                        <p className="px-3 text-[11px] font-extrabold tracking-wider text-gray-400 uppercase select-none mb-2">
                          {t('sec-client')} VIEW PORT
                        </p>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('dashboard');
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                              activeTab === 'dashboard'
                                ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                                : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                            }`}
                          >
                            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                            <span>{t('lbl-dashboard')}</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('vehicles');
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                              activeTab === 'vehicles'
                                ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                                : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                            }`}
                          >
                            <Car className="w-4 h-4 flex-shrink-0" />
                            <span>{t('lbl-vehicles')}</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('packages');
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                              activeTab === 'packages'
                                ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                                : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                            }`}
                          >
                            <Package className="w-4 h-4 flex-shrink-0" />
                            <span>{t('lbl-packages')}</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('earnings');
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                              activeTab === 'earnings'
                                ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                                : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                            }`}
                          >
                            <Coins className="w-4 h-4 flex-shrink-0" />
                            <span>{t('lbl-earnings')}</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('incidents');
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer relative ${
                              activeTab === 'incidents'
                                ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                                : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                            }`}
                          >
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            <span>{t('lbl-incidents')}</span>
                            {incidents.filter(i => i.status !== 'Closed').length > 0 && (
                              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-brand-red text-white text-[9px] font-black rounded-full leading-none">
                                {incidents.filter(i => i.status !== 'Closed').length}
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('support');
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                              activeTab === 'support'
                                ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                                : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                            }`}
                          >
                            <Headset className="w-4 h-4 flex-shrink-0" />
                            <span>{t('lbl-support')}</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('about');
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                              activeTab === 'about'
                                ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                                : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                            }`}
                          >
                            <Shield className="w-4 h-4 flex-shrink-0" />
                            <span>{t('lbl-about')}</span>
                          </button>
                        </div>
                      </div>
                    </nav>
                  </div>

                  {/* User Profile Footer */}
                  <div 
                    onClick={() => {
                      setActiveTab('profile');
                      setIsMobileSidebarOpen(false);
                    }}
                    className="p-4 border-t border-[#EBEAE4] bg-[#FAF9F5] flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-brand-red-bg flex items-center justify-center font-bold text-xs text-brand-red-dark">
                        {isVipMember ? "⚡" : t('lbl-user-initials')}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                          {t('lbl-user-name')}
                          {isVipMember && <span className="text-[9.5px] bg-[#639922] text-white px-1 py-0.5 rounded-xs leading-none">VIP</span>}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium font-mono">{t('lbl-user-email')}</p>
                      </div>
                    </div>
                  </div>
                </motion.aside>
            )}
          </AnimatePresence>

          {/* SIDEBAR NAVIGATION */}
          <aside className="hidden lg:flex w-64 bg-white border-r border-[#EBEAE4] flex-col justify-between selection:bg-brand-red-bg select-none">
            <div>
              {/* Logo & Version */}
              <div className="p-5 border-b border-[#EBEAE4]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-white shadow-md shadow-red-200">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="font-heading font-semibold text-base leading-tight text-gray-900 font-bold">AutoParts Pro</h1>
                    <span className="text-[10px] font-mono text-gray-400 font-extrabold tracking-wider">DEMO VERSION</span>
                  </div>
                </div>

                {/* Language Selector */}
                <div className="mt-4">
                  <label htmlFor="lang-switcher-select" className="sr-only">Choose Language</label>
                  <select
                    id="lang-switcher-select"
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Language)}
                    className="w-full text-xs font-medium py-2 px-3 border border-gray-200 rounded-lg bg-[#FAF9F5] hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
                  >
                    <option value="uz">🇺🇿 O'zbekcha</option>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="cn">🇨🇳 中文</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-6">
                {/* Client section */}
                <div>
                  <p className="px-3 text-[11px] font-extrabold tracking-wider text-gray-400 uppercase select-none mb-2">
                    {t('sec-client')} VIEW PORT
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        activeTab === 'dashboard'
                          ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                          : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                      <span>{t('lbl-dashboard')}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('vehicles')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        activeTab === 'vehicles'
                          ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                          : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                      }`}
                    >
                      <Car className="w-4 h-4 flex-shrink-0" />
                      <span>{t('lbl-vehicles')}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('packages')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        activeTab === 'packages'
                          ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                          : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                      }`}
                    >
                      <Package className="w-4 h-4 flex-shrink-0" />
                      <span>{t('lbl-packages')}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('earnings')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        activeTab === 'earnings'
                          ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                          : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                      }`}
                    >
                      <Coins className="w-4 h-4 flex-shrink-0" />
                      <span>{t('lbl-earnings')}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('incidents')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer relative ${
                        activeTab === 'incidents'
                          ? 'bg-brand-red-bg text-brand-red-dark border-l-2 border-brand-red font-bold'
                          : 'text-gray-500 hover:bg-[#FAF9F5] hover:text-gray-950'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{t('lbl-incidents')}</span>
                      {incidents.filter(i => i.status !== 'Closed').length > 0 && (
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-brand-red text-white text-[9px] font-black rounded-full leading-none">
                          {incidents.filter(i => i.status !== 'Closed').length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </nav>
            </div>

            {/* User Account Bar at Bottom */}
            <div
              onClick={() => setActiveTab('profile')}
              className="p-4 border-t border-[#EBEAE4] bg-[#FAF9F5] flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
              title="Click to manage Personal Hub"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-brand-red-bg flex items-center justify-center font-bold text-xs text-brand-red-dark">
                  {isVipMember ? "⚡" : t('lbl-user-initials')}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 flex items-center gap-1 pb-0.5">
                    {t('lbl-user-name')}
                    {isVipMember && <span className="text-[9.5px] bg-[#639922] text-white px-1 py-0.5 rounded-xs leading-none">VIP</span>}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">{t('lbl-user-email')}</p>
                </div>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full border border-white ${isVipMember ? 'bg-amber-500' : 'bg-emerald-500'}`} title={isVipMember ? "Annual VIP Member Active" : "Connected"}></span>
            </div>
          </aside>

          {/* MAIN CONTAINER */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#FAF9F5] overflow-hidden">
            {/* TOPBAR HEADER */}
            <header className="h-16 border-b border-[#EBEAE4] bg-white flex items-center justify-between px-4 lg:px-6 select-none flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden p-2 -ml-1 hover:bg-gray-100 rounded-lg text-gray-750 cursor-pointer"
                  aria-label="Toggle Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-sm sm:text-lg font-heading font-semibold tracking-tight text-gray-900 font-bold truncate max-w-[160px] xs:max-w-[220px] sm:max-w-none" title={t(`topbar-title-${activeTab}`)}>
                  {t(`topbar-title-${activeTab}`)}
                </h2>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-brand-amber-bg text-amber-800 text-xs font-semibold rounded-full border border-[#f3d9b1] whitespace-nowrap flex-shrink-0">
                  <Star className="w-3.5 h-3.5 fill-current text-brand-amber" />
                  <span>{activeSubscription} Package</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center font-bold text-xs text-brand-red-dark border border-brand-red-bg flex-shrink-0">
                  {t('lbl-user-initials')}
                </div>
              </div>
            </header>

            {/* PAGE CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence mode="wait">
                
                {/* TAB: DASHBOARD */}
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-6"
                  >
                    {/* Stats strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-5 rounded-xl border border-[#EBEAE4] hover:shadow-card transition-all">
                        <p className="text-xs font-medium text-gray-400 mb-1">{t('st1')}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold tracking-tight text-gray-900 font-heading">
                            {orders.length + 1280}
                          </span>
                          <span className="text-xs font-semibold text-brand-green">↑ 12%</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium mt-1">
                          {t('st1s')}
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-[#EBEAE4] hover:shadow-card transition-all">
                        <p className="text-xs font-medium text-gray-400 mb-1">{t('st2')}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold tracking-tight text-gray-900 font-heading">
                            ${(walletTotal + 44383).toLocaleString()}
                          </span>
                          <span className="text-xs font-semibold text-brand-green">↑ 8.4%</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium mt-1">vs forecast</p>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-[#EBEAE4] hover:shadow-card transition-all">
                        <p className="text-xs font-medium text-gray-400 mb-1">{t('st3')}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold tracking-tight text-gray-900 font-heading">
                            {teamMembers.length + 44}
                          </span>
                          <span className="text-xs font-semibold text-brand-green">↑ {teamMembers.length}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium mt-1">
                          {t('st3s')} {t('sec-client')}
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-[#EBEAE4] hover:shadow-card transition-all">
                        <p className="text-xs font-medium text-gray-400 mb-1">{t('st4')}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold tracking-tight text-gray-900 font-heading">
                            {incidents.filter((i) => i.status !== 'Closed').length}
                          </span>
                          <span className="text-xs font-semibold text-[#EF9F27]">Pending</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium mt-1">
                          {incidents.length} reported in total
                        </p>
                      </div>
                    </div>

                    {/* Table row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-[#EBEAE4]">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-heading font-semibold text-xs text-gray-400 uppercase tracking-widest">{t('ct-orders')}</h3>
                          <span className="text-xs text-slate-400 font-mono">Real-time DB synced</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-[#EBEAE4] text-gray-400">
                                <th className="pb-3 pt-1 font-semibold whitespace-nowrap">{t('th-id')}</th>
                                <th className="pb-3 pt-1 font-semibold whitespace-nowrap">{t('th-pkg')}</th>
                                <th className="pb-3 pt-1 font-semibold whitespace-nowrap">{t('th-amt')}</th>
                                <th className="pb-3 pt-1 font-semibold text-right whitespace-nowrap">{t('th-status')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#FAF9F5]">
                              {orders.map((o) => (
                                <tr key={o.id} className="text-gray-700 hover:bg-[#FAF9F5]">
                                  <td className="py-3 font-mono font-semibold whitespace-nowrap">{o.id}</td>
                                  <td className="py-3 whitespace-nowrap">
                                    <span className="px-2 py-0.5 bg-gray-100 rounded-sm font-medium whitespace-nowrap">{o.packageName}</span>
                                  </td>
                                  <td className="py-3 font-medium whitespace-nowrap">${o.amount}</td>
                                  <td className="py-3 text-right whitespace-nowrap">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                        o.status === 'Active'
                                          ? 'bg-brand-green-bg text-brand-green'
                                          : o.status === 'Pending'
                                          ? 'bg-brand-amber-bg text-amber-700'
                                          : 'bg-red-50 text-brand-red'
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          o.status === 'Active'
                                            ? 'bg-brand-green'
                                            : o.status === 'Pending'
                                            ? 'bg-brand-amber'
                                            : 'bg-brand-red'
                                        }`}
                                      ></span>
                                      <span>
                                        {o.status === 'Active'
                                          ? t('s-active')
                                          : o.status === 'Pending'
                                          ? t('s-pending')
                                          : t('s-expired')}
                                      </span>
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Package distribution mock visual */}
                      <div className="bg-white p-6 rounded-xl border border-[#EBEAE4] flex flex-col justify-between">
                        <div>
                          <h3 className="font-heading font-semibold text-xs text-gray-400 uppercase tracking-widest mb-4">{t('dist-title')}</h3>
                          <div className="flex items-center justify-center py-6">
                            {/* Simple inline visual vector graph representation */}
                            <svg className="w-48 h-48 transform -rotate-90">
                              <circle cx="96" cy="96" r="75" stroke="#FAF9F5" strokeWidth="20" fill="transparent" />
                              <circle cx="96" cy="96" r="75" stroke="#E22424" strokeWidth="20" fill="transparent" strokeDasharray="471" strokeDashoffset="140" />
                              <circle cx="96" cy="96" r="75" stroke="#EFA024" strokeWidth="20" fill="transparent" strokeDasharray="471" strokeDashoffset="310" />
                              <circle cx="96" cy="96" r="75" stroke="#639922" strokeWidth="20" fill="transparent" strokeDasharray="471" strokeDashoffset="420" />
                            </svg>
                          </div>
                          <div className="flex justify-center gap-6 text-xs font-semibold pt-2">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-brand-red rounded-full"></span>Enterprise</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-brand-amber rounded-full"></span>Pro</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-brand-green rounded-full"></span>Basic</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB: MY VEHICLES */}
                {activeTab === 'vehicles' && (
                  <motion.div
                    key="vehicles"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Left List Pane */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-[#EBEAE4] p-5 space-y-4">
                      <div className="flex justify-between items-center pb-2">
                        <h3 className="font-heading font-semibold text-sm text-gray-900">{t('vc-title')}</h3>
                        <button
                          onClick={() => setIsAddVehicleOpen(true)}
                          className="px-3 py-1.5 bg-brand-red text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-brand-red-dark cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          {t('vc-add')}
                        </button>
                      </div>

                      <div className="space-y-2">
                        {vehicles.map((v) => (
                          <div
                            key={v.plate}
                            onClick={() => setSelectedVehicle(v)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              selectedVehicle?.plate === v.plate
                                ? 'bg-brand-red-bg/40 border-brand-red/35 shadow-sm'
                                : 'bg-white border-gray-150 hover:bg-[#FAF9F5]'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{v.icon}</span>
                              <div>
                                <h4 className="font-bold text-xs text-gray-400 font-mono tracking-wider">{v.plate}</h4>
                                <p className="text-xs font-semibold text-gray-800 mt-0.5">{v.model}</p>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                                v.status === 'Bound'
                                  ? 'bg-[#EBF7EE] text-[#2F7A44]'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {v.status === 'Bound' ? t('vc-bound') : t('vc-exp')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Details Pane option */}
                    {selectedVehicle && (
                      <div className="bg-white rounded-xl border border-[#EBEAE4] p-5 space-y-5">
                        <h3 className="font-heading font-semibold text-sm text-gray-900 pb-2 border-b border-gray-100">
                          {t('vc-det')}
                        </h3>

                        <div className="text-center py-4 bg-[#FAF9F5] rounded-2xl border border-gray-100">
                          <span className="text-5xl inline-block drop-shadow-sm mb-2">{selectedVehicle.icon}</span>
                          <h4 className="text-sm font-bold font-mono tracking-wider">{selectedVehicle.plate}</h4>
                          <p className="text-[11px] text-gray-400 font-medium mt-0.5">{selectedVehicle.model.split(' · ')[0]}</p>
                        </div>

                        <div className="space-y-4 text-xs font-medium">
                          <div className="flex justify-between">
                            <span className="text-gray-400">{t('vd1')}</span>
                            <span className="text-gray-800 font-bold">{selectedVehicle.registrationDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">{t('vd2')}</span>
                            <span className="text-gray-800 font-bold">{selectedVehicle.annualInspection}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">{t('vd3')}</span>
                            <span className="text-gray-800 font-bold">{selectedVehicle.insuranceExpiry}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-gray-100">
                            <span className="text-gray-400">{t('vd4')}</span>
                            <span className="text-brand-red font-bold font-mono">
                              {selectedVehicle.planRemainingMonths} {t('vd4s')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* TAB: PRICING PLANS */}
                {activeTab === 'packages' && (
                  <motion.div
                    key="packages"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Plan cards */}
                      <div className="bg-white rounded-xl border border-[#EBEAE4] p-6 flex flex-col justify-between hover:shadow-card relative overflow-hidden">
                        <div>
                          <h4 className="text-xs font-extrabold text-gray-400 tracking-wider uppercase mb-2">Basic</h4>
                          <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-heading font-extrabold">$29</span>
                            <span className="text-xs text-gray-405 font-medium">/{t('pkg-yr')}</span>
                          </div>
                          <ul className="space-y-3.5 text-xs text-gray-600 font-medium pb-6">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" />{t('pf1')}</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" />{t('pf2')}</li>
                          </ul>
                        </div>
                        <button
                          onClick={() => handleBuyPackage('Basic', 29)}
                          className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                            activeSubscription === 'Basic'
                              ? 'bg-slate-100 text-slate-500 cursor-default'
                              : 'bg-brand-red hover:bg-brand-red-dark text-white cursor-pointer'
                          }`}
                        >
                          {activeSubscription === 'Basic' ? 'Current Active' : t('pkg-buy')}
                        </button>
                      </div>

                      <div className="bg-white rounded-xl border-2 border-brand-red p-6 flex flex-col justify-between hover:shadow-card relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 bg-brand-red text-white font-extrabold text-[9px] px-3 py-1 rounded-bl-lg font-mono">
                          {t('pkg-popular')}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-brand-red tracking-wider uppercase mb-2">Pro</h4>
                          <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-heading font-extrabold text-brand-red-dark">$79</span>
                            <span className="text-xs text-gray-405 font-medium">/{t('pkg-yr2')}</span>
                          </div>
                          <ul className="space-y-3.5 text-xs text-gray-600 font-medium pb-6">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" />{t('pf1b')}</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" />{t('pf2b')}</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" />{t('pf3b')}</li>
                          </ul>
                        </div>
                        <button
                          onClick={() => handleBuyPackage('Pro', 79)}
                          className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                            activeSubscription === 'Pro'
                              ? 'bg-slate-100 text-slate-500 cursor-default'
                              : 'bg-brand-red hover:bg-brand-red-dark text-white cursor-pointer'
                          }`}
                        >
                          {activeSubscription === 'Pro' ? 'Current Active' : t('pkg-buy2')}
                        </button>
                      </div>

                      <div className="bg-white rounded-xl border border-[#EBEAE4] p-6 flex flex-col justify-between hover:shadow-card relative overflow-hidden">
                        <div>
                          <h4 className="text-xs font-extrabold text-gray-400 tracking-wider uppercase mb-2">Enterprise</h4>
                          <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-heading font-extrabold">$199</span>
                            <span className="text-xs text-gray-405 font-medium">/{t('pkg-yr3')}</span>
                          </div>
                          <ul className="space-y-3.5 text-xs text-gray-600 font-medium pb-6">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" />{t('pf1c')}</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" />{t('pf2c')}</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" />{t('pf3c')}</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" />{t('pf4c')}</li>
                          </ul>
                        </div>
                        <button
                          onClick={() => handleBuyPackage('Enterprise', 199)}
                          className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                            activeSubscription === 'Enterprise'
                              ? 'bg-slate-100 text-slate-500 cursor-default'
                              : 'bg-brand-red hover:bg-brand-red-dark text-white cursor-pointer'
                          }`}
                        >
                          {activeSubscription === 'Enterprise' ? 'Current Active' : t('pkg-buy3')}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-dashed bg-rose-50 text-xs font-medium text-brand-red flex justify-between items-center">
                      <span>{t('pkg-active')}</span>
                      <span>{subscriptionDaysRemaining} days remaining till renewal</span>
                    </div>
                  </motion.div>
                )}

                {/* TAB: EARNINGS AND WITHDRAWALS */}
                {activeTab === 'earnings' && (
                  <motion.div
                    key="earnings"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 bg-white rounded-xl border border-[#EBEAE4] p-5 space-y-6">
                        <div className="flex justify-between items-center pb-2">
                          <h3 className="font-heading font-semibold text-sm text-gray-900">{t('earn-total')}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={handleExportCSV}
                              className="px-3 py-1.5 border border-gray-200 hover:bg-gray-100 text-gray-705 text-xs font-bold rounded-lg cursor-pointer"
                            >
                              📋 Export CSV
                            </button>
                            <button
                              onClick={() => setIsWithdrawOpen(true)}
                              className="px-4 py-2 bg-brand-green hover:bg-[#27500A] text-white text-xs font-bold rounded-lg cursor-pointer animate-pulse"
                            >
                              {t('earn-withdraw')}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pb-4">
                          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-gray-100">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t('earn-avail')}</p>
                            <span className="text-3xl font-extrabold text-[#639922] font-mono">${walletAvailable}</span>
                          </div>
                          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-gray-100">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t('earn-pend')}</p>
                            <span className="text-3xl font-extrabold text-gray-500 font-mono">${walletPending}</span>
                          </div>
                        </div>

                        {/* Transaction & withdrawal history stream - dynamic sandbox ledgers */}
                        {withdrawalHistory.length > 0 && (
                          <div className="space-y-3 pt-2">
                            <h4 className="font-heading font-semibold text-xs text-gray-400 uppercase tracking-wider">Withdrawal Stream Logs</h4>
                            <div className="bg-[#FAF9F5] rounded-xl p-3.5 border border-gray-100 divide-y divide-gray-200/50 text-xs font-semibold">
                              {withdrawalHistory.map((item) => (
                                <div key={item.id} className="py-2.5 flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-gray-900 font-mono text-[11px]">{item.id}</span>
                                    <span className="text-[10px] text-gray-400">{item.date}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">Approved</span>
                                    <span className="text-[#639922] font-mono text-xs font-black">-${item.amount}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Team members list inside earnings */}
                        <div className="space-y-3 pt-2">
                          <h4 className="font-heading font-semibold text-xs text-gray-400 uppercase tracking-wider">{t('earn-team')}</h4>
                          <div className="divide-y divide-[#FAF9F5]">
                            {teamMembers.map((tm) => (
                              <div key={tm.id} className="py-3 flex items-center justify-between text-xs font-semibold">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-mono text-[11px]">
                                    {tm.initials}
                                  </div>
                                  <div>
                                    <p className="text-gray-800">{tm.name}</p>
                                    <p className="text-[10px] font-medium text-slate-400">{tm.ordersCount} Orders Mapped</p>
                                  </div>
                                </div>
                                <div className="text-right font-mono font-bold text-gray-800">
                                  ${tm.earnings}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Promo QR Card */}
                      <div className="bg-white rounded-xl border border-[#EBEAE4] p-5 flex flex-col items-center text-center space-y-4">
                        <h4 className="font-heading font-semibold text-sm text-gray-950">{t('earn-qr')}</h4>
                        <div className="p-4 bg-[#FAF9F5] border border-gray-150 rounded-2xl">
                          <QrCode className="w-36 h-36 text-gray-900" />
                        </div>
                        <p className="text-xs text-gray-450 font-medium px-4 leading-relaxed">
                          {t('earn-qrdesc')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB: INCIDENT REPORTS */}
                {activeTab === 'incidents' && (
                  <motion.div
                    key="incidents"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    <div className="lg:col-span-2 bg-white rounded-xl border border-[#EBEAE4] p-5 space-y-4">
                      <div className="flex justify-between items-center pb-2">
                        <h3 className="font-heading font-semibold text-sm text-gray-900">{t('inc-title')}</h3>
                        <button
                          onClick={() => setIsAddIncidentOpen(true)}
                          className="px-3 py-1.5 bg-brand-red text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-brand-red-dark cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          {t('inc-new')}
                        </button>
                      </div>

                      <div className="space-y-4">
                        {incidents.map((i) => (
                          <div key={i.id} className="p-4 rounded-xl border border-gray-150 relative bg-[#FAF9F5]/40 hover:bg-[#FAF9F5]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-xs font-bold text-gray-400">{i.id}</span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                                  i.status === 'Closed'
                                    ? 'bg-slate-100 text-slate-500'
                                    : i.status === 'Processing'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-red-50 text-brand-red'
                                }`}
                              >
                                {i.status === 'Closed' ? t('inc-closed') : i.status === 'Processing' ? t('inc-processing') : t('inc-review')}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-gray-800">
                              {i.descriptionKey ? t(i.descriptionKey) : i.description}
                            </p>
                            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-semibold font-mono">
                              <span>Plate: {i.vehiclePlate}</span>
                              <span>Logged: {i.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accordion FAQ on incidents */}
                    <div className="bg-white rounded-xl border border-[#EBEAE4] p-5 space-y-4">
                      <h3 className="font-heading font-semibold text-sm text-gray-950 pb-2 border-b border-gray-100">
                        {t('inc-faq')}
                      </h3>

                      <div className="space-y-3.5">
                        {faqs.map((f) => (
                          <div key={f.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                            <button
                              onClick={() => toggleFaq(f.id)}
                              className="w-full flex items-center justify-between text-left text-xs font-bold text-gray-900 cursor-pointer"
                            >
                              <span>{t(f.qKey)}</span>
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedFaqs[f.id] ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedFaqs[f.id] && (
                              <p className="mt-2 text-xs text-gray-500 font-semibold leading-relaxed">
                                {t(f.aKey)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB: CUSTOMERS DIRECTORY (Synced Client View) */}
                {activeTab === 'customers' && (
                  <motion.div
                    key="customers"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-6 bg-white p-5 rounded-xl border border-[#EBEAE4]"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <h3 className="font-heading font-semibold text-sm text-gray-900">{t('adm-list')}</h3>
                      <div className="flex gap-4 w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder={t('adm-search-placeholder')}
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          className="text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-brand-red w-full sm:w-64"
                        />
                        <select
                          value={customerFilterTier}
                          onChange={(e) => setCustomerFilterTier(e.target.value)}
                          className="text-xs py-2 px-3 border border-gray-200 rounded-lg bg-[#FAF9F5] focus:outline-none cursor-pointer"
                        >
                          <option value="">{t('any-tier')}</option>
                          <option value="Enterprise">Enterprise</option>
                          <option value="Pro">Pro</option>
                          <option value="Basic">Basic</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-400">
                            <th className="pb-3 font-semibold whitespace-nowrap">{t('ch1')}</th>
                            <th className="pb-3 font-semibold whitespace-nowrap">{t('ch2')}</th>
                            <th className="pb-3 text-center font-semibold whitespace-nowrap">{t('ch3')}</th>
                            <th className="pb-3 text-right font-semibold whitespace-nowrap">{t('ch4')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#FAF9F5] font-semibold text-gray-700">
                          {filteredCustomersList.map((c) => (
                            <tr key={c.id} className="hover:bg-[#FAF9F5]">
                              <td className="py-3.5 flex items-center gap-2 whitespace-nowrap">
                                <div className="w-7 h-7 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center font-mono flex-shrink-0">
                                  {c.name.split(' ')[0][0]}{c.name.split(' ')[1]?.[0] || ''}
                                </div>
                                <span className="text-gray-950 font-bold whitespace-nowrap">{c.name}</span>
                              </td>
                              <td className="py-3.5 whitespace-nowrap">{c.tier}</td>
                              <td className="py-3.5 text-center font-mono whitespace-nowrap">{c.orders}</td>
                              <td className="py-3.5 text-right whitespace-nowrap">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold whitespace-nowrap ${
                                    c.status === 'Active'
                                      ? 'bg-brand-green-bg text-[#2F7A44]'
                                      : c.status === 'Pending'
                                      ? 'bg-amber-50 text-amber-700'
                                      : 'bg-red-50 text-brand-red'
                                  }`}
                                >
                                  {c.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* TAB: WAREHOUSE DATABASE (Synced Client view) */}
                {activeTab === 'warehouse' && (
                  <motion.div
                    key="warehouse"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    <div className="lg:col-span-2 bg-white rounded-xl border border-[#EBEAE4] p-5 space-y-4">
                      <div className="flex justify-between items-center pb-2">
                        <h3 className="font-heading font-semibold text-sm text-gray-900">{t('wh-title')}</h3>
                        <button
                          onClick={() => setIsAddPartOpen(true)}
                          className="px-3.5 py-1.5 bg-brand-red text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-brand-red-dark cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          {t('wh-add')}
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-[#EBEAE4] text-gray-400">
                              <th className="pb-3 font-semibold whitespace-nowrap">{t('wh1')}</th>
                              <th className="pb-3 font-semibold whitespace-nowrap">{t('wh2')}</th>
                              <th className="pb-3 text-center font-semibold whitespace-nowrap">{t('wh3')}</th>
                              <th className="pb-3 font-semibold whitespace-nowrap">{t('wh4')}</th>
                              <th className="pb-3 text-right font-semibold whitespace-nowrap">{t('wh5')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#FAF9F5] font-semibold text-gray-700">
                            {parts.map((p) => (
                              <tr key={p.id} className="hover:bg-[#FAF9F5]">
                                <td className="py-3 whitespace-nowrap">
                                  <p className="text-gray-950 font-bold whitespace-nowrap">{p.name}</p>
                                  <p className="text-[10px] text-gray-400 font-mono whitespace-nowrap">#{p.id}</p>
                                </td>
                                <td className="py-3 whitespace-nowrap">{p.model}</td>
                                <td className="py-3 text-center font-mono font-bold whitespace-nowrap">{p.stock}</td>
                                <td className="py-3 font-mono text-gray-950 whitespace-nowrap">
                                  {isVipMember ? (
                                    <div className="flex flex-col whitespace-nowrap">
                                      <span className="text-emerald-700 font-bold whitespace-nowrap">${(p.price * 0.8).toFixed(1)}</span>
                                      <span className="text-[10px] text-gray-400 line-through whitespace-nowrap">${p.price}</span>
                                    </div>
                                  ) : (
                                    <span className="whitespace-nowrap">${p.price}</span>
                                  )}
                                </td>
                                <td className="py-3 text-right whitespace-nowrap">
                                  <span
                                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold whitespace-nowrap ${
                                      p.status === 'In Stock'
                                        ? 'bg-brand-green-bg text-[#2F7A44]'
                                        : p.status === 'Low Stock'
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'bg-red-50 text-brand-red'
                                    }`}
                                  >
                                    {p.status === 'In Stock'
                                      ? t('ws-ok')
                                      : p.status === 'Low Stock'
                                      ? t('ws-low')
                                      : t('ws-out')}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Stock status alerts panel */}
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-[#EBEAE4] p-5 space-y-4">
                        <h4 className="font-heading font-bold text-xs text-brand-red uppercase tracking-widest">{t('wh-alerts')}</h4>
                        <div className="space-y-2">
                          {stockAlerts.map((sa) => (
                            <div key={sa.id} className="p-3 bg-red-50 text-brand-red border border-red-100 rounded-lg text-xs font-bold">
                              ⚠️ {sa.name} — stock quantity is low ({sa.stock} remaining)
                            </div>
                          ))}
                          {stockAlerts.length === 0 && (
                            <p className="text-xs text-slate-400">All warehouse material stock levels are secure.</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#EBEAE4] p-5 space-y-4">
                        <h4 className="font-heading font-semibold text-xs text-gray-400 uppercase tracking-widest">{t('wh-recent')}</h4>
                        <ul className="space-y-3.5 text-xs font-semibold text-gray-650">
                          <li className="flex justify-between">
                            <span className="text-gray-900">{t('wm1')}</span>
                            <span className="text-gray-400 font-mono font-medium">3m ago</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-900">{t('wm2')}</span>
                            <span className="text-gray-400 font-mono font-medium">1h ago</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB: SUPPORT */}
                {activeTab === 'support' && (
                  <motion.div
                    key="support"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Live Intelligent AI Messenger Chatbot Column */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-[#EBEAE4] p-5 flex flex-col h-[520px] justify-between relative overflow-hidden">
                      <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <h3 className="font-heading font-bold text-sm text-gray-950">Live Intelligent Agent</h3>
                        </div>
                        <span className="text-[10px] bg-brand-red-bg text-brand-red-dark px-2 py-0.5 rounded-full font-bold">24/7 ONLINE</span>
                      </div>

                      {/* Chat Messages Log */}
                      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1 text-xs">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3.5 ${
                              msg.sender === 'user' 
                                ? 'bg-[#FAF3EB] text-gray-900 border border-[#EBEAE4] rounded-br-none' 
                                : 'bg-slate-100 text-slate-800 rounded-bl-none'
                            }`}>
                              <p className="font-semibold leading-relaxed">{msg.text}</p>
                              <span className="text-[9px] text-gray-400 font-mono mt-1 block text-right">{msg.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Suggested quick answers chips */}
                      <div className="p-3 bg-[#FAF9F5] border-t border-gray-100 rounded-xl space-y-1.5 mb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Quick Hot-Topic Queries</p>
                        <div className="flex flex-wrap gap-1.5">
                          <button 
                            onClick={() => {
                              const userMsg = "How to claim 20% member VIP discount?";
                              const botResponse = "Simply click your bottom profile card to become a VIP member for $9.9/year to unlock instant 20% discounts!";
                              setChatMessages(prev => [
                                ...prev,
                                { id: Date.now(), sender: 'user', text: userMsg, time: 'Just now' },
                                { id: Date.now() + 1, sender: 'bot', text: botResponse, time: 'Just now' }
                              ]);
                            }}
                            className="bg-white border border-gray-200 hover:border-brand-red text-slate-600 hover:text-brand-red px-2 py-1 rounded-md text-[10px] transition-all cursor-pointer font-medium"
                          >
                            💰 Get Discount
                          </button>
                          <button 
                            onClick={() => {
                              const userMsg = "Withdrawal processing duration?";
                              const botResponse = "In our demo environment, withdrawal payments are processed instantly to ensure seamless audit checks!";
                              setChatMessages(prev => [
                                ...prev,
                                { id: Date.now(), sender: 'user', text: userMsg, time: 'Just now' },
                                { id: Date.now() + 1, sender: 'bot', text: botResponse, time: 'Just now' }
                              ]);
                            }}
                            className="bg-white border border-gray-200 hover:border-brand-red text-slate-600 hover:text-brand-red px-2 py-1 rounded-md text-[10px] transition-all cursor-pointer font-medium"
                          >
                            🏦 Withdrawal Policy
                          </button>
                          <button 
                            onClick={() => {
                              const userMsg = "How to bind truck certificate document?";
                              const botResponse = "Click 'Add Vehicle' and select QR camera scanner to automatically parse your vehicle certificate!";
                              setChatMessages(prev => [
                                ...prev,
                                { id: Date.now(), sender: 'user', text: userMsg, time: 'Just now' },
                                { id: Date.now() + 1, sender: 'bot', text: botResponse, time: 'Just now' }
                              ]);
                            }}
                            className="bg-white border border-gray-200 hover:border-brand-red text-slate-600 hover:text-brand-red px-2 py-1 rounded-md text-[10px] transition-all cursor-pointer font-medium"
                          >
                            🚛 Scan Certificate
                          </button>
                        </div>
                      </div>

                      {/* Input Actions Bar */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!chatInput.trim()) return;
                          const text = chatInput;
                          setChatInput('');
                          setChatMessages(prev => [...prev, { id: Date.now(), sender: 'user', text, time: 'Just now' }]);
                          setTimeout(() => {
                            setChatMessages(prev => [...prev, { 
                              id: Date.now() + 2, 
                              sender: 'bot', 
                              text: `We received your message: "${text}". A support representative is assigning your ticket.`, 
                              time: 'Just now' 
                            }]);
                          }, 1000);
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          placeholder="Ask a question..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-1 text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red"
                        />
                        <button type="submit" className="bg-brand-red hover:bg-brand-red-dark text-white px-4.5 rounded-lg flex items-center justify-center cursor-pointer">
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>

                    {/* Left Column FAQ & Email Support Panel */}
                    <div className="space-y-6">
                      {/* Ticket Submission */}
                      <div className="bg-white rounded-xl border border-[#EBEAE4] p-5 space-y-4">
                        <h4 className="font-heading font-semibold text-xs text-gray-900 pb-2 border-b border-gray-100 uppercase tracking-widest">Support Tickets</h4>
                        <div className="space-y-3.5 text-xs font-semibold">
                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase mb-1">Category</label>
                            <select
                              value={supportCategory}
                              onChange={(e) => setSupportCategory(e.target.value)}
                              className="w-full text-xs py-2 px-3 border border-gray-200 rounded-lg bg-[#FAF9F5] focus:outline-none cursor-pointer"
                            >
                              <option value="sp-opt1">{t('sp-opt1')}</option>
                              <option value="sp-opt2">{t('sp-opt2')}</option>
                              <option value="sp-opt3">{t('sp-opt3')}</option>
                              <option value="sp-opt4">{t('sp-opt4')}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase mb-1">Message</label>
                            <textarea
                              placeholder={t('sp-area-placeholder')}
                              rows={3}
                              value={supportText}
                              onChange={(e) => setSupportText(e.target.value)}
                              className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg focus:outline-none resize-none"
                            ></textarea>
                          </div>
                          <button
                            onClick={handleSendTicket}
                            className="w-full py-2 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            {t('sp-send')}
                          </button>
                        </div>
                      </div>

                      {/* Hotline Desk */}
                      <div className="bg-white rounded-xl border border-[#EBEAE4] p-5 space-y-3.5">
                        <h4 className="font-heading font-semibold text-xs text-gray-900 pb-2 border-b border-gray-100 uppercase tracking-widest">Hotlines</h4>
                        <div className="space-y-2.5 text-xs">
                          <p className="text-gray-500 font-medium">AutoParts Pro Global Emergency support:</p>
                          <div className="bg-amber-50 text-amber-900 border border-amber-100 p-3 rounded-lg font-mono font-bold font-semibold text-center select-all">
                            ☎️ +998 (71) 200-0909
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB: PROFILE (PERSONAL HUB & PREMIUM MANAGEMENT) */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Left Column: Account Details, Level switch, file verification */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white rounded-xl border border-[#EBEAE4] p-6 space-y-6">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center text-2xl font-bold font-heading shadow-md">
                            {t('lbl-user-initials')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-heading font-extrabold text-slate-900 text-base">{t('lbl-user-name')}</h3>
                              {isVipMember && (
                                <span className="bg-amber-500 text-white font-black px-2 py-0.5 rounded-full text-[9px] tracking-wide animate-pulse">
                                  ⚡ ANNUAL VIP
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 font-mono">ID: #C-19827419 · Enterprise Driver</p>
                            <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-100">
                              Verified Company Level Approved
                            </span>
                          </div>
                        </div>

                        {/* Interactive Elevation Level Select and Qualification upload */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-heading font-semibold text-xs text-gray-400 uppercase tracking-wider">Identity Qualifications</h4>
                            <span className="text-[10px] text-gray-400 font-bold">CURRENT: ENTERPRISE</span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            Elevate your profile status by uploading business licenses to claim wholesale prices.
                          </p>

                          {/* Dynamic qualification upload box */}
                          <div className="p-5 bg-[#FAF9F5] border border-[#EBEAE4] rounded-xl text-center space-y-3 relative overflow-hidden transition-all hover:bg-[#FAF9F5]/80">
                            {qualificationStatus === 'None' && (
                              <>
                                <FileText className="w-10 h-10 text-gray-300 mx-auto" />
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-gray-700">Drag files here, or click to upload</p>
                                  <p className="text-[10px] text-gray-400">Supports *.pdf, *.png, *.jpg (Max 5MB)</p>
                                </div>
                                <button 
                                  onClick={() => {
                                    setQualificationStatus('Submitting');
                                    setTimeout(() => {
                                      setQualificationStatus('Approved');
                                      triggerToast("Qualification papers checked and approved successfully!");
                                    }, 2000);
                                  }}
                                  className="mx-auto px-4 py-1.5 bg-[#639922] hover:bg-[#27500A] text-white text-[11px] font-bold rounded-lg cursor-pointer"
                                >
                                  Simulate Upload License
                                </button>
                              </>
                            )}

                            {qualificationStatus === 'Submitting' && (
                              <div className="py-4 space-y-3.5">
                                <RefreshCw className="w-8 h-8 text-brand-red animate-spin mx-auto" />
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-gray-800">Verifying Enterprise OCR Data...</p>
                                  <div className="w-36 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                                    <div className="h-full bg-brand-red rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {qualificationStatus === 'Approved' && (
                              <div className="p-2 space-y-2.5">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-emerald-800">Enterprise Qualification Verified</p>
                                  <p className="text-[10px] text-gray-400">Hash: SHA256-8A3F8B... Logged to system</p>
                                </div>
                                <button 
                                  onClick={() => setQualificationStatus('None')}
                                  className="px-2 py-1 text-[9px] border bg-white hover:bg-gray-100 rounded text-gray-500"
                                >
                                  Reset Upload
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Profile address configuration forms */}
                      <div className="bg-white rounded-xl border border-[#EBEAE4] p-6 space-y-4">
                        <h4 className="font-heading font-semibold text-xs text-gray-400 uppercase tracking-wider">Shipping Preferences</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase mb-1">Delivery Point Address</label>
                            <input 
                              type="text" 
                              defaultValue="Uzbekistan, Tashkent, Mirabad district, block 4-2A"
                              className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase mb-1">Contact Mobile Hotline</label>
                            <input 
                              type="text" 
                              defaultValue="+998 (90) 123-4567"
                              className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg font-mono"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => triggerToast("Shipping point details corrected!")}
                          className="px-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>

                    {/* Right column: Paid yearly VIP membership $9.9 subscription */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-b from-[#1b2512] to-slate-950 text-[#FAF9F5] rounded-xl p-6.5 space-y-6 shadow-xl relative overflow-hidden border border-slate-800">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-transparent blur-xl"></div>
                        
                        <div className="space-y-2">
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-[9px] font-black uppercase tracking-wider">
                            {t('lbl-vip-badge')}
                          </span>
                          <h3 className="font-heading font-extrabold text-xl leading-tight">
                            {t('lbl-membership')}
                          </h3>
                        </div>

                        {/* Exclusive VIP Benefits */}
                        <div className="space-y-3 pt-2">
                          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">VIP Benefits:</p>
                          <ul className="space-y-3.5 text-xs text-gray-300 font-semibold leading-relaxed">
                            <li className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-[#639922] flex-shrink-0 mt-0.5" />
                              <span>{t('lbl-vip-desc')}</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-[#639922] flex-shrink-0 mt-0.5" />
                              <span>2-Hour priority fast lane incident resolution response guarantee</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-[#639922] flex-shrink-0 mt-0.5" />
                              <span>Wechat / Alipay / Credit card direct settlement integration support</span>
                            </li>
                          </ul>
                        </div>

                        {/* Order action button */}
                        <div className="pt-2">
                          {isVipMember ? (
                            <div className="bg-[#639922]/10 border border-[#639922]/30 p-4 rounded-xl text-[#639922] text-xs font-bold text-center space-y-1">
                              <p className="text-sm">🎉 VIP Privileges Unlocked</p>
                              <p className="text-[10px] opacity-75">20% Off wholesale activated</p>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setIsVipCheckoutOpen(true)}
                              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-gray-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.01]"
                            >
                              {t('lbl-become-member')}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Quick notification configurations */}
                      <div className="bg-white rounded-xl border border-[#EBEAE4] p-5 space-y-4">
                        <h4 className="font-heading font-semibold text-xs text-gray-400 uppercase tracking-widest">Notifications</h4>
                        <div className="space-y-3 text-xs font-semibold">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded text-brand-red focus:ring-brand-red" />
                            <span>Notify me when my affiliate team earns a commission</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded text-brand-red focus:ring-brand-red" />
                            <span>Live Incident alerts</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded text-brand-red focus:ring-brand-red" />
                            <span>Weekly inventory summary report</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB: ABOUT */}
                {activeTab === 'about' && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="max-w-3xl mx-auto bg-white rounded-xl border border-[#EBEAE4] p-8 space-y-8"
                  >
                    {/* Hero section */}
                    <div className="text-center space-y-3 pb-6 border-b border-gray-100">
                      <div className="w-16 h-16 bg-brand-red text-white flex items-center justify-center rounded-3xl mx-auto shadow-lg">
                        <Car className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-heading font-extrabold text-[#111111] text-lg">{t('about-title')}</h3>
                        <p className="text-xs text-gray-400 font-mono">{t('about-subtitle')}</p>
                      </div>
                    </div>

                    {/* Guarantees timeline */}
                    <div className="space-y-4">
                      <h4 className="font-heading font-bold text-xs text-gray-400 uppercase tracking-wider">{t('about-core')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                        <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-1.5">
                          <p className="text-slate-900 font-bold">{t('about-p1-title')}</p>
                          <p className="text-gray-500 font-medium">{t('about-p1-desc')}</p>
                        </div>
                        <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-1.5">
                          <p className="text-slate-900 font-bold">{t('about-p2-title')}</p>
                          <p className="text-gray-500 font-medium">{t('about-p2-desc')}</p>
                        </div>
                        <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-1.5">
                          <p className="text-slate-900 font-bold">{t('about-p3-title')}</p>
                          <p className="text-gray-500 font-medium">{t('about-p3-desc')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline scales */}
                    <div className="space-y-3 text-xs leading-relaxed">
                      <h4 className="font-heading font-bold text-xs text-gray-400 uppercase tracking-wider">{t('about-global-title')}</h4>
                      <p className="text-gray-500 font-medium">
                        {t('about-global-desc')}
                      </p>
                    </div>

                    {/* Dev Info Desk */}
                    <div className="p-5 bg-slate-950 text-slate-350 rounded-xl border border-slate-850 text-[11px] font-mono leading-relaxed space-y-1">
                      <p className="text-slate-100 font-bold">{t('about-dev-logs')}</p>
                      <p className="text-emerald-400">● ENVIRONMENT_STABILITY: ACTIVE SANDBOX</p>
                      <p className="text-slate-400">● CENTRAL_ROUTING: LOCALHOST_PROXY</p>
                      <p className="text-slate-400">● DATABASE_TYPE: MEMORY-DRIVEN JSON EXTRANET</p>
                      <p className="text-slate-400">● COMPACTION_ALGORITHM: TSX-BUNDLED_CJS</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* DIALOG MODAL: BOUND VEHICLE */}
          <AnimatePresence>
            {isAddVehicleOpen && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-md w-full border border-gray-100 shadow-2xl overflow-hidden"
                >
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-gray-900">{t('dialog-add-vehicle')}</h4>
                    <button
                      onClick={() => {
                        setIsAddVehicleOpen(false);
                        setIsAddVehicleScanMode(false);
                        setIsCorrectionMode(false);
                      }}
                      className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Segment controller tab bar */}
                  <div className="mx-5 mt-4 p-1 bg-slate-100 rounded-xl grid grid-cols-2 text-xs">
                    <button 
                      onClick={() => {
                        setIsAddVehicleScanMode(true);
                        setIsCorrectionMode(false);
                      }}
                      className={`py-1.5 rounded-lg font-bold text-center cursor-pointer transition-all ${
                        isAddVehicleScanMode ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      📷 Scan QR to Bind
                    </button>
                    <button 
                      onClick={() => setIsAddVehicleScanMode(false)}
                      className={`py-1.5 rounded-lg font-bold text-center cursor-pointer transition-all ${
                        !isAddVehicleScanMode ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      ✏️ Manual Enter
                    </button>
                  </div>

                  <form onSubmit={handleAddVehicle} className="p-5 space-y-4">
                    {isAddVehicleScanMode ? (
                      <div className="space-y-4">
                        {/* Interactive Viewfinder */}
                        <div className="bg-slate-950 rounded-xl relative overflow-hidden flex flex-col items-center justify-center h-44 text-white border border-slate-800">
                          {/* Running green scan laser */}
                          <div className="absolute top-0 inset-x-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-[bounce_2s_infinite]"></div>
                          
                          {/* Stylized crop grid markers */}
                          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-500"></div>
                          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-500"></div>
                          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-500"></div>
                          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-500"></div>

                          {isScanningActive ? (
                            <div className="text-center space-y-2">
                              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                              <p className="text-[11px] font-mono tracking-widest text-emerald-300 animate-pulse">
                                PARSING VEHICLE CERTIFICATE QR...
                              </p>
                            </div>
                          ) : newPlate ? (
                            <div className="text-center space-y-1.5 p-4 bg-[#639922]/15 border border-[#639922]/30 rounded-lg">
                              <CheckCircle2 className="w-6 h-6 text-[#639922] mx-auto" />
                              <p className="text-xs font-bold text-emerald-200">Parsed Certificate</p>
                              <div className="text-[10px] space-y-0.5 text-gray-300 font-mono">
                                <p>Plate: {newPlate}</p>
                                <p>Model: {newModel}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center p-3 space-y-2 select-none">
                              <QrCode className="w-9 h-9 text-gray-500 mx-auto" />
                              <p className="text-[11px] text-gray-400 max-w-[280px] leading-relaxed">
                                Scan the QR code located in the bottom right corner of the Vehicle Registration Certificate for automatic binding validation.
                              </p>
                            </div>
                          )}

                          {/* Trigger scan simulation button */}
                          {!newPlate && !isScanningActive && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsScanningActive(true);
                                setTimeout(() => {
                                  setIsScanningActive(false);
                                  setNewPlate("01 B 099 BB");
                                  setNewModel("Hyundai Xcient 440 High-deck heavy-weight Truck");
                                  triggerToast("OCR scanned registration QR code successfully");
                                }, 1500);
                              }}
                              className="absolute bottom-3 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold max-w-[200px] text-[10px] rounded shadow-md cursor-pointer transition-transform duration-100 hover:scale-[1.02]"
                            >
                              📷 Mock Scan
                            </button>
                          )}
                        </div>

                        {/* Scan Bind Correction Panel */}
                        {newPlate && (
                          <div className="space-y-3.5 bg-[#FAF9F5] p-3.5 rounded-lg border border-[#EBEAE4]">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-700">Bind Correction Rules</span>
                              <button 
                                type="button"
                                onClick={() => setIsCorrectionMode(!isCorrectionMode)}
                                className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                                  isCorrectionMode ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                              >
                                {isCorrectionMode ? '🔓 Editing' : '🔒 Click to Edit Correct'}
                              </button>
                            </div>

                            {isCorrectionMode ? (
                              <div className="space-y-2.5">
                                <div>
                                  <label className="block text-[9px] text-gray-400 font-bold uppercase mb-0.5">Plate Number</label>
                                  <input 
                                    type="text"
                                    value={newPlate}
                                    onChange={(e) => setNewPlate(e.target.value)}
                                    className="w-full text-xs p-2.5 bg-white border border-yellow-300 rounded focus:border-[#639922] font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-gray-400 font-bold uppercase mb-0.5">Brand Model</label>
                                  <input 
                                    type="text"
                                    value={newModel}
                                    onChange={(e) => setNewModel(e.target.value)}
                                    className="w-full text-xs p-2.5 bg-white border border-yellow-300 rounded focus:border-[#639922]"
                                  />
                                </div>
                              </div>
                            ) : (
                              <p className="text-[11px] text-gray-500 leading-relaxed">
                                Enable correct mode to adjust auto-completed scanning.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                            {t('dialog-plate')}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 01 A 777 AA"
                            value={newPlate}
                            onChange={(e) => setNewPlate(e.target.value)}
                            className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red font-mono uppercase"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                            {t('dialog-model')}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Toyota Camry 2023"
                            value={newModel}
                            onChange={(e) => setNewModel(e.target.value)}
                            className="w-[#100%] text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddVehicleOpen(false);
                          setIsAddVehicleScanMode(false);
                          setIsCorrectionMode(false);
                        }}
                        className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        {t('dialog-cancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={!newPlate}
                        className={`px-4 py-2 text-white rounded-lg text-xs font-semibold cursor-pointer ${
                          newPlate ? 'bg-brand-red hover:bg-brand-red-dark' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {t('dialog-save')}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* DIALOG MODAL: ADD PART TO WAREHOUSE */}
          <AnimatePresence>
            {isAddPartOpen && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-md w-full border border-gray-100 shadow-2xl overflow-hidden"
                >
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-gray-900">{t('dialog-add-part')}</h4>
                    <button
                      onClick={() => setIsAddPartOpen(false)}
                      className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddPart} className="p-5 space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                        {t('dialog-part-name')}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Carbon Brake Discs"
                        value={newPartName}
                        onChange={(e) => setNewPartName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                        {t('dialog-part-model')}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BMW M5 / Universal"
                        value={newPartModel}
                        onChange={(e) => setNewPartModel(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                          {t('dialog-part-stock')}
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={newPartStock}
                          onChange={(e) => setNewPartStock(parseInt(e.target.value) || 0)}
                          className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                          {t('dialog-part-price')}
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={newPartPrice}
                          onChange={(e) => setNewPartPrice(parseFloat(e.target.value) || 0)}
                          className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddPartOpen(false)}
                        className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        {t('dialog-cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        {t('dialog-save')}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* DIALOG MODAL: REPORT RECENT INCIDENT */}
          <AnimatePresence>
            {isAddIncidentOpen && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-md w-full border border-gray-100 shadow-2xl overflow-hidden"
                >
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-gray-900">{t('dialog-new-incident')}</h4>
                    <button
                      onClick={() => setIsAddIncidentOpen(false)}
                      className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddIncident} className="p-5 space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                        {t('dialog-inc-desc')}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Transmission clutch slippage"
                        value={newIncidentDesc}
                        onChange={(e) => setNewIncidentDesc(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                        {t('dialog-inc-vehicle')}
                      </label>
                      <select
                        value={newIncidentPlate}
                        onChange={(e) => setNewIncidentPlate(e.target.value)}
                        className="w-full text-xs py-2.5 px-3 border border-gray-200 rounded-lg bg-[#FAF9F5] focus:outline-none focus:border-brand-red cursor-pointer font-mono"
                      >
                        {vehicles.map((v) => (
                          <option key={v.plate} value={v.plate}>
                            {v.plate} ({v.model.split(' · ')[0]})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                        {t('dialog-inc-status')}
                      </label>
                      <select
                        value={newIncidentStatus}
                        onChange={(e) => setNewIncidentStatus(e.target.value as any)}
                        className="w-full text-xs py-2.5 px-3 border border-gray-200 rounded-lg bg-[#FAF9F5] focus:outline-none focus:border-brand-red cursor-pointer"
                      >
                        <option value="Under Review">Under Review</option>
                        <option value="Processing">Processing</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddIncidentOpen(false)}
                        className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        {t('dialog-cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        {t('dialog-save')}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* DIALOG MODAL: WITHDRAW */}
          <AnimatePresence>
            {isWithdrawOpen && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-md w-full border border-gray-100 shadow-2xl overflow-hidden"
                >
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-gray-900">{t('dialog-withdraw')}</h4>
                    <button
                      onClick={() => setIsWithdrawOpen(false)}
                      className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleWithdraw} className="p-5 space-y-4">
                    <div>
                      <div className="mb-4 bg-[#639922]/10 border border-emerald-200 p-3.5 rounded-lg text-xs text-emerald-800 font-medium">
                        Available balance splits: <strong className="font-mono text-emerald-950">${walletAvailable}</strong>
                      </div>

                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                        {t('dialog-withdraw-amount')}
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={walletAvailable}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-gray-200 rounded-lg font-mono focus:outline-none focus:border-brand-red text-lg font-extrabold"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsWithdrawOpen(false)}
                        className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        {t('dialog-cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#639922] hover:bg-[#27500A] text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        {t('dialog-save')}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* DIALOG MODAL: VIP YEARLY SUBSCRIPTION CHECKOUT */}
          <AnimatePresence>
            {isVipCheckoutOpen && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-md w-full border border-gray-100 shadow-2xl overflow-hidden"
                >
                  <div className="p-5 border-b border-gray-100 bg-slate-950 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-400 fill-current" />
                      <h4 className="font-heading font-bold text-sm tracking-tight">VIP Upgrade Checkout</h4>
                    </div>
                    <button
                      onClick={() => setIsVipCheckoutOpen(false)}
                      className="p-1 rounded-lg text-gray-400 hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="bg-amber-50 text-amber-900 border border-amber-200 p-4 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-sm flex justify-between">
                        <span>Annual VIP Membership</span>
                        <span className="font-mono text-base font-extrabold text-amber-950">$9.9 / Year</span>
                      </p>
                      <p className="opacity-80">Gain 20% discount on wholesale and 2-hour priority incident resolving tracks immediately.</p>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Select Sandbox Payment Gateway</p>
                      <div className="grid grid-cols-3 gap-2.5 text-xs">
                        <div className="border border-brand-red bg-rose-50/20 p-2.5 rounded-xl text-center cursor-pointer font-bold flex flex-col items-center gap-1">
                          <span className="text-lg">🇨🇳</span>
                          WeChat
                        </div>
                        <div className="border border-gray-200 hover:border-blue-500 p-2.5 rounded-xl text-center cursor-pointer font-bold flex flex-col items-center gap-1">
                          <span className="text-lg">🔷</span>
                          Alipay
                        </div>
                        <div className="border border-gray-200 hover:border-amber-500 p-2.5 rounded-xl text-center cursor-pointer font-bold flex flex-col items-center gap-1">
                          <span className="text-lg">💳</span>
                          Credit Card
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                      <span>Gateway: DEMO_SANDBOX_STABLE</span>
                      <span>Rate exchange ON</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsVipCheckoutOpen(false)}
                        className="px-4 py-2 border border-gray-250 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        {t('dialog-cancel')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsVipMember(true);
                          setIsVipCheckoutOpen(false);
                          triggerToast("🎉 VIP Annual membership purchased successfully!");
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 rounded-lg text-xs font-black cursor-pointer shadow-md flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        Settle sandbox payment
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
