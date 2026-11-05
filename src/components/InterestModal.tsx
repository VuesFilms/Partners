import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useApp, type InterestKind } from '../context/AppContext';
import { fill, ui, type L } from '../i18n/dictionary';
import { Overlay } from './Overlay';

interface Props {
  open: boolean;
  onClose: () => void;
  kind: InterestKind;
  targetId: string;
  targetName: L;
}

type Fields = { name: string; company: string; email: string; phone: string; message: string };
const empty: Fields = { name: '', company: '', email: '', phone: '', message: '' };

export function InterestModal({ open, onClose, kind, targetId, targetName }: Props) {
  const { t, tr, lang, addInterest } = useApp();
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const messageEdited = useRef(false);

  const tpl = kind === 'franchise' ? ui.templateToFranchise : kind === 'investor' ? ui.templateToInvestor : ui.templateToMarket;
  const template = () => fill(tpl[lang], { name: tr(targetName) });

  // Reset every time the modal opens
  useEffect(() => {
    if (open) {
      messageEdited.current = false;
      setFields({ ...empty, message: template() });
      setErrors({});
      setStatus('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, targetId]);

  // Re-translate the pre-filled message on language switch, unless the user edited it
  useEffect(() => {
    if (open && !messageEdited.current) setFields((f) => ({ ...f, message: template() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    if (k === 'message') messageEdited.current = true;
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (!fields.name.trim()) er.name = t('errRequired');
    if (!fields.email.trim()) er.email = t('errRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim())) er.email = t('errEmail');
    if (!fields.message.trim()) er.message = t('errRequired');
    setErrors(er);
    if (Object.keys(er).length) {
      const first = Object.keys(er)[0];
      document.getElementById(`im-${first}`)?.focus();
      return;
    }
    setStatus('sending');
    window.setTimeout(() => {
      addInterest({ kind, targetId, ...fields });
      setStatus('done');
    }, 700);
  };

  const isFr = kind === 'franchise';
  const isMarket = kind === 'market';
  const titlePrefix = isFr ? t('modalTitleFranchise') : isMarket ? t('modalTitleMarket') : t('modalTitleInvestor');
  const title = status === 'done' ? t('successTitle') : `${titlePrefix} ${tr(targetName)}`;
  const successBody = isFr ? ui.successBodyFranchise : isMarket ? ui.successBodyMarket : ui.successBodyInvestor;

  const field = (k: keyof Fields, label: string, opts: { type?: string; placeholder?: string; optional?: boolean; ltr?: boolean; autoComplete?: string; inputMode?: 'email' | 'tel' | 'text' } = {}) => (
    <div>
      <label htmlFor={`im-${k}`} className="field-label">
        {label}
        {opts.optional && <span className="font-normal text-muted"> ({t('optional')})</span>}
      </label>
      <input
        id={`im-${k}`}
        type={opts.type ?? 'text'}
        value={fields[k]}
        onChange={set(k)}
        placeholder={opts.placeholder}
        autoComplete={opts.autoComplete}
        inputMode={opts.inputMode}
        dir={opts.ltr ? 'ltr' : undefined}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `im-${k}-err` : undefined}
        className={`field ${opts.ltr ? 'rtl:text-right' : ''} ${errors[k] ? 'border-secondary-ink/70 focus:border-secondary-ink' : ''}`}
        {...(k === 'name' ? { 'data-autofocus': true } : {})}
      />
      {errors[k] && (
        <p id={`im-${k}-err`} className="mt-1.5 text-sm text-secondary-ink">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <Overlay
      open={open}
      onClose={onClose}
      title={title}
      subtitle={status === 'done' ? undefined : t('modalIntro')}
      footer={
        status === 'done' ? (
          <button type="button" className="btn-contrast w-full" onClick={onClose} data-autofocus>
            {t('done')}
          </button>
        ) : (
          <div className="flex gap-3">
            <button type="button" className="btn-outline flex-1" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" form="interest-form" className="btn-primary flex-[2]" disabled={status === 'sending'}>
              {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="rtl-flip h-4 w-4" />}
              {status === 'sending' ? t('sending') : t('send')}
            </button>
          </div>
        )
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === 'done' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
              className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_32px_-12px_rgb(52_107_109/0.9)]"
            >
              <CheckCircle2 className="h-8 w-8" />
            </motion.span>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed">
              {fill(successBody[lang], { name: tr(targetName) })}
            </p>
            <p className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted">{t('demoNoEmail')}</p>
          </motion.div>
        ) : (
          <motion.form key="form" id="interest-form" noValidate onSubmit={submit} exit={{ opacity: 0 }} className="grid gap-4 pt-1">
            <div className="grid gap-4 sm:grid-cols-2">
              {field('name', t('fullName'), { placeholder: isFr || isMarket ? t('phNameFr') : t('phNameInv'), autoComplete: 'name' })}
              {field('company', t('company'), { placeholder: isFr ? t('phCompanyFr') : isMarket ? t('phCompanyMarket') : t('phCompanyInv'), optional: true, autoComplete: 'organization' })}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {field('email', t('email'), { type: 'email', placeholder: t('phEmail'), ltr: true, autoComplete: 'email', inputMode: 'email' })}
              {field('phone', t('phone'), { type: 'tel', placeholder: t('phPhone'), optional: true, ltr: true, autoComplete: 'tel', inputMode: 'tel' })}
            </div>
            <div>
              <label htmlFor="im-message" className="field-label">
                {t('message')}
              </label>
              <textarea
                id="im-message"
                rows={6}
                value={fields.message}
                onChange={set('message')}
                aria-invalid={!!errors.message}
                className={`field py-3 leading-relaxed ${errors.message ? 'border-secondary-ink/70' : ''}`}
              />
              {errors.message && <p className="mt-1.5 text-sm text-secondary-ink">{errors.message}</p>}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Overlay>
  );
}
