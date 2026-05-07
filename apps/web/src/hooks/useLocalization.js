import { useI18n } from './useI18n.js';

export function useLocalization() {
  const { lang } = useI18n();

  const getConfigs = () => {
    switch (lang) {
      case 'EN': return { locale: 'en-US', currency: 'USD', time12: true, phoneCode: '+1' };
      case 'DE': return { locale: 'de-DE', currency: 'EUR', time12: false, phoneCode: '+49' };
      case 'FR': return { locale: 'fr-FR', currency: 'EUR', time12: false, phoneCode: '+33' };
      case 'TR':
      default: return { locale: 'tr-TR', currency: 'TRY', time12: false, phoneCode: '+90' };
    }
  };

  const configs = getConfigs();

  const formatDate = (dateInput) => {
    const date = new Date(dateInput);
    return new Intl.DateTimeFormat(configs.locale, {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(date);
  };

  const formatTime = (dateInput) => {
    const date = new Date(dateInput);
    return new Intl.DateTimeFormat(configs.locale, {
      hour: '2-digit', minute: '2-digit', hour12: configs.time12
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(configs.locale, {
      style: 'currency', currency: configs.currency
    }).format(amount);
  };

  const formatPhone = (phone) => {
    // Basic prefixing if not present
    if (!phone.startsWith('+')) {
      return `${configs.phoneCode} ${phone}`;
    }
    return phone;
  };

  const validatePhone = (phone) => {
    const regex = /^\+?[0-9\s\-()]{8,20}$/;
    return regex.test(phone);
  };

  return { formatDate, formatTime, formatCurrency, formatPhone, validatePhone, configs };
}