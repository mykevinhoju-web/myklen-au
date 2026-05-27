import { ContactInquiryForm } from '@/components/contact/ContactInquiryForm'

export default function ContactPage() {
  return (
    <div className="page">
      <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
        <div className="mb-8">
          <p className="eyebrow">Contact</p>
          <h1 className="display-title text-3xl sm:text-4xl" style={{ marginBottom: '10px' }}>
            Let&apos;s talk
          </h1>
          <p className="lead max-w-2xl">
            Send us a message and make sure to include your <strong>email</strong> and{' '}
            <strong>phone</strong> so we can reach you.
          </p>
        </div>

        <ContactInquiryForm />
      </section>
    </div>
  )
}

