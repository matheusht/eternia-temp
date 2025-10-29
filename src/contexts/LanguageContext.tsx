import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Language = 'en' | 'pt';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    getLocalizedPath: (path: string) => string;
    navigateWithLanguage: (path: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [language, setLanguageState] = useState<Language>('en');

    // Initialize language from URL or localStorage
    useEffect(() => {
        const urlLanguage = location.pathname.startsWith('/pt') ? 'pt' : 'en';
        
        // URL takes absolute priority - if user is on a specific URL, respect that
        // Only fall back to localStorage if no explicit URL language is detected
        let initialLanguage: Language;
        
        if (location.pathname.startsWith('/pt')) {
            // Explicitly on Portuguese route
            initialLanguage = 'pt';
        } else if (location.pathname === '/' || !location.pathname.startsWith('/pt')) {
            // On root or any non-Portuguese route - default to English
            initialLanguage = 'en';
        } else {
            // Fallback (shouldn't happen with current logic)
            const storedLanguage = localStorage.getItem('userLanguage') as Language;
            initialLanguage = storedLanguage || 'en';
        }

        setLanguageState(initialLanguage);

        // Store the detected/selected language
        localStorage.setItem('userLanguage', initialLanguage);

        console.log(`[LanguageContext] URL: ${location.pathname}, Initialized language: ${initialLanguage}`);
    }, [location.pathname]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('userLanguage', lang);
        console.log(`[LanguageContext] Language changed to: ${lang}`);
    };

    const getLocalizedPath = (path: string): string => {
        // Remove any existing language prefix
        const cleanPath = path.replace(/^\/pt/, '');

        // Add language prefix if Portuguese
        if (language === 'pt') {
            return `/pt${cleanPath}`;
        }

        return cleanPath;
    };

    const navigateWithLanguage = (path: string) => {
        const localizedPath = getLocalizedPath(path);
        console.log(`[LanguageContext] Navigating to: ${localizedPath}`);
        navigate(localizedPath);
    };

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage,
            getLocalizedPath,
            navigateWithLanguage
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguageContext = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguageContext must be used within a LanguageProvider');
    }
    return context;
};