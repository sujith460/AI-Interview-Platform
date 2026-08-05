import React from 'react';

export default function CompanyLogo({ name, logoUrl, className = "h-12 w-12" }) {
  // If custom logo URL is provided and valid, use image
  if (logoUrl && logoUrl.startsWith('http')) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-white p-1.5 shadow-md overflow-hidden shrink-0 ${className}`}>
        <img src={logoUrl} alt={name} className="h-full w-full object-contain" />
      </div>
    );
  }

  const cleanName = (name || '').toLowerCase().trim();

  // Netflix
  if (cleanName.includes('netflix')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-[#000000] border border-red-600/30 text-[#E50914] shadow-md shadow-red-950/50 shrink-0 ${className}`}>
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          <path d="M5.398 0v24h4.15V13.064l5.053 10.936h4.001V0h-4.15v10.936L9.399 0H5.398z" />
        </svg>
      </div>
    );
  }

  // Google
  if (cleanName.includes('google')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-slate-900 border border-white/10 shadow-md shrink-0 ${className}`}>
        <svg className="h-6 w-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      </div>
    );
  }

  // Amazon
  if (cleanName.includes('amazon')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-[#131921] border border-amber-500/30 text-[#FF9900] shadow-md shrink-0 ${className}`}>
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          <path d="M13.915 16.327c-3.197 2.354-7.854 3.593-11.83 1.026-.263-.169-.58-.027-.37.3.71 1.11 3.92 2.65 8.16 2.65 4.39 0 7.82-1.78 9.94-3.73.34-.31-.05-.72-.42-.44l-5.48 4.41z" />
          <path d="M14.94 14.12c.57-.45 1.25-.87 1.94-1.22.28-.14.54.12.33.36-1.07 1.23-2.31 2.31-3.69 3.07-.3.17-.58-.11-.32-.34.56-.5 1.18-1.12 1.74-1.87z" />
        </svg>
      </div>
    );
  }

  // Meta / Facebook
  if (cleanName.includes('meta') || cleanName.includes('facebook')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-[#0668E1]/10 border border-[#0668E1]/30 text-[#0668E1] shadow-md shrink-0 ${className}`}>
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          <path d="M16.924 3.75c-2.378 0-4.482 1.298-5.924 3.25C9.558 5.048 7.454 3.75 5.076 3.75 2.272 3.75 0 6.022 0 8.826c0 4.674 5.378 9.476 10.457 11.232a1.448 1.448 0 0 0 1.086 0C16.622 18.302 22 13.5 22 8.826c0-2.804-2.272-5.076-5.076-5.076z" />
        </svg>
      </div>
    );
  }

  // Microsoft
  if (cleanName.includes('microsoft')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-slate-900 border border-white/10 shadow-md shrink-0 ${className}`}>
        <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
          <div className="bg-[#F25022] rounded-sm" />
          <div className="bg-[#7FBA00] rounded-sm" />
          <div className="bg-[#00A4EF] rounded-sm" />
          <div className="bg-[#FFB900] rounded-sm" />
        </div>
      </div>
    );
  }

  // Apple
  if (cleanName.includes('apple')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-slate-800 border border-white/20 text-white shadow-md shrink-0 ${className}`}>
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.1-.98.04-2.19.66-2.88 1.47-.62.72-1.16 1.88-1.01 3 .1.01 2.22-.55 2.9-1.37z" />
        </svg>
      </div>
    );
  }

  // Default stylized initial logo card
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || 'C';
  return (
    <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 text-lg font-bold text-white shadow-md shadow-violet-900/30 border border-violet-400/30 shrink-0 ${className}`}>
      {initial}
    </div>
  );
}
