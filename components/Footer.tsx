
import React, { useContext } from 'react';
// Added missing ChevronRight import
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, ChevronRight } from 'lucide-react';
import Logo from './Logo';
import { LanguageContext } from '../App';

const Footer: React.FC = () => {
  const { t } = useContext(LanguageContext);
  
  const handleLegalClick = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    alert(`${label} policy page is under construction.`);
  };

  const handlePressOffice = () => {
    window.location.href = "mailto:press@footballnova.com?subject=Media Inquiry";
  };

  return (
    <footer className="bg-slate-900 dark:bg-black text-white pt-24 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-12">
          <div className="space-y-6">
            <Logo size={56} />
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed italic">
              "The definitive home for professional football governance and storytelling."
            </p>
          </div>
          <div className="flex flex-wrap gap-8 items-center">
            <button 
              onClick={handlePressOffice}
              className="bg-orange-600 hover:bg-white hover:text-orange-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-xl"
            >
              <Mail size={16} />
              Contact Press Office
            </button>
            <div className="flex space-x-6">
              {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <div key={i} className="group cursor-pointer">
                  <Icon className="text-slate-400 group-hover:text-orange-500 transition-all duration-300 transform group-hover:scale-125 group-hover:-translate-y-1" size={24} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 border-t border-white/5 pt-16">
          <div className="flex flex-col space-y-4">
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-4">{t.tournaments}</h4>
            <a href="#" onClick={(e) => handleLegalClick(e, 'FIFA World Cup 2026')} className="text-sm font-medium hover:text-orange-400 transition-colors">FIFA World Cup 2026</a>
            <a href="#" onClick={(e) => handleLegalClick(e, 'Women\'s Global Cup')} className="text-sm font-medium hover:text-orange-400 transition-colors">Women's Global Cup</a>
            <a href="#" onClick={(e) => handleLegalClick(e, 'Club Championship')} className="text-sm font-medium hover:text-orange-400 transition-colors">Club Championship</a>
          </div>
          <div className="flex flex-col space-y-4">
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-4">ABOUT</h4>
            <a href="#" onClick={(e) => handleLegalClick(e, 'Governance')} className="text-sm font-medium hover:text-orange-400 transition-colors">Governance</a>
            <a href="#" onClick={(e) => handleLegalClick(e, 'Sustainability')} className="text-sm font-medium hover:text-orange-400 transition-colors">Sustainability</a>
            <a href="#" onClick={(e) => handleLegalClick(e, 'Careers')} className="text-sm font-medium hover:text-orange-400 transition-colors">Careers</a>
          </div>
          <div className="flex flex-col space-y-4">
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-4">LEGAL</h4>
            <a href="#" onClick={(e) => handleLegalClick(e, 'Privacy')} className="text-sm font-medium hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="#" onClick={(e) => handleLegalClick(e, 'Terms')} className="text-sm font-medium hover:text-orange-400 transition-colors">Terms of Service</a>
            <a href="#" onClick={(e) => handleLegalClick(e, 'Cookies')} className="text-sm font-medium hover:text-orange-400 transition-colors">Cookie Settings</a>
          </div>
          <div className="hidden lg:flex flex-col space-y-4">
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-4">DEVELOPMENT</h4>
            <a href="#" onClick={(e) => handleLegalClick(e, 'Coaching')} className="text-sm font-medium hover:text-orange-400 transition-colors">Coaching Hub</a>
            <a href="#" onClick={(e) => handleLegalClick(e, 'Medical')} className="text-sm font-medium hover:text-orange-400 transition-colors">Medical Center</a>
          </div>
          <div className="flex flex-col space-y-4">
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-4">REGISTRATION</h4>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-relaxed">Join the newsletter for official technical reports.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-slate-800 border-none rounded-lg px-4 py-2 text-xs w-full focus:ring-1 ring-orange-500 outline-none" />
                <button className="bg-orange-600 p-2 rounded-lg hover:bg-white hover:text-orange-600 transition-all"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] text-slate-600 uppercase tracking-[0.4em] font-black">
          <p>© 2024 FOOTBALL NOVA. WORLD GOVERNING PROTOCOL ENABLED.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <span className="hover:text-white transition-colors cursor-help">Official Timing by NOVA CHRONOS</span>
            <span className="hover:text-white transition-colors cursor-help">DATA BY NOVA STATS AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
