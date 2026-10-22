import ConsultForm from '@/components/forms/ConsultForm';
import ContactPanel from '@/components/ContactPanel';

export default function Register() {
  return (
    <section id="register" className="bg-sand py-section">
      <div className="container-site grid items-start gap-8 lg:grid-cols-2">
        <div data-reveal="left"><ConsultForm formId="register" /></div>
        <div data-reveal="right" style={{ '--reveal-i': 1 }}><ContactPanel /></div>
      </div>
    </section>
  );
}
