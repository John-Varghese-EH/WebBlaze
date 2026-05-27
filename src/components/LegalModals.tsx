import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export function LegalModals() {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'cookies' | null>(null);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#privacy') setModalType('privacy');
      else if (hash === '#terms') setModalType('terms');
      else if (hash === '#cookies') setModalType('cookies');
      else setModalType(null);
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  if (!modalType) return null;

  const close = () => {
    window.history.pushState(null, '', window.location.pathname);
    setModalType(null);
  };

  const content = {
    privacy: {
      title: 'Privacy Policy',
      text: `Effective Date: ${new Date().toLocaleDateString()}

1. Information We Collect
We collect the URLs you submit for auditing to generate performance metrics. We also temporarily store IP addresses for rate-limiting purposes. We do NOT collect personal mapping to your domain scans.

2. Usage Data & AI Processing
We utilize Google Gemini APIs for extracting AI insights from the text content of scanned websites. Only the public markup of the requested site is passed to these APIs.

3. Third-Party Services
We may use Vercel, Google Cloud, and other providers for hosting. Your interactions may be subject to their respective privacy controls.

4. Data Retention
Audit records may be stored publicly on our Hall of Fame. If you wish to remove your scan, please contact us. No guarantees are made regarding permanent storage of your audits.`
    },
    terms: {
      title: 'Terms of Service',
      text: `Effective Date: ${new Date().toLocaleDateString()}

1. Acceptance of Terms
By using WebBlaze, you agree to abide by these terms. If you do not agree, do not use the tool.

2. Intended Use
WebBlaze is provided "AS IS" for informational purposes to gauge website performance and AI readability. We make no guarantees of accuracy.

3. Abuse & Rate Limiting
You agree not to spam or launch denial-of-service attempts against our endpoints. We reserve the right to throttle or IP ban abusive actors dynamically.

4. Intellectual Property
WebBlaze is built by John Varghese (J0X). The underlying source code may be open-sourced, but the branding "WebBlaze" remains property of its respective owner.

5. Limitation of Liability
Under no circumstances shall the creators of WebBlaze be liable for any direct or indirect damages arising out of the use of this free tool.`
    },
    cookies: {
      title: 'Cookies Policy',
      text: `Effective Date: ${new Date().toLocaleDateString()}

We use minimal cookies and local storage items to improve your experience:

1. Local History: We use LocalStorage to keep track of your recent scans \`webblaze_history\`.
2. Theme Preference: We store your color theme preference (Light/Dark mode).
3. No Tracking Cookies: We do not use cross-site tracking cookies or intrusive advertising pixels.

By continuing to use this site, you accept our use of LocalStorage for functional purposes.`
    }
  };

  const { title, text } = content[modalType];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border-strong)] rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-[var(--color-brand-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-brand-text)] font-mono">{title}</h2>
          <button onClick={close} className="p-2 text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] hover:bg-[var(--color-brand-charcoal-light)] rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--color-brand-muted)]">
          {text}
        </div>
        <div className="p-6 border-t border-[var(--color-brand-border)] flex justify-end">
          <button onClick={close} className="px-6 py-2 bg-[var(--color-brand-text)] text-[var(--color-brand-bg)] font-bold rounded-lg hover:opacity-80 transition-opacity">
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
