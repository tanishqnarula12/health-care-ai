"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function GoogleTranslate() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <>
            <div id="google_translate_element" className="hidden"></div>
            <Script
                id="google-translate-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,hi',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `,
                }}
            />
            <Script
                id="google-translate-script"
                strategy="afterInteractive"
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            />
        </>
    );
}
