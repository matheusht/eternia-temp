# Requirements Document

## Introduction

This feature implements a route-based internationalization (i18n) system for a Vite+React application that determines language based on URL structure rather than user profile settings. The system supports English as the default language and Portuguese with a `/pt` prefix, providing a clean and SEO-friendly approach to multilingual content.

## Glossary

- **Route_Based_I18n_System**: The internationalization system that determines language from URL path structure
- **Language_Detector**: Component responsible for extracting language from current route
- **Translation_Hook**: React hook that provides translation functions based on current route language
- **Route_Structure**: URL pattern that includes optional language prefix for non-English languages
- **Default_Language**: English language served at root paths without language prefix
- **Prefixed_Language**: Portuguese language served at paths with `/pt` prefix

## Requirements

### Requirement 1

**User Story:** As a user, I want to access the application in English by default, so that I can use the application without any language prefix in the URL

#### Acceptance Criteria

1. WHEN a user visits the root path "/", THE Route_Based_I18n_System SHALL serve content in English
2. WHEN a user visits any path without language prefix (e.g., "/horoscope", "/auth"), THE Route_Based_I18n_System SHALL serve content in English
3. THE Route_Based_I18n_System SHALL treat English as the default language for all unprefixed routes
4. THE Route_Based_I18n_System SHALL maintain all existing functionality while serving English content
5. THE Route_Based_I18n_System SHALL load English translations from the translation configuration

### Requirement 2

**User Story:** As a Portuguese-speaking user, I want to access the application in Portuguese using `/pt` prefix, so that I can use the application in my preferred language

#### Acceptance Criteria

1. WHEN a user visits "/pt", THE Route_Based_I18n_System SHALL serve the homepage content in Portuguese
2. WHEN a user visits any path with "/pt" prefix (e.g., "/pt/horoscope", "/pt/auth"), THE Route_Based_I18n_System SHALL serve content in Portuguese
3. THE Route_Based_I18n_System SHALL recognize "/pt" prefix as Portuguese language indicator
4. THE Route_Based_I18n_System SHALL maintain all existing functionality while serving Portuguese content
5. THE Route_Based_I18n_System SHALL load Portuguese translations from the translation configuration

### Requirement 3

**User Story:** As a developer, I want the language detection to be automatic based on URL, so that I don't need to implement manual language switching mechanisms

#### Acceptance Criteria

1. THE Language_Detector SHALL automatically determine language from current URL path
2. THE Language_Detector SHALL extract language information using React Router's useLocation hook
3. WHEN the URL path starts with "/pt", THE Language_Detector SHALL return Portuguese as current language
4. WHEN the URL path does not start with "/pt", THE Language_Detector SHALL return English as current language
5. THE Language_Detector SHALL update language context when route changes occur

### Requirement 4

**User Story:** As a developer, I want a centralized translation system, so that all components automatically use the correct language without individual configuration

#### Acceptance Criteria

1. THE Translation_Hook SHALL provide translation functions based on current route language
2. THE Translation_Hook SHALL replace profile-based language detection with route-based detection
3. THE Translation_Hook SHALL maintain the same translation key structure (e.g., t('auth.welcomeTitle'))
4. THE Translation_Hook SHALL automatically update when route language changes
5. THE Translation_Hook SHALL provide consistent translation interface across all components

### Requirement 5

**User Story:** As a content manager, I want complete English translations, so that English users have full access to all application features

#### Acceptance Criteria

1. THE Route_Based_I18n_System SHALL provide complete English translations for all existing Portuguese keys
2. THE Route_Based_I18n_System SHALL ensure English translation object contains all keys present in Portuguese translations
3. THE Route_Based_I18n_System SHALL maintain translation key consistency between languages
4. THE Route_Based_I18n_System SHALL provide accurate English translations for all user interface elements
5. THE Route_Based_I18n_System SHALL support all existing translation categories (auth, horoscope, compatibility, etc.)

### Requirement 6

**User Story:** As a developer, I want the routing system to handle both languages seamlessly, so that users can navigate between pages in their chosen language

#### Acceptance Criteria

1. THE Route_Structure SHALL support nested routes with optional language parameter
2. THE Route_Structure SHALL maintain existing page routes under language-specific paths
3. THE Route_Structure SHALL handle route transitions within the same language context
4. THE Route_Structure SHALL preserve application state during language-based navigation
5. THE Route_Structure SHALL provide clean URLs for both English and Portuguese content

### Requirement 7

**User Story:** As a developer, I want all existing components to work with the new system, so that the migration is seamless and doesn't break functionality

#### Acceptance Criteria

1. THE Route_Based_I18n_System SHALL update all page components to use route-based translations
2. THE Route_Based_I18n_System SHALL update all UI components to use route-based translations
3. THE Route_Based_I18n_System SHALL maintain existing component functionality and behavior
4. THE Route_Based_I18n_System SHALL preserve all component props and state management
5. THE Route_Based_I18n_System SHALL ensure backward compatibility with existing translation usage patterns

### Requirement 8

**User Story:** As a developer, I want the system to be extensible, so that I can easily add more languages in the future

#### Acceptance Criteria

1. THE Route_Based_I18n_System SHALL implement a scalable architecture for additional languages
2. THE Language_Detector SHALL support configurable language prefix patterns
3. THE Translation_Hook SHALL accommodate multiple language configurations
4. THE Route_Structure SHALL allow for additional language prefixes without major refactoring
5. THE Route_Based_I18n_System SHALL maintain clean separation between language detection and translation logic