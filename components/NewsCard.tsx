
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../App';
import { NewsItem } from '../types';

interface NewsCardProps {
  item: NewsItem;
  variant?: 'large' | 'small' | 'row';
}

const NewsCard: React.FC<NewsCardProps> = ({ item, variant = 'small' }) => {
  const { lang } = useContext(LanguageContext);

  if (variant === 'large') {
    return (
      <Link to={`/news/${item.id}`} className="group relative block w-full aspect-[21/9] overflow-hidden rounded-2xl shadow-2xl transition-all duration-500">
        <img 
          src={item.image} 
          alt={item.title[lang]} 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-4xl">
          <span className="mb-4 inline-block bg-orange-600 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-xl">
            {item.category[lang]}
          </span>
          <h2 className="mb-4 text-3xl md:text-5xl font-black uppercase tracking-tighter text-white group-hover:text-orange-400 transition-colors duration-300">
            {item.title[lang]}
          </h2>
          <p className="mb-6 line-clamp-2 text-lg font-medium text-slate-200">
            {item.summary[lang]}
          </p>
          <div className="flex items-center gap-4 text-sm font-bold text-orange-500">
            <span className="uppercase tracking-widest">Read More</span>
            <div className="h-0.5 w-12 bg-orange-600 transition-all group-hover:w-20" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${item.id}`} className="group block overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title[lang]} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
            {item.category[lang]}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {item.date} • 4 min read
        </div>
        <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-orange-600">
          {item.title[lang]}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          {item.summary[lang]}
        </p>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 group-hover:text-orange-700 transition-colors">
          Read More
          <div className="h-px w-6 bg-orange-600 transition-all group-hover:w-10" />
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
