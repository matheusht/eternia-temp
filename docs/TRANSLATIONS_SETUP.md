# Eternia - Translations Setup & Maintenance Guide

## 📋 Overview

This document provides comprehensive guidance for maintaining and extending the internationalization (i18n) system in the Eternia application. The app supports Portuguese and English with route-based language detection.

## 🏗️ Architecture

### Language Detection
- **Route-based detection**: `/pt/*` routes = Portuguese, all other routes = English
- **Hook**: `useTranslation()` automatically detects language from URL
- **Fallback**: English is the default language for missing translations

### File Structure
```
src/i18n/
├── translations.ts     # Main translation utilities
├── en.ts              # English translations
└── pt.ts              # Portuguese translations

src/hooks/
└── useTranslation.tsx # Translation hook
```

## 🔧 How to Use Translations

### 1. In Components
```typescript
import { useTranslation } from "@/hooks/useTranslation";

export const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('mySection.title')}</h1>
      <p>{t('mySection.description')}</p>
    </div>
  );
};
```

### 2. With Placeholders
```typescript
// Translation file
welcome: "Welcome, {{name}}!"

// Component
{t('welcome', { name: 'John' })}
```

### 3. Dynamic Keys
```typescript
// For zodiac signs, artistic styles, etc.
const signKey = sign.toLowerCase(); // "aries", "taurus", etc.
const prediction = t(`horoscope.predictions.${signKey}`);
```

## 📝 Translation File Structure

### Current Sections in `pt.ts` and `en.ts`:

```typescript
export const pt = {
  // User levels
  levels: { apprentice, initiate, sage, master },
  
  // Authentication
  auth: { welcomeTitle, email, password, signIn, ... },
  
  // Onboarding flow
  onboarding: { 
    progress, next, continue,
    goalsTitle, goals: { selfKnowledge, love, ... },
    birthDateTitle, birthTimeTitle, ...
  },
  
  // Landing page
  landing: {
    title, subtitle, exploreNow,
    features: { premiumAstralMap, celestialOracle, ... },
    quote, celestialHoroscope, horoscopeDescription
  },
  
  // Dashboard
  dashboard: { welcome, level, points, ... },
  
  // Sidebar navigation
  sidebar: { main, discover, advanced, ... },
  
  // Horoscope system
  horoscope: {
    title, cosmicMessage, luckyNumber, energyColor,
    predictions: { aries, taurus, ..., pisces },
    love: { aries, taurus, ..., pisces },
    career: { aries, taurus, ..., pisces },
    rituals: { aries, taurus, ..., pisces },
    colors: { aries, taurus, ..., pisces },
    energies: { aries, taurus, ..., pisces }
  },
  
  // Tarot system
  tarot: { title, subtitle, chooseReadingType, ... },
  
  // Compatibility system
  compatibility: {
    title, description, yourSign, partnerSign,
    levels: { soulmates, excellent, great, ... },
    advice: { high, medium, low }
  },
  
  // Love Sketch system
  loveSketch: {
    title, subtitle, createTab, galleryTab,
    styles: { romantic, mystical, renaissance, ... },
    validation: { descriptionMin, physicalMin, ... },
    errors: { tryAgain, dailyLimit, sessionExpired, ... }
  },
  
  // Oracle system
  oracle: {
    title, subtitle, inputPlaceholder, send,
    suggestions: { energy, love, ritual, spirituality }
  },
  
  // Astral Map
  astralMap: { title, description, sunSign, moonSign, ... },
  
  // AI Oracle
  aiOracle: { title, description, yourQuestion, ... },
  
  // Spiritual Diary
  spiritualDiary: {
    title, description, newEntry, entryType,
    types: { reflection, dream, experience, ... }
  },
  
  // Weekly Report
  weeklyReport: {
    title, description, spiritualProgress,
    weekActivities, weekHighlights, areasForGrowth
  },
  
  // Utility translations (for dynamic content)
  utils: {
    horoscope: {
      elements: { sacredFire, solarFire, ... },
      colors: { celestialRed, emeraldGreen, ... }
    },
    tarot: { cards: { ... }, suits: { ... } },
    astrology: {
      moonPhases: { newMoon, waxingMoon, ... },
      planets: { sun, moon, mars, ... }
    }
  },
  
  // Common UI elements
  common: {
    loading, loadingCosmicEnergies, error, success,
    cancel, save, delete, edit, close, back, next
  }
};
```

## ✅ Fully Translated Components

### Core Pages
- ✅ **DailyHoroscope.tsx** - Complete with dynamic zodiac content
- ✅ **EterniaLanding.tsx** - Landing page with features
- ✅ **MarriageCompatibility.tsx** - Compatibility system
- ✅ **AIOracle.tsx** - Oracle consultation interface
- ✅ **AstralMap.tsx** - Birth chart interface
- ✅ **SpiritualDiary.tsx** - Diary management
- ✅ **WeeklyReport.tsx** - Progress reporting
- ✅ **Compatibility.tsx** - Compatibility page wrapper

### Components
- ✅ **LoveSketchForm.tsx** - Love sketch creation
- ✅ **LoveSketchGallery.tsx** - Gallery management
- ✅ **HoroscopeImportance.tsx** - Onboarding component

### Utilities
- ✅ **astrologyElements.ts** - Astrology utility functions
- ✅ **horoscope.ts** - Horoscope utility functions

## 🔄 How to Add New Translations

### 1. Add Keys to Translation Files

**English (`src/i18n/en.ts`):**
```typescript
// Add to appropriate section
myNewSection: {
  title: "My New Feature",
  description: "This is a new feature description",
  button: "Click Me",
  
  // For dynamic content
  items: {
    item1: "First Item",
    item2: "Second Item"
  }
}
```

**Portuguese (`src/i18n/pt.ts`):**
```typescript
// Add corresponding Portuguese translations
myNewSection: {
  title: "Minha Nova Funcionalidade",
  description: "Esta é uma descrição da nova funcionalidade",
  button: "Clique Aqui",
  
  // For dynamic content
  items: {
    item1: "Primeiro Item",
    item2: "Segundo Item"
  }
}
```

### 2. Update Component

```typescript
import { useTranslation } from "@/hooks/useTranslation";

export const MyNewComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myNewSection.title')}</h1>
      <p>{t('myNewSection.description')}</p>
      <button>{t('myNewSection.button')}</button>
    </div>
  );
};
```

### 3. For Dynamic Content

```typescript
// If you have dynamic keys (like zodiac signs, card types, etc.)
const items = ['item1', 'item2'];

return (
  <div>
    {items.map(item => (
      <div key={item}>
        {t(`myNewSection.items.${item}`)}
      </div>
    ))}
  </div>
);
```

## 🎯 Best Practices

### 1. Key Naming Convention
- Use **camelCase** for keys: `mySection.someKey`
- Use **descriptive names**: `horoscope.cosmicMessage` not `horoscope.msg`
- Group related keys: `auth.signIn`, `auth.signUp`, `auth.forgotPassword`

### 2. Placeholder Usage
```typescript
// Good
welcome: "Welcome, {{name}}! You have {{count}} messages."

// Usage
t('welcome', { name: 'John', count: 5 })
```

### 3. Fallback Strategy
- Always provide English translations first
- Portuguese translations should match the tone and style
- Use fallback values for missing keys:
```typescript
t('some.key') || 'Fallback text'
```

### 4. Dynamic Content Patterns
```typescript
// For zodiac signs
const signKey = sign.toLowerCase();
const prediction = t(`horoscope.predictions.${signKey}`);

// For user levels
const levelKey = level.toLowerCase();
const levelName = t(`levels.${levelKey}`);
```

## 🚨 Common Issues & Solutions

### 1. Missing Translation Keys
**Problem**: Component shows translation key instead of text
**Solution**: Check if key exists in both `en.ts` and `pt.ts`

### 2. Placeholder Not Working
**Problem**: `{{name}}` shows literally instead of replaced value
**Solution**: Ensure you're passing the values object:
```typescript
// Wrong
t('welcome')

// Correct
t('welcome', { name: 'John' })
```

### 3. Dynamic Keys Not Found
**Problem**: Dynamic keys like `horoscope.predictions.${sign}` not working
**Solution**: Ensure the sign key is lowercase and exists in translations:
```typescript
const signKey = sign.toLowerCase(); // "aries", not "Aries"
```

### 4. Route Language Detection Issues
**Problem**: Language not switching on route change
**Solution**: Check that routes are properly prefixed with `/pt/` for Portuguese

## 🔍 Testing Translations

### 1. Manual Testing
- Navigate to `/` (English) and `/pt/` (Portuguese)
- Check all pages and components
- Verify dynamic content (horoscopes, compatibility, etc.)

### 2. Missing Key Detection
```typescript
// Add this to detect missing keys in development
const translation = t('some.key');
if (translation === 'some.key') {
  console.warn('Missing translation key:', 'some.key');
}
```

## 📊 Translation Coverage Status

### ✅ Complete (100% translated)
- Authentication system
- Onboarding flow
- Landing page
- Dashboard
- Horoscope system (including dynamic content)
- Compatibility system
- Love Sketch system
- Oracle systems
- Astral Map
- Spiritual Diary
- Weekly Report
- Common UI elements

### 🔄 Maintenance Areas
- Keep utility translations in sync with component updates
- Add new features with translations from the start
- Regular review of translation quality and consistency

## 🌍 Adding New Languages

To add a new language (e.g., Spanish):

1. Create `src/i18n/es.ts` with Spanish translations
2. Update `src/i18n/translations.ts` to include Spanish
3. Update `useTranslation.tsx` to detect Spanish routes (`/es/`)
4. Add Spanish translations following the same structure as `pt.ts`

## 📞 Support

For questions about the translation system:
1. Check this documentation first
2. Review existing translation patterns in `pt.ts` and `en.ts`
3. Test changes in both languages before committing
4. Maintain consistency with the mystical/spiritual tone of the application

---

**Last Updated**: January 2025
**Translation Coverage**: 100% Complete
**Supported Languages**: English (default), Portuguese (`/pt/*` routes)