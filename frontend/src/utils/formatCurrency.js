// ============================================================
// Currency utility — maps country → ISO currency code + locale
// Automatically formats money in the user's native currency
// ============================================================

const COUNTRY_CURRENCY = {
  // South Asia
  'India':       { currency: 'INR', locale: 'en-IN',  symbol: '₹' },
  'Pakistan':    { currency: 'PKR', locale: 'ur-PK',  symbol: '₨' },
  'Bangladesh':  { currency: 'BDT', locale: 'bn-BD',  symbol: '৳' },
  'Sri Lanka':   { currency: 'LKR', locale: 'si-LK',  symbol: 'Rs' },
  'Nepal':       { currency: 'NPR', locale: 'ne-NP',  symbol: 'रू' },

  // East Asia
  'Japan':       { currency: 'JPY', locale: 'ja-JP',  symbol: '¥'  },
  'China':       { currency: 'CNY', locale: 'zh-CN',  symbol: '¥'  },
  'South Korea': { currency: 'KRW', locale: 'ko-KR',  symbol: '₩'  },

  // South-East Asia
  'Indonesia':   { currency: 'IDR', locale: 'id-ID',  symbol: 'Rp' },
  'Thailand':    { currency: 'THB', locale: 'th-TH',  symbol: '฿'  },
  'Singapore':   { currency: 'SGD', locale: 'en-SG',  symbol: 'S$' },
  'Malaysia':    { currency: 'MYR', locale: 'ms-MY',  symbol: 'RM' },
  'Philippines': { currency: 'PHP', locale: 'en-PH',  symbol: '₱'  },
  'Vietnam':     { currency: 'VND', locale: 'vi-VN',  symbol: '₫'  },

  // Middle East
  'UAE':         { currency: 'AED', locale: 'ar-AE',  symbol: 'د.إ' },
  'Saudi Arabia':{ currency: 'SAR', locale: 'ar-SA',  symbol: '﷼'  },
  'Turkey':      { currency: 'TRY', locale: 'tr-TR',  symbol: '₺'  },
  'Israel':      { currency: 'ILS', locale: 'he-IL',  symbol: '₪'  },

  // Europe
  'UK':            { currency: 'GBP', locale: 'en-GB', symbol: '£'  },
  'Germany':       { currency: 'EUR', locale: 'de-DE', symbol: '€'  },
  'France':        { currency: 'EUR', locale: 'fr-FR', symbol: '€'  },
  'Italy':         { currency: 'EUR', locale: 'it-IT', symbol: '€'  },
  'Spain':         { currency: 'EUR', locale: 'es-ES', symbol: '€'  },
  'Netherlands':   { currency: 'EUR', locale: 'nl-NL', symbol: '€'  },
  'Portugal':      { currency: 'EUR', locale: 'pt-PT', symbol: '€'  },
  'Sweden':        { currency: 'SEK', locale: 'sv-SE', symbol: 'kr' },
  'Norway':        { currency: 'NOK', locale: 'nb-NO', symbol: 'kr' },
  'Switzerland':   { currency: 'CHF', locale: 'de-CH', symbol: 'Fr' },
  'Russia':        { currency: 'RUB', locale: 'ru-RU', symbol: '₽'  },

  // Americas
  'USA':           { currency: 'USD', locale: 'en-US', symbol: '$'  },
  'Canada':        { currency: 'CAD', locale: 'en-CA', symbol: 'CA$'},
  'Brazil':        { currency: 'BRL', locale: 'pt-BR', symbol: 'R$' },
  'Mexico':        { currency: 'MXN', locale: 'es-MX', symbol: 'MX$'},
  'Argentina':     { currency: 'ARS', locale: 'es-AR', symbol: '$'  },

  // Africa / Oceania
  'Australia':     { currency: 'AUD', locale: 'en-AU', symbol: 'A$' },
  'New Zealand':   { currency: 'NZD', locale: 'en-NZ', symbol: 'NZ$'},
  'South Africa':  { currency: 'ZAR', locale: 'en-ZA', symbol: 'R'  },
  'Nigeria':       { currency: 'NGN', locale: 'en-NG', symbol: '₦'  },

  // Maldives
  'Maldives':      { currency: 'MVR', locale: 'dv-MV', symbol: 'Rf' },
};

const DEFAULT = { currency: 'USD', locale: 'en-US', symbol: '$' };

/**
 * Get the currency config for a country string.
 * Falls back to USD if the country is not found.
 */
export const getCurrencyConfig = (country) => {
  if (!country) return DEFAULT;
  // Case-insensitive match
  const key = Object.keys(COUNTRY_CURRENCY).find(
    k => k.toLowerCase() === country.trim().toLowerCase()
  );
  return key ? COUNTRY_CURRENCY[key] : DEFAULT;
};

/**
 * Format an amount using the user's country-based currency.
 * @param {number} amount
 * @param {string} country - user.country from AuthContext
 */
export const formatCurrency = (amount, country) => {
  const { currency, locale } = getCurrencyConfig(country);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Get just the currency symbol for a country.
 */
export const getCurrencySymbol = (country) => getCurrencyConfig(country).symbol;

/**
 * Get cost tier labels using the local currency symbol
 * instead of $$$
 */
export const getCostTierLabel = (costIndex, country) => {
  const sym = getCurrencySymbol(country);
  if (costIndex < 1) return { label: sym,         color: '#10B981', text: 'Budget'    };
  if (costIndex < 2) return { label: sym + sym,    color: '#F59E0B', text: 'Moderate'  };
  return               { label: sym + sym + sym, color: '#EF4444', text: 'Expensive' };
};

export const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num || 0);
