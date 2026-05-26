import { useState, useEffect } from 'react';

export interface AuditMetrics {
  ttfb: number;
  loadTime: number;
  pageSize: number;
  securityScore: number;
  seoScore: number;
  serverType?: string;
  title?: string | null;
  description?: string | null;
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  hasRobotsTxt?: boolean;
  hasLlmsTxt?: boolean;
  robotsTxtIncludesSitemap?: boolean;
  internalLinks?: number;
  externalLinks?: number;
  imgTotal?: number;
  imgWithAlt?: number;
  robotsAllowed?: boolean;
  canonicalDetected?: boolean;
  hasOpenGraph?: boolean;
  socialImage?: string | null;
  ssl?: boolean;
  wordCount?: number;
  entities?: string[];
  aiUnderstanding?: number;
  trustAuthority?: number;
  businessActivation?: number;
  brandImprint?: number;
}

export interface AuditResult {
  url: string;
  score: number;
  timestamp: number;
  metrics: AuditMetrics;
  aiInsights?: string;
}

export function useAuditHistory() {
  const [history, setHistory] = useState<AuditResult[]>([]);

  const load = () => {
    try {
      const data = localStorage.getItem('webblaze_history');
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  useEffect(() => {
    load();
    const handleStorageChange = () => load();
    window.addEventListener('audit_history_changed', handleStorageChange);
    // Also listen to raw storage events in case of multiple tabs
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('audit_history_changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addAudit = (audit: AuditResult) => {
    try {
      const currentRaw = localStorage.getItem('webblaze_history');
      const current = currentRaw ? JSON.parse(currentRaw) : [];
      
      // Keep up to 50 records to allow trend tracking for URLs
      const updated = [audit, ...current].slice(0, 50);
      localStorage.setItem('webblaze_history', JSON.stringify(updated));
      load(); // Update local state directly
      window.dispatchEvent(new Event('audit_history_changed'));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('webblaze_history');
    setHistory([]);
    window.dispatchEvent(new Event('audit_history_changed'));
  };

  return { history, addAudit, clearHistory };
}
