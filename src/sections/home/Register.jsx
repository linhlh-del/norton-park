import ConsultForm from '@/components/forms/ConsultForm';
import ContactPanel from '@/components/ContactPanel';
import { submitLead } from '@/lib/lead';

const send = (payload) => submitLead(payload, 'register');

export default function Register({ onSubmit = send }) {
  return (
    <section id="register" className="bg-sand py-section">
      <div className="container-site grid items-start gap-8 lg:grid-cols-2">
        <div data-reveal="left"><ConsultForm onSubmit={onSubmit} /></div>
        <div data-reveal="right" style={{ '--reveal-i': 1 }}><ContactPanel /></div>
      </div>
    </section>
  );
}
