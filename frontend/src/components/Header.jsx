import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Phone, Star, Zap, Sparkles, Globe, Moon, Sun, Menu, X, Copy, Check, ChevronDown, User } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCurrency, CURRENCIES } from "../context/CurrencyContext";
import { useTheme } from "../context/ThemeContext";
import { COMPANY } from "../data/company";
import CartSheet from "./CartSheet";
import Logo from "./Logo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const MS_MENU_COLUMNS = [
  {
    heading: "OFFICE FOR PC",
    links: [
      ["Office 2024", "/category/office-2024-pc"],
      ["Office 2021", "/category/office-2021-pc"],
      ["Office 2019", "/category/office-2019-pc"],
    ],
    all: ["All Office for PC →", "/category/office-for-pc"],
  },
  {
    heading: "OFFICE FOR MAC",
    links: [
      ["Office 2024 for Mac", "/category/office-2024-mac"],
      ["Office 2021 for Mac", "/category/office-2021-mac"],
      ["Office 2019 for Mac", "/category/office-2019-mac"],
    ],
    all: ["All Office for Mac →", "/category/office-for-mac"],
  },
  {
    heading: "WINDOWS",
    links: [
      ["Windows 11", "/category/windows-11"],
      ["Windows 10", "/category/windows-10"],
    ],
    all: ["All Windows →", "/category/windows-os"],
  },
  {
    heading: "APPS",
    links: [
      ["Microsoft Project", "/category/microsoft-project"],
      ["Microsoft Visio", "/category/microsoft-visio"],
    ],
    all: ["All Microsoft Apps →", "/category/microsoft-apps"],
  },
];

const MOBILE_MS_LINKS = [
  ["Office 2024 (PC)", "/category/office-2024-pc"],
  ["Office 2021 (PC)", "/category/office-2021-pc"],
  ["Office 2019 (PC)", "/category/office-2019-pc"],
  ["Office for Mac", "/category/office-for-mac"],
  ["Windows 11", "/category/windows-11"],
  ["Windows 10", "/category/windows-10"],
  ["Microsoft Project", "/category/microsoft-project"],
  ["Microsoft Visio", "/category/microsoft-visio"],
];

const MOBILE_AV_LINKS = [
  ["Bitdefender", "/category/bitdefender"],
  ["McAfee", "/category/mcafee"],
];

const VolumePricingCard = () => (
  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white" data-testid="volume-pricing-card">
    <h4 className="font-bold text-base">Volume Pricing</h4>
    <p className="text-xs text-blue-100 mt-1.5 leading-relaxed">Exclusive discounts on bulk licenses for teams and businesses.</p>
    <Link to="/page/contact-us" className="inline-flex items-center gap-1 bg-white text-blue-700 text-xs font-bold px-3.5 py-2 rounded-full mt-3 hover:bg-blue-50 transition" data-testid="volume-quote-btn">Request a Quote</Link>
    <div className="border-t border-white/20 mt-4 pt-3">
      <p className="text-xs font-semibold">Have a Question?</p>
      <p className="text-[11px] text-blue-100 mt-0.5">Call Mon–Fri 9 AM–6 PM EST</p>
      <a href={`tel:${COMPANY.phone}`} className="block text-sm font-bold mt-1 hover:underline" data-testid="volume-phone-link">{COMPANY.phone}</a>
      <p className="text-[11px] text-blue-100 mt-0.5">or chat with a sales expert</p>
    </div>
  </div>
);

const PromoBar = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText("GSOFT20");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative w-full text-white text-sm" style={{ background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 flex-wrap">
        <span className="font-medium">Save up to 20% on Microsoft Office 2024!</span>
        <button onClick={copyCode} className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-md text-xs font-semibold transition">GSOFT20 {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}</button>
        <Link to="/shop" className="underline underline-offset-2 hover:opacity-90 font-semibold">Shop Now &rsaquo;</Link>
      </div>
      <button onClick={onClose} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"><X className="w-4 h-4" /></button>
    </div>
  );
};

const TrustBar = () => (
  <div className="bg-[#0c1424] text-slate-200 text-xs hidden md:block">
    <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />100% Genuine Microsoft Products</div>
        <div className="flex items-center gap-1.5"><div className="flex">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}</div><span className="font-semibold">4.6/5</span><a href="#reviews" className="text-slate-300 hover:text-white">(4,722+ Reviews)</a></div>
        <div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-400" />Instant Digital Delivery</div>
      </div>
      <div className="flex items-center gap-4">
        <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold">★ #1 Software Store</span>
        <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[11px] font-semibold">5 YRS</span>
        <span className="text-slate-500">|</span>
        <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-1.5 hover:text-white"><Phone className="w-3.5 h-3.5" />{COMPANY.phone}</a>
      </div>
    </div>
  </div>
);

const MenuColumn = ({ col }) => (
  <div>
    <h4 className="text-[11px] font-bold tracking-wider text-blue-700 mb-3">{col.heading}</h4>
    <ul className="space-y-2">
      {col.links.map(([label, to]) => (
        <li key={to}><Link to={to} className="text-sm font-semibold text-slate-900 hover:text-blue-700 block">{label}</Link></li>
      ))}
      <li className="pt-1"><Link to={col.all[1]} className="text-xs text-blue-700 font-semibold hover:underline">{col.all[0]}</Link></li>
    </ul>
  </div>
);

const MegaMenuMS = ({ onEnter, onLeave }) => (
  <div onMouseEnter={onEnter} onMouseLeave={onLeave} className="absolute top-full left-0 right-0 bg-white border-t border-slate-200 shadow-xl">
    <div className="max-w-7xl mx-auto px-4 py-7 grid grid-cols-5 gap-6">
      {MS_MENU_COLUMNS.map((col) => <MenuColumn key={col.heading} col={col} />)}
      <VolumePricingCard />
    </div>
  </div>
);

const MegaMenuAV = ({ onEnter, onLeave }) => (
  <div onMouseEnter={onEnter} onMouseLeave={onLeave} className="absolute top-full left-0 right-0 bg-white border-t border-slate-200 shadow-xl">
    <div className="max-w-7xl mx-auto px-4 py-7 grid grid-cols-3 gap-8">
      <div>
        <h4 className="text-[11px] font-bold tracking-wider text-blue-700 mb-3">BITDEFENDER</h4>
        <Link to="/category/bitdefender" className="text-sm font-semibold text-slate-900 hover:text-blue-700 block mb-1">All Bitdefender</Link>
        <p className="text-xs text-slate-500">VPN, Antivirus for Mac & Small Office Security</p>
      </div>
      <div>
        <h4 className="text-[11px] font-bold tracking-wider text-blue-700 mb-3">MCAFEE</h4>
        <Link to="/category/mcafee" className="text-sm font-semibold text-slate-900 hover:text-blue-700 block mb-1">All McAfee</Link>
        <p className="text-xs text-slate-500">McAfee+ Premium Individual & Family Plans</p>
      </div>
      <VolumePricingCard />
    </div>
  </div>
);

const MobileGroup = ({ label, expanded, onToggle, links, onNavigate, testId }) => (
  <>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-blue-50 text-sm font-medium text-slate-800"
      data-testid={testId}
    >
      {label} <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
    </button>
    {expanded && (
      <div className="pl-4 pb-1 space-y-0.5">
        {links.map(([l, to]) => (
          <Link key={to} to={to} onClick={onNavigate} className="block px-3 py-2 rounded-md hover:bg-blue-50 text-sm text-slate-600">{l}</Link>
        ))}
      </div>
    )}
  </>
);

const MobileMenu = ({ onNavigate }) => {
  const { code, setCurrency } = useCurrency();
  const { dark, toggle } = useTheme();
  const [group, setGroup] = useState(null);
  const toggleGroup = (g) => setGroup(group === g ? null : g);

  return (
    <div className="lg:hidden border-t border-slate-100 bg-white max-h-[75vh] overflow-y-auto" data-testid="mobile-menu">
      <div className="px-4 py-3 space-y-1">
        <MobileGroup label="Microsoft Products" expanded={group === "ms"} onToggle={() => toggleGroup("ms")} links={MOBILE_MS_LINKS} onNavigate={onNavigate} testId="mobile-ms-toggle" />
        <MobileGroup label="Antivirus" expanded={group === "av"} onToggle={() => toggleGroup("av")} links={MOBILE_AV_LINKS} onNavigate={onNavigate} testId="mobile-av-toggle" />

        <Link to="/page/contact-us" onClick={onNavigate} className="block px-3 py-2.5 rounded-md hover:bg-blue-50 text-sm font-medium text-slate-800">Request a Quote</Link>
        <Link to="/shop" onClick={onNavigate} className="block px-3 py-2.5 rounded-md hover:bg-blue-50 text-sm font-medium text-slate-800">Shop</Link>
        <Link to="/disclaimer" onClick={onNavigate} className="block px-3 py-2.5 rounded-md hover:bg-blue-50 text-sm font-medium text-slate-800" data-testid="mobile-disclaimer-link">Disclaimer</Link>

        <div className="mx-3 mt-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white" data-testid="mobile-question-card">
          <p className="text-sm font-semibold">Have a Question?</p>
          <p className="text-[11px] text-blue-100 mt-0.5">Call Mon–Fri 9 AM–6 PM EST</p>
          <a href={`tel:${COMPANY.phone}`} className="block text-base font-bold mt-1">{COMPANY.phone}</a>
          <p className="text-[11px] text-blue-100 mt-0.5">or chat with a sales expert</p>
        </div>

        <div className="border-t border-slate-100 mt-2 pt-3 pb-2 px-3 flex items-center justify-between gap-3">
          <button onClick={() => window.dispatchEvent(new Event("ucode-open-chat"))} className="flex items-center gap-1.5 text-sm text-slate-700" data-testid="mobile-ask-ai"><Sparkles className="w-4 h-4 text-blue-600" />Chat</button>
          <div className="flex items-center gap-1" data-testid="mobile-currency-row">
            {Object.values(CURRENCIES).map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={`text-[11px] font-semibold px-2 py-1 rounded-md border ${code === c.code ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-600"}`}
              >
                {c.code}
              </button>
            ))}
          </div>
          <button onClick={toggle} className="text-slate-600 p-1.5 rounded-md hover:bg-slate-100" data-testid="mobile-theme-toggle">{dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
        </div>
      </div>
    </div>
  );
};

const HeaderActions = ({ onCartOpen, mobileOpen, onMobileToggle }) => {
  const { totalCount } = useCart();
  const { code, setCurrency } = useCurrency();
  const { dark, toggle } = useTheme();
  const { user } = useAuth();
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => window.dispatchEvent(new Event("ucode-open-chat"))} className="hidden md:flex items-center gap-1.5 text-sm text-slate-700 hover:text-blue-700 px-2 py-1.5 rounded-md hover:bg-slate-50" data-testid="header-ask-ai"><Sparkles className="w-4 h-4 text-blue-600" />Chat</button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="hidden md:flex items-center gap-1.5 text-sm text-slate-700 hover:text-blue-700 px-2 py-1.5 rounded-md hover:bg-slate-50"><Globe className="w-4 h-4" />{code}</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          {Object.values(CURRENCIES).map((c) => (
            <DropdownMenuItem key={c.code} onClick={() => setCurrency(c.code)} className="cursor-pointer"><span className="mr-2">{c.flag}</span>{c.code} • {c.symbol}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <button onClick={toggle} className="hidden md:flex items-center text-slate-600 hover:text-slate-900 p-1.5 rounded-md hover:bg-slate-100">{dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
      <Link to={user ? "/account" : "/login"} data-testid="account-link"
        className="flex items-center gap-1.5 text-sm text-slate-700 hover:text-blue-700 px-2 py-1.5 rounded-md hover:bg-slate-50" title={user ? "My Account" : "Sign In"}>
        {user && user.picture ? (
          <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <User className="w-4 h-4" />
        )}
        <span className="hidden xl:inline">{user ? (user.name || "Account").split(" ")[0] : "Sign In"}</span>
      </Link>
      <Button onClick={onCartOpen} className="bg-blue-600 hover:bg-blue-700 text-white relative"><ShoppingCart className="w-4 h-4 mr-1.5" />Cart{totalCount > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{totalCount}</span>)}</Button>
      <button onClick={onMobileToggle} className="lg:hidden p-1.5 text-slate-700">{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
    </div>
  );
};

const Header = () => {
  const [showPromo, setShowPromo] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMS, setMegaMS] = useState(false);
  const [megaAV, setMegaAV] = useState(false);
  const closeTimer = React.useRef(null);

  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const openMS = () => { cancelClose(); setMegaMS(true); setMegaAV(false); };
  const openAV = () => { cancelClose(); setMegaAV(true); setMegaMS(false); };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => { setMegaMS(false); setMegaAV(false); }, 250);
  };

  return (
    <header className="sticky top-0 z-50">
      {showPromo && <PromoBar onClose={() => setShowPromo(false)} />}
      <TrustBar />

      <div className="bg-white border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo className="w-11 h-11" />
            <div className="leading-tight"><div className="font-bold text-slate-900 text-lg">{COMPANY.brand}</div><div className="text-[10px] text-slate-500 tracking-wider font-semibold">AUTHORIZED RESELLER</div></div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" onMouseLeave={scheduleClose}>
            <button onMouseEnter={openMS} className="px-4 py-2 text-slate-700 font-medium hover:text-blue-700 text-sm flex items-center gap-1">Microsoft Products <ChevronDown className="w-3.5 h-3.5" /></button>
            <button onMouseEnter={openAV} className="px-4 py-2 text-slate-700 font-medium hover:text-blue-700 text-sm flex items-center gap-1">Antivirus <ChevronDown className="w-3.5 h-3.5" /></button>
            <Link to="/page/contact-us" className="px-4 py-2 text-slate-700 font-medium hover:text-blue-700 text-sm">Request a Quote</Link>
            <Link to="/shop" className="px-4 py-2 text-slate-700 font-medium hover:text-blue-700 text-sm">Shop</Link>
          </nav>

          <HeaderActions onCartOpen={() => setCartOpen(true)} mobileOpen={mobileOpen} onMobileToggle={() => setMobileOpen(!mobileOpen)} />
        </div>

        {megaMS && <MegaMenuMS onEnter={cancelClose} onLeave={scheduleClose} />}
        {megaAV && <MegaMenuAV onEnter={cancelClose} onLeave={scheduleClose} />}
        {mobileOpen && <MobileMenu onNavigate={() => setMobileOpen(false)} />}
      </div>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
};

export default Header;
