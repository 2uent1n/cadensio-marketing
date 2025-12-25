import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslations } from '@/i18n/utils.ts';
import { ui } from '@/i18n/ui.ts';
import { actions } from 'astro:actions';

interface WaitlistFormProps {
  lang: keyof typeof ui;
}

export default function WaitlistForm({ lang }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const t = useTranslations(lang);

  useEffect(() => {
    setIsMounted(true);
    setEmail('');
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setHasFailed(false);
    setIsSubmitted(false);

    try {
      const result = await actions.createWaitlistEntry({ email });
      if (result.data?.success === true) {
        setIsLoading(false);
        setIsSubmitted(true);
      } else {
        setIsLoading(false);
        setHasFailed(true);
      }
    } catch {
      setIsLoading(false);
      setHasFailed(true);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error state when user starts typing
    if (hasFailed) setHasFailed(false);
  };

  if (isSubmitted) {
    return (
      <div className="text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <div className="animate-in zoom-in-0 duration-500 delay-200">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">{t('waitlist.form.success.title')}</h3>
        <p className="text-muted-foreground">{t('waitlist.form.success.message')}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder={t('waitlist.form.placeholder')}
          value={email}
          onChange={handleEmailChange}
          required
          className={`flex-1 h-12 px-5 text-base ${hasFailed ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          disabled={isLoading}
          aria-invalid={hasFailed ? 'true' : 'false'}
          aria-describedby={hasFailed ? 'waitlist-error' : undefined}
        />
        <Button
          type="submit"
          size="lg"
          disabled={!isMounted || isLoading || !email}
          className="h-12 px-6 group"
          suppressHydrationWarning
        >
          {isLoading ? (
            <span>{t('waitlist.form.loading')}</span>
          ) : (
            <>
              {t('waitlist.form.button')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>

      {hasFailed && (
        <div
          id="waitlist-error"
          className="flex items-start gap-2 text-sm text-destructive animate-in fade-in slide-in-from-top-2 duration-200"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-medium">{t('waitlist.form.error.title')}</span>
            {' • '}
            <span>{t('waitlist.form.error.message')}</span>
          </div>
        </div>
      )}
    </form>
  );
}
