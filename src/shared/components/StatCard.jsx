import React from 'react';
import { Icon } from '@iconify/react';

const colorThemes = {
  blue: {
    bg: 'bg-blue-100',
    border: 'border-blue-100',
    textTitle: 'text-blue-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  green: {
    bg: 'bg-emerald-100',
    border: 'border-emerald-100',
    textTitle: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  purple: {
    bg: 'bg-purple-100',
    border: 'border-purple-100',
    textTitle: 'text-purple-600',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  yellow: {
    bg: 'bg-amber-100',
    border: 'border-amber-100',
    textTitle: 'text-amber-600',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
};

const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
  const theme = colorThemes[color] || colorThemes.blue;

  return (
    <div className={`rounded-xl p-4 border  flex flex-col ${theme.bg} ${theme.border}`}>
      <h3 className={`text-sm font-semibold ${theme.textTitle} mb-2`}>
        {title}
      </h3>

      <div className="flex items-center justify-between mb-1">
        <span className="text-2xl font-bold text-gray-800">
          {value}
        </span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme.iconBg}`}>
          <Icon icon={icon} className={`w-5 h-5 ${theme.iconColor}`} />
        </div>
      </div>

      <p className="text-xs text-gray-500">
        {subtitle}
      </p>
    </div>
  );
};

export default StatCard;
