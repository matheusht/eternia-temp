# Implementation Plan

- [x] 1. Complete English translations in translation files
  - [x] 1.1 Analyze missing English translation keys in src/i18n/translations.ts
    - Compare Portuguese and English translation objects to identify missing keys
    - Document all missing translation paths and their Portuguese equivalents
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 1.2 Complete English translations for all missing keys
    - Translate all missing keys from Portuguese to English
    - Ensure translation accuracy and context appropriateness
    - Maintain consistent terminology across all translation categories
    - _Requirements: 5.1, 5.4, 5.5_

- [x] 2. Update language detection system
  - [x] 2.1 Modify useTranslation hook for route-based detection
    - Replace profile-based language detection with useLocation() from react-router-dom
    - Implement language detection logic that checks if URL starts with /pt
    - Maintain existing translation interface (t function and language property)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2_
  
  - [ ]* 2.2 Add unit tests for language detection logic
    - Test URL parsing for different route patterns (/pt/*, /*)
    - Test language detection accuracy and fallback behavior
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Implement route-based routing structure
  - [x] 3.1 Update App.tsx with nested route configuration
    - Create route structure supporting optional /pt language prefix
    - Implement nested routes for all existing pages (/, /auth, /horoscope, etc.)
    - Add Portuguese routes (/pt, /pt/auth, /pt/horoscope, etc.)
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 6.1, 6.2_
  
  - [x] 3.2 Implement language-aware route navigation
    - Ensure route transitions preserve language context
    - Handle route changes and language detection updates
    - _Requirements: 6.3, 6.4, 6.5_
  
  - [ ]* 3.3 Add integration tests for route navigation
    - Test navigation between English and Portuguese routes
    - Test component rendering with correct language context
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 4. Update page components for route-based translations
  - [x] 4.1 Update authentication page (src/pages/Auth.tsx)
    - Replace profile-based translation usage with route-based useTranslation hook
    - Test all authentication flows in both languages
    - _Requirements: 7.1, 7.3, 7.4_
  
  - [x] 4.2 Update horoscope page (src/pages/Horoscope.tsx)
    - Update translation usage to work with route-based language detection
    - Ensure all horoscope content displays correctly in both languages
    - _Requirements: 7.1, 7.3, 7.4_
  
  - [x] 4.3 Update compatibility page (src/pages/Compatibility.tsx)
    - Implement route-based translation system
    - Test compatibility calculations and displays in both languages
    - _Requirements: 7.1, 7.3, 7.4_
  
  - [x] 4.4 Update love sketch page (src/pages/LoveSketch.tsx)
    - Convert to route-based translation system
    - Ensure form validation and sketch generation work in both languages
    - _Requirements: 7.1, 7.3, 7.4_
  
  - [x] 4.5 Update tarot page (src/pages/Tarot.tsx)
    - Implement route-based translations for tarot readings
    - Test card selection and interpretation in both languages
    - _Requirements: 7.1, 7.3, 7.4_
  
  - [x] 4.6 Update AI oracle page (src/pages/AIOracle.tsx)
    - Convert oracle functionality to use route-based translations
    - Test question submission and response display in both languages
    - _Requirements: 7.1, 7.3, 7.4_
  
  - [x] 4.7 Update astral map page (src/pages/AstralMap.tsx)
    - Implement route-based translation system for astral map content
    - Ensure astrological calculations display correctly in both languages
    - _Requirements: 7.1, 7.3, 7.4_
  
  - [x] 4.8 Update weekly report page (src/pages/WeeklyReport.tsx)
    - Convert weekly report generation to use route-based translations
    - Test report content and formatting in both languages
    - _Requirements: 7.1, 7.3, 7.4_

- [x] 5. Update UI components for route-based translations
  - [x] 5.1 Update sidebar component (src/components/EterniaSidebar.tsx)
    - Convert navigation links to use route-based translations
    - Implement language-aware navigation URLs
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [x] 5.2 Update daily dashboard (src/components/DailyDashboard.tsx)
    - Implement route-based translation system for dashboard content
    - Test user data display and spiritual practices in both languages
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [x] 5.3 Update daily horoscope component (src/components/DailyHoroscope.tsx)
    - Convert horoscope display to use route-based translations
    - Ensure zodiac signs and predictions display correctly in both languages
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [x] 5.4 Update marriage compatibility component (src/components/MarriageCompatibility.tsx)
    - Implement route-based translations for compatibility analysis
    - Test compatibility calculations and advice in both languages
    - _Requirements: 7.2, 7.3, 7.4_

- [x] 6. Update onboarding components for route-based translations
  - [x] 6.1 Update astrological chart component (src/components/onboarding/AstrologicalChart.tsx)
    - Convert chart display to use route-based translations
    - Test astrological house descriptions and interpretations in both languages
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [x] 6.2 Update zodiac wheel component (src/components/onboarding/ZodiacWheel.tsx)
    - Implement route-based translation system for zodiac wheel
    - Ensure zodiac sign names and descriptions display correctly in both languages
    - _Requirements: 7.2, 7.3, 7.4_

- [x] 7. Update love sketch components for route-based translations
  - [x] 7.1 Update love sketch form (src/components/love-sketch/LoveSketchForm.tsx)
    - Convert form fields and validation to use route-based translations
    - Test form submission and error handling in both languages
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [x] 7.2 Update love sketch gallery (src/components/love-sketch/LoveSketchGallery.tsx)
    - Implement route-based translations for gallery interface
    - Test sketch display and management features in both languages
    - _Requirements: 7.2, 7.3, 7.4_

- [x] 8. Validation and testing
  - [x] 8.1 Comprehensive component testing
    - Test all updated components with both English and Portuguese routes
    - Verify translation accuracy and context appropriateness
    - Ensure no functionality is broken during language detection changes
    - _Requirements: 7.3, 7.4, 7.5_
  
  - [x] 8.2 Route navigation validation
    - Test direct URL access for both language variants
    - Verify browser back/forward navigation works correctly
    - Test URL sharing and bookmarking functionality
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 8.3 End-to-end testing for user journeys
    - Test complete user workflows in English (/, /horoscope, /auth, etc.)
    - Test complete user workflows in Portuguese (/pt, /pt/horoscope, /pt/auth, etc.)
    - Verify state preservation during route changes
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 8.1, 8.2, 8.3, 8.4_