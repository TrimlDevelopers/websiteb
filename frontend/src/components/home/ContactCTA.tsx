import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Mail, Phone, Globe, MapPin, Send, ArrowRight, Loader2, Building2 } from 'lucide-react'
import { ApiError } from '../../api/client'
import { submitContactEnquiry } from '../../api/contact'
import { company } from '../../data/content'
import { serviceNavItems } from '../../data/serviceNav'
import { useBackendStatus } from '../../hooks/useBackendStatus'
import Button from '../ui/Button'
import AnimateIn from '../ui/AnimateIn'

const contactItems = [
  { icon: Building2, text: company.name, href: undefined },
  { icon: Phone, text: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
  { icon: Mail, text: company.email, href: `mailto:${company.email}` },
  { icon: Globe, text: company.website, href: `https://${company.website}` },
  { icon: MapPin, text: company.location, href: undefined },
] as const

const inputClass =
  'box-border w-full rounded-lg border border-white/10 bg-navy-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand-500/50 disabled:opacity-60'

interface ContactCTAProps {
  /** `page` = dedicated /contact layout; `section` = home/other page CTA */
  variant?: 'section' | 'page'
}

export default function ContactCTA({ variant = 'section' }: ContactCTAProps) {
  const isPage = variant === 'page'
  const { isWaking, isUnavailable, ensureReady, retry } = useBackendStatus()
  const sectionRef = useRef<HTMLElement>(null)
  const [clientReady, setClientReady] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setClientReady(true)
  }, [])

  // Wake the API when the contact section approaches the viewport or on the contact page.
  useEffect(() => {
    if (!clientReady) return
    if (isPage) {
      ensureReady()
      return
    }

    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      ensureReady()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ensureReady()
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [clientReady, ensureReady, isPage])

  // Keep prerendered HTML clean for Google: hide wake/error UI until the client mounts.
  const waking = clientReady && isWaking
  const unavailable = clientReady && isUnavailable
  const fieldsDisabled = unavailable || loading
  const submitDisabled = waking || unavailable || loading

  function handleFormIntent() {
    ensureReady()
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    ensureReady()
    if (unavailable || isWaking) return
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim()
    const companyName = (form.elements.namedItem('company') as HTMLInputElement).value.trim()
    const service = (form.elements.namedItem('service') as HTMLSelectElement).value.trim()
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim()

    try {
      const data = await submitContactEnquiry({
        name,
        email,
        phone,
        company: companyName,
        service,
        message,
      })

      setSuccessMessage(
        data.message ||
          'Thank you! Your enquiry has been received successfully. Our team will contact you shortly.',
      )
      setSubmitted(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Something went wrong. Please try again.')
      } else {
        setError('Unable to send message. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`dark-section w-full overflow-x-clip scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] ${
        isPage ? 'py-10 sm:py-12 lg:py-16' : 'py-8 sm:py-11 lg:py-14'
      }`}
    >
      <div className="site-container w-full min-w-0">
        <div className="flex w-full min-w-0 flex-col gap-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-14">
          <AnimateIn animation="fade-up" className="w-full min-w-0">
            <div className="text-center lg:text-left">
              <p className="section-label mb-1.5 text-brand-300 sm:mb-2">
                {isPage ? 'Get in Touch' : 'Contact Us'}
              </p>
              <h2 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl xl:text-4xl">
                {isPage ? 'Send us a message' : "Let's Build the Future Together"}
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-gray-400 sm:mt-3 sm:text-base lg:mx-0 lg:max-w-none">
                {isPage
                  ? 'Share your project details and we will schedule a free consultation with clear next steps — usually within one business day.'
                  : 'Ready to transform your business? Reach out and we\'ll schedule a free consultation to discuss your project.'}
              </p>
            </div>

            <div className="mt-4 flex w-full flex-col gap-2 sm:mt-5">
              {contactItems.map(({ icon: Icon, text, href }) => {
                const rowClass =
                  'flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 sm:px-3.5'
                const content = (
                  <>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                      <Icon size={15} />
                    </div>
                    <span className="min-w-0 flex-1 text-left text-sm leading-snug text-gray-300">
                      {text}
                    </span>
                  </>
                )

                return href ? (
                  <a
                    key={text}
                    href={href}
                    className={`${rowClass} transition-colors hover:border-brand-500/30 hover:bg-white/10 hover:text-white`}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={text} className={rowClass}>
                    {content}
                  </div>
                )
              })}
            </div>

            {!isPage ? (
              <div className="mt-4 hidden sm:mt-5 sm:block">
                <Button href="#contact" variant="primary" className="w-full sm:w-auto">
                  Request a Consultation
                  <ArrowRight size={16} />
                </Button>
              </div>
            ) : (
              <p className="mt-4 hidden text-sm text-gray-500 sm:mt-5 sm:block">
                Prefer email? Reach us at{' '}
                <a
                  href={`mailto:${company.email}`}
                  className="font-medium text-brand-300 hover:text-brand-200"
                >
                  {company.email}
                </a>
              </p>
            )}
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={100} className="w-full min-w-0">
            <div className="box-border w-full max-w-full rounded-xl border border-white/10 bg-navy-800/60 p-4 sm:rounded-2xl sm:p-5 lg:p-7">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center sm:py-10">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                    <Send size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-white sm:text-xl">Enquiry Received!</h3>
                  <p className="mt-1.5 max-w-sm text-sm text-gray-400">{successMessage}</p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  onFocusCapture={handleFormIntent}
                  className="w-full space-y-3"
                >
                  <div className="grid w-full gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-300">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        required
                        disabled={fieldsDisabled}
                        className={inputClass}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-300">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        disabled={fieldsDisabled}
                        className={inputClass}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid w-full gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-300">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        disabled={fieldsDisabled}
                        className={inputClass}
                        placeholder="+91 ..."
                      />
                    </div>
                    <div className="min-w-0">
                      <label
                        htmlFor="company"
                        className="mb-1 block text-sm font-medium text-gray-300"
                      >
                        Company Name
                      </label>
                      <input
                        id="company"
                        name="company"
                        disabled={fieldsDisabled}
                        className={inputClass}
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="service" className="mb-1 block text-sm font-medium text-gray-300">
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      disabled={fieldsDisabled}
                      defaultValue=""
                      className={`${inputClass} appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-9`}
                    >
                      <option value="" className="bg-navy-900 text-gray-300">
                        Select a service
                      </option>
                      {serviceNavItems.map((service) => (
                        <option
                          key={service.id}
                          value={service.navLabel}
                          className="bg-navy-900 text-white"
                        >
                          {service.navLabel}
                        </option>
                      ))}
                      <option value="Other" className="bg-navy-900 text-white">
                        Other
                      </option>
                    </select>
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-300">
                      Project Requirements
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      required
                      disabled={fieldsDisabled}
                      className={`${inputClass} resize-none`}
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  {/* Reserved status slot prevents CLS when wake/error messages appear */}
                  <div className="min-h-[2.75rem]" aria-live="polite">
                    {waking ? (
                      <p className="flex items-center gap-2 text-sm text-brand-300" role="status">
                        <Loader2 size={16} className="shrink-0 animate-spin" aria-hidden />
                        Starting our secure server... Please wait a few seconds.
                      </p>
                    ) : null}
                    {unavailable ? (
                      <div className="space-y-2" role="alert">
                        <p className="text-sm text-red-400">
                          Our server is currently unavailable. Please try again in a few minutes.
                        </p>
                        <Button type="button" variant="secondary" className="w-full" onClick={retry}>
                          Retry
                        </Button>
                      </div>
                    ) : null}
                    {error && !unavailable ? (
                      <p className="text-sm text-red-400" role="alert">
                        {error}
                      </p>
                    ) : null}
                  </div>
                  {!unavailable ? (
                    <Button type="submit" className="w-full" disabled={submitDisabled}>
                      {loading ? 'Sending...' : 'Send Message'}
                      <Send size={16} />
                    </Button>
                  ) : null}
                </form>
              )}
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
