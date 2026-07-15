import { Link } from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
  Shield,
  Cloud,
  Brain,
  Zap,
} from 'lucide-react'
import {
  company,
  navLinks,
  services,
  trustFeatures,
  socialLinks,
  footerLinks,
} from '../../data/content'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import FooterAccordion from '../ui/FooterAccordion'
import AnimateIn from '../ui/AnimateIn'

const trustIcons = { shield: Shield, cloud: Cloud, brain: Brain, zap: Zap }

function SocialIcon({ label }: { label: string }) {
  const cls = 'h-4 w-4'
  switch (label) {
    case 'LinkedIn':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case 'Twitter':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'GitHub':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      )
    case 'YouTube':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    default:
      return null
  }
}

function LinkList({
  items,
}: {
  items: { label: string; href: string }[]
}) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.href + item.label}>
          <Link
            to={item.href}
            className="inline-block break-words py-0.5 text-sm text-gray-400 transition-colors hover:text-brand-300"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function Footer() {
  return (
    <footer className="max-w-full overflow-x-clip bg-navy-950 text-gray-400">
      {/* CTA strip */}
      <div className="border-b border-white/5 bg-gradient-to-r from-brand-600 to-brand-500">
        <AnimateIn animation="fade-up" className="site-container w-full py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold leading-snug text-white sm:text-xl lg:text-2xl">
                Ready to Transform Your Business?
              </h3>
              <p className="mt-1.5 text-sm text-blue-100">
                Schedule a free consultation with our team today.
              </p>
            </div>
            <Button href="/#contact" variant="white" className="w-full sm:w-auto sm:shrink-0">
              <span className="sm:hidden">Free Consultation</span>
              <span className="hidden sm:inline">Schedule a Free Consultation</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </AnimateIn>
      </div>

      {/* Trust bar */}
      <div className="border-b border-white/5 bg-navy-900/60">
        <div className="site-container grid gap-3 py-5 sm:grid-cols-2 sm:gap-4 sm:py-8 lg:grid-cols-4">
          {trustFeatures.map((f, index) => {
            const Icon = trustIcons[f.icon as keyof typeof trustIcons] ?? Shield
            return (
              <AnimateIn key={f.title} delay={index * 80} animation="fade-up" duration={500}>
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-2.5 sm:bg-transparent sm:gap-3 sm:p-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20 sm:h-11 sm:w-11">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.subtitle}</p>
                </div>
              </div>
              </AnimateIn>
            )
          })}
        </div>
      </div>

      {/* Main footer */}
      <div className="site-container py-10 sm:py-14 lg:py-16">
        <div className="lg:grid lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="mb-6 border-b border-white/10 pb-8 lg:mb-0 lg:border-0 lg:pb-0">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm font-medium text-gray-300">{company.tagline}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
            {company.footerDescription}
          </p>
          <div className="mt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Follow Us</p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-300"
                >
                  <SocialIcon label={social.label} />
                </a>
              ))}
            </div>
          </div>
          </div>

          {/* Link columns — accordions on mobile, grid on desktop */}
          <div className="md:grid md:grid-cols-3 md:gap-8 lg:contents">
          <FooterAccordion title="Quick Links" defaultOpen>
            <LinkList items={navLinks.map((l) => ({ label: l.label, href: l.href }))} />
          </FooterAccordion>

          <FooterAccordion title="Our Services">
            <LinkList
              items={services.map((s) => ({
                label: s.navLabel,
                href: `/services/${s.id}`,
              }))}
            />
          </FooterAccordion>

          <FooterAccordion title="Contact">
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 py-0.5 text-sm transition-colors hover:text-brand-300"
                >
                  <Phone size={16} className="mt-0.5 shrink-0 text-brand-400" />
                  <span className="break-all">{company.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-start gap-3 py-0.5 text-sm transition-colors hover:text-brand-300"
                >
                  <Mail size={16} className="mt-0.5 shrink-0 text-brand-400" />
                  <span className="break-all">{company.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 py-0.5 text-sm transition-colors hover:text-brand-300"
                >
                  <Globe size={16} className="mt-0.5 shrink-0 text-brand-400" />
                  <span className="break-all">{company.website}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-400" />
                <span className="break-words">{company.location}</span>
              </li>
            </ul>
          </FooterAccordion>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 bg-navy-950">
        <div className="site-container flex flex-col items-center gap-3 py-5 sm:flex-row sm:justify-between">
          <p className="text-center text-xs leading-relaxed text-gray-600 sm:text-left">
            &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {footerLinks.legal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-gray-500 transition-colors hover:text-brand-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
