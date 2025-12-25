import { useState, useEffect } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.tsx';
import { useTranslations } from '@/i18n/utils.ts';
import { ui } from '@/i18n/ui.ts';

interface MobileMenuProps {
  lang: keyof typeof ui;
}

export default function MobileMenu({ lang }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations(lang);

  // Close menu when route changes (hash changes)
  useEffect(() => {
    const handleHashChange = () => setOpen(false);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleLinkClick = (href: string) => {
    setOpen(false);
    // For hash links (same-page anchors), scroll to element without page reload
    if (href.startsWith('#')) {
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // For external links, use default navigation
      window.location.href = href;
    }
  };

  const navLinks = [
    { href: '#features', label: t('nav.features') },
    { href: '#how-it-works', label: t('nav.how-it-works') },
    { href: '#roadmap', label: t('nav.roadmap') },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="md:hidden p-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] max-w-sm">
        <nav className="flex flex-col gap-2 mt-8" aria-label="Mobile navigation">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="px-4 py-3 text-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
