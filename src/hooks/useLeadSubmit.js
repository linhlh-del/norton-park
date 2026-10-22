import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { translate, useLang, useLocalizedNavigate } from '@/i18n';
import { submitLead } from '@/lib/lead';

/**
 * Gửi lead rồi chuyển sang trang cảm ơn /cam-on (đích chuyển đổi cho GTM / Ads).
 * Thất bại → giữ nguyên form, trả `error` (câu tiếng Việt từ Worker) để hiển thị.
 *   const { send, status, error } = useLeadSubmit('register');
 *   await send({ name, phone, email, unitType, website })   // true nếu thành công
 */
export default function useLeadSubmit(formId) {
  const navigate = useLocalizedNavigate();
  const lang = useLang();
  const { pathname, search, hash } = useLocation();
  const [status, setStatus] = useState('idle'); // idle | sending | failed
  const [error, setError] = useState('');

  const send = useCallback(async (payload, id = formId) => {
    setStatus('sending');
    setError('');
    try {
      await submitLead(payload, id);
    } catch (err) {
      setStatus('failed');
      /* lỗi từ Worker là tiếng Việt; bản tiếng Anh hiện câu chung */
      setError(lang === 'vi' ? err.message : translate(lang, 'form.err.send') + '.');
      return false;
    }
    setStatus('idle');
    navigate('/cam-on', { state: { from: pathname + search + hash } });
    return true;
  }, [formId, navigate, lang, pathname, search, hash]);

  return { send, status, error };
}
