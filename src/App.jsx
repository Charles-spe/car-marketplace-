import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import './home.css'
import './browse.css'
import './detail.css'
import './dealers.css'
import './dealer-load-more.css'
import './sell.css'
import './saved.css'
import './interaction-modal.css'
import './about-contact.css'
import './polish.css'
import { clearSavedCars, getSavedCarIds, removeSavedCar, SAVED_CARS_STORAGE_KEY, toggleSavedCar } from './utils/savedCars.js'

const cars = [
  { id: 'car-001', make: 'Porsche', model: '911 Carrera 4S', year: 2022, price: 138500, mileage: 8420, fuel: 'Petrol', transmission: 'Automatic', body: 'Coupe', location: 'Los Angeles, CA', dealer: 'Maven Motors', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85', tag: 'Editor pick', color: 'Agate Grey' },
  { id: 'car-002', make: 'Mercedes-Benz', model: 'G 550', year: 2021, price: 119900, mileage: 16800, fuel: 'Petrol', transmission: 'Automatic', body: 'SUV', location: 'Austin, TX', dealer: 'Westlake Auto', image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=85', tag: 'Low mileage', color: 'Obsidian Black' },
  { id: 'car-003', make: 'BMW', model: 'M4 Competition', year: 2023, price: 94500, mileage: 3210, fuel: 'Petrol', transmission: 'Automatic', body: 'Coupe', location: 'Miami, FL', dealer: 'Maven Motors', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85', tag: 'Just listed', color: 'Brooklyn Grey' },
  { id: 'car-004', make: 'Land Rover', model: 'Defender 110 X-Dynamic', year: 2022, price: 78900, mileage: 21450, fuel: 'Hybrid', transmission: 'Automatic', body: 'SUV', location: 'Seattle, WA', dealer: 'Pinnacle Automotive', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85', tag: 'Price drop', color: 'Carpathian Grey' },
  { id: 'car-005', make: 'Audi', model: 'RS 6 Avant', year: 2021, price: 108900, mileage: 12600, fuel: 'Petrol', transmission: 'Automatic', body: 'Wagon', location: 'New York, NY', dealer: 'Park Avenue Auto', image: 'https://images.unsplash.com/photo-1603584173870-7f23f5e8a22a?auto=format&fit=crop&w=1200&q=85', tag: 'Rare find', color: 'Nardo Grey' },
  { id: 'car-006', make: 'Volvo', model: 'XC90 Recharge', year: 2023, price: 67400, mileage: 4950, fuel: 'Hybrid', transmission: 'Automatic', body: 'SUV', location: 'Denver, CO', dealer: 'Northstar Cars', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85', tag: 'Certified', color: 'Crystal White' },
  { id: 'car-007', make: 'Tesla', model: 'Model S Plaid', year: 2022, price: 86900, mileage: 9800, fuel: 'Electric', transmission: 'Automatic', body: 'Sedan', location: 'San Diego, CA', dealer: 'Maven Motors', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=85', tag: 'Top rated', color: 'Pearl White' },
  { id: 'car-008', make: 'Lexus', model: 'LC 500', year: 2020, price: 81300, mileage: 18200, fuel: 'Petrol', transmission: 'Automatic', body: 'Coupe', location: 'Chicago, IL', dealer: 'Pinnacle Automotive', image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=85', tag: 'Price drop', color: 'Caviar Black' },
]

const dealers = [
  { id: 'maven-motors', name: 'Maven Motors', location: 'Los Angeles, CA', description: 'A carefully selected collection of performance, luxury, and everyday vehicles for the road ahead.', image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1200&q=85', rating: '4.9', reviews: 128, vehicles: 42, email: 'hello@mavenmotors.co', phone: '(310) 555-0148' },
  { id: 'pinnacle-automotive', name: 'Pinnacle Automotive', location: 'Seattle, WA', description: 'Independent automotive specialists known for transparent service and hard-to-find adventure vehicles.', image: 'https://images.unsplash.com/photo-1562519819-016930ada31b?auto=format&fit=crop&w=1200&q=85', rating: '4.8', reviews: 96, vehicles: 28, email: 'team@pinnacleauto.co', phone: '(206) 555-0182' },
  { id: 'westlake-auto', name: 'Westlake Auto', location: 'Austin, TX', description: 'Modern classics and capable SUVs, sourced with a sharp eye and presented without the pressure.', image: 'https://images.unsplash.com/photo-1562141961-b7f1c3e9e7a2?auto=format&fit=crop&w=1200&q=85', rating: '4.7', reviews: 84, vehicles: 35, email: 'hello@westlakeauto.co', phone: '(512) 555-0116' },
  { id: 'northstar-cars', name: 'Northstar Cars', location: 'Denver, CO', description: 'Thoughtfully inspected vehicles for city commutes, mountain roads, and everything between.', image: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85', rating: '4.9', reviews: 72, vehicles: 19, email: 'drive@northstarcars.co', phone: '(303) 555-0124' },
  { id: 'park-avenue-auto', name: 'Park Avenue Auto', location: 'New York, NY', description: 'A refined Manhattan showroom for distinctive performance cars and thoughtful daily drivers.', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85', rating: '4.8', reviews: 61, vehicles: 24, email: 'hello@parkavenueauto.co', phone: '(212) 555-0164' },
  { id: 'coastline-motors', name: 'Coastline Motors', location: 'Miami, FL', description: 'Bright, well-kept vehicles selected for long weekends, city nights, and the open coast.', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=85', rating: '4.6', reviews: 49, vehicles: 31, email: 'drive@coastlinemotors.co', phone: '(305) 555-0198' },
  { id: 'high-country-auto', name: 'High Country Auto', location: 'Boulder, CO', description: 'Adventure-ready inventory and friendly expertise for drivers who take the scenic route.', image: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=85', rating: '4.7', reviews: 55, vehicles: 22, email: 'team@highcountryauto.co', phone: '(720) 555-0172' },
  { id: 'great-lakes-motors', name: 'Great Lakes Motors', location: 'Chicago, IL', description: 'A neighborhood dealership with a national eye for quality, value, and interesting cars.', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=85', rating: '4.5', reviews: 38, vehicles: 18, email: 'hello@greatlakesmotors.co', phone: '(773) 555-0136' },
]

const formatPrice = (price) => `$${price.toLocaleString()}`
const formatMileage = (mileage) => `${mileage.toLocaleString()} mi`
const getAvailableSavedCarIds = () => getSavedCarIds().filter((id) => cars.some((car) => car.id === id))
const isDetailPath = () => /^\/cars\/[^/]+$/.test(window.location.pathname)
const getPathCar = () => { const match = window.location.pathname.match(/^\/cars\/([^/]+)$/); return match ? cars.find((car) => car.id === match[1]) || null : null }
const isDealerPath = () => /^\/dealers\/[^/]+$/.test(window.location.pathname)
const getPathDealer = () => { const match = window.location.pathname.match(/^\/dealers\/([^/]+)$/); return match ? dealers.find((dealer) => dealer.id === match[1]) || null : null }
const getPathView = () => {
  const pathname = window.location.pathname
  if (isDetailPath()) return 'details'
  if (isDealerPath()) return 'dealer-profile'
  if (['/cars', '/browse'].includes(pathname)) return window.location.search ? 'search' : 'cars'
  if (pathname === '/dealers') return 'dealers'
  if (['/sell', '/saved', '/about', '/contact', '/login', '/signup', '/dashboard'].includes(pathname)) return pathname.slice(1)
  return pathname === '/' ? 'home' : 'not-found'
}
const handleMarketplaceImageError = (event) => {
  const image = event.currentTarget
  if (image.dataset.fallbackAttempted) {
    image.style.visibility = 'hidden'
    return
  }
  image.dataset.fallbackAttempted = 'true'
  image.src = cars[0].image
}

function Icon({ name, size = 18 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    heart: <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function CarCard({ car, saved, onSave, onOpen }) {
  return <article className="car-card"><button className={`save-button ${saved ? 'saved' : ''}`} onClick={() => onSave(car.id)} aria-label={saved ? `Remove ${car.make} ${car.model} from saved cars` : `Save ${car.make} ${car.model}`}><Icon name="heart" /></button><button className="car-image-button" onClick={() => onOpen(car.id)} aria-label={`View ${car.make} ${car.model}`}><img src={car.image} alt={`${car.year} ${car.make} ${car.model}`} loading="lazy" decoding="async" onError={handleMarketplaceImageError} /><span className="car-tag">{car.tag}</span></button><div className="car-card-body"><div className="card-heading"><div><p className="eyebrow">{car.year} · {car.body}</p><h3>{car.make} {car.model}</h3><p className="trim-label">{car.color} exterior</p></div><strong>{formatPrice(car.price)}</strong></div><p className="card-meta">{formatMileage(car.mileage)} <span>·</span> {car.transmission} <span>·</span> {car.fuel}</p><p className="location"><Icon name="pin" size={14} /> {car.location}</p><button className="card-details-link" onClick={() => onOpen(car.id)}>View details <Icon name="arrow" size={14} /></button></div></article>
}

function DealerInteractionModal({ type, car, dealer, onClose }) {
  const [submitted, setSubmitted] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [request, setRequest] = useState(null)
  const modalRef = useRef(null)
  const isTestDrive = type === 'test-drive'
  const vehicleName = `${car.year} ${car.make} ${car.model}`

  useEffect(() => {
    const previousFocus = document.activeElement
    const modal = modalRef.current
    modal?.querySelector('input, textarea, button')?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !modal) return
      const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => { document.removeEventListener('keydown', handleKeyDown); previousFocus?.focus?.() }
  }, [onClose])

  const submitRequest = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setShowValidation(true)
    if (!form.reportValidity()) return
    const values = Object.fromEntries(new FormData(form).entries())
    setRequest(values)
    setSubmitted(true)
  }

  return <div className="interaction-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="interaction-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="interaction-title"><button className="interaction-close" onClick={onClose} aria-label="Close dialog">×</button>{submitted ? <div className="interaction-success"><span className="interaction-success-mark"><Icon name="check" size={25} /></span><p className="kicker">Request received</p><h2 id="interaction-title">{isTestDrive ? 'Test drive requested' : 'Message sent'}</h2><p>{isTestDrive ? `${vehicleName} is noted for ${request.date} at ${request.time}. This demo request was not sent to a dealer.` : `The dealer will contact you shortly about the ${vehicleName}. This demo message was not sent.`}</p><button className="button button-dark wide" onClick={onClose}>Close</button></div> : <><p className="kicker">{isTestDrive ? 'Take the wheel' : 'Connect with the dealer'}</p><h2 id="interaction-title">{isTestDrive ? 'Schedule a test drive' : 'Contact dealer'}</h2><div className="interaction-vehicle"><strong>{vehicleName}</strong><span>{dealer?.name || car.dealer} · {car.location}</span></div>{showValidation && <p className="interaction-validation" role="alert">Please complete all required fields with a valid email address.</p>}<form onSubmit={submitRequest} noValidate><div className="interaction-fields">{isTestDrive && <><label>Preferred date<input name="date" type="date" required min={new Date().toISOString().slice(0, 10)} /></label><label>Preferred time<select name="time" required defaultValue=""><option value="" disabled>Select a time</option><option>Morning · 9am–12pm</option><option>Afternoon · 12pm–4pm</option><option>Evening · 4pm–6pm</option></select></label></>}<label>Your name<input name="name" autoComplete="name" required placeholder="Full name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" required minLength="7" placeholder="(555) 123-4567" /></label>{!isTestDrive && <label className="interaction-message">Message<textarea name="message" required rows="4" defaultValue={`Hi, I'm interested in the ${vehicleName}. Please contact me with more information.`} /></label>}</div><p className="interaction-demo-note">Portfolio demo only. Your information will not be sent or stored.</p><button className="button button-dark wide" type="submit">{isTestDrive ? 'Request test drive' : 'Send message'} <Icon name="arrow" /></button></form></>}</section></div>
}

function ContactPage({ navigate }) {
  const [submitted, setSubmitted] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')

  const submitContact = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) {
      setValidationMessage('Please complete the required fields with a valid email address.')
      return
    }
    setValidationMessage('')
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return <main className="contact-page">
    <section className="contact-hero"><div className="page-wrap"><p className="kicker light">Here for the journey</p><h1>Let’s talk<br /><em>cars.</em></h1><p>Questions about a listing, a dealer, or your next move? We’re easy to reach.</p></div></section>
    <section className="contact-content page-wrap">
      <div className="contact-form-wrap"><p className="kicker">Send us a note</p><h2>Good conversations<br /><em>start here.</em></h2>{submitted ? <div className="contact-success" role="status"><span className="sell-success-mark"><Icon name="check" /></span><h3>Message received</h3><p>Thanks for getting in touch. Our team will follow up shortly. This is a demo confirmation; nothing was sent to a server.</p><button className="button button-outline" onClick={() => setSubmitted(false)}>Send another message</button></div> : <form className="contact-form" onSubmit={submitContact} noValidate>{validationMessage && <p className="sell-validation" role="alert">{validationMessage}</p>}<label>Your name <span className="required-mark">*</span><input name="name" autoComplete="name" required placeholder="Full name" /></label><label>Email address <span className="required-mark">*</span><input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Subject <span className="required-mark">*</span><select name="subject" required defaultValue=""><option value="" disabled>Choose a topic</option><option>Question about a vehicle</option><option>Dealer support</option><option>Selling my car</option><option>Something else</option></select></label><label>Message <span className="required-mark">*</span><textarea name="message" required minLength="10" rows="5" placeholder="How can we help?" /></label><p className="contact-demo-note">Portfolio demo only. Your message will not be sent or stored.</p><button className="button button-dark" type="submit">Send message <Icon name="arrow" /></button></form>}</div>
      <aside className="contact-aside"><div className="contact-info-card"><p className="kicker">Get in touch</p><h3>Real people,<br /><em>good answers.</em></h3><a href="mailto:hello@mavenmotors.co">hello@mavenmotors.co</a><a href="tel:+13105550148">(310) 555-0148</a><div className="contact-hours"><strong>Business hours</strong><span>Monday–Friday · 8am–6pm PT</span><span>Saturday · 9am–3pm PT</span></div></div><div className="contact-location-card"><span className="location-art" aria-hidden="true"><Icon name="pin" size={24} /></span><div><p className="kicker">Maven Motors</p><strong>Los Angeles, California</strong><p>Serving drivers and independent dealers nationwide.</p></div></div><div className="contact-shortcuts"><button className="text-button" onClick={() => navigate('home')}>Home <Icon name="arrow" /></button><button className="text-button" onClick={() => navigate('cars')}>Browse cars <Icon name="arrow" /></button><button className="text-button" onClick={() => navigate('dealers')}>Meet our dealers <Icon name="arrow" /></button></div></aside>
    </section>
  </main>
}

const defaultFilters = { make: 'All makes', model: '', minPrice: '', maxPrice: '', minYear: '', maxYear: '', mileage: 'Any mileage', body: 'Any body type', fuel: 'Any fuel', transmission: 'Any transmission', condition: 'Any condition', location: '' }
const filterOptions = { body: ['SUV', 'Coupe', 'Sedan', 'Wagon', 'Hatchback', 'Truck', 'Convertible'], fuel: ['Petrol', 'Hybrid', 'Electric'], transmission: ['Automatic', 'Manual'], condition: ['New', 'Used', 'Certified'] }
const readUrlState = () => { const params = new URLSearchParams(window.location.search); return { query: params.get('q') || '', sort: params.get('sort') || 'Recommended', filters: Object.keys(defaultFilters).reduce((result, key) => ({ ...result, [key]: params.get(key) || defaultFilters[key] }), {}) } }

function FilterPanel({ filters, setFilters, onClear }) {
  const update = (key, value) => setFilters({ ...filters, [key]: value })
  const select = (key, label, options, empty) => <label className="filter-field">{label}<select value={filters[key]} onChange={(event) => update(key, event.target.value)}><option>{empty}</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
  return <div className="filter-panel"><div className="filter-panel-heading"><strong>Filter inventory</strong><button className="filter-reset" onClick={onClear}>Clear all</button></div>{select('make', 'Make', [...new Set(cars.map((car) => car.make))], 'All makes')}<label className="filter-field">Model<input value={filters.model} onChange={(event) => update('model', event.target.value)} placeholder="e.g. 911, M4" /></label><div className="filter-two-up"><label className="filter-field">Min price<input type="number" value={filters.minPrice} onChange={(event) => update('minPrice', event.target.value)} placeholder="$0" /></label><label className="filter-field">Max price<input type="number" value={filters.maxPrice} onChange={(event) => update('maxPrice', event.target.value)} placeholder="$250k" /></label></div><div className="filter-two-up"><label className="filter-field">Min year<input type="number" value={filters.minYear} onChange={(event) => update('minYear', event.target.value)} placeholder="2018" /></label><label className="filter-field">Max year<input type="number" value={filters.maxYear} onChange={(event) => update('maxYear', event.target.value)} placeholder="2024" /></label></div>{select('mileage', 'Mileage', ['Under 5,000 mi', 'Under 10,000 mi', 'Under 25,000 mi'], 'Any mileage')}{select('body', 'Body type', filterOptions.body, 'Any body type')}{select('fuel', 'Fuel type', filterOptions.fuel, 'Any fuel')}{select('transmission', 'Transmission', filterOptions.transmission, 'Any transmission')}{select('condition', 'Condition', filterOptions.condition, 'Any condition')}<label className="filter-field">Location<input value={filters.location} onChange={(event) => update('location', event.target.value)} placeholder="City or state" /></label></div>
}

const sellDraftStorageKey = 'maven-sell-listing-draft'

function readSellDraft() {
  try {
    const stored = window.localStorage.getItem(sellDraftStorageKey)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (parsed?.version !== 1 || !parsed.values || typeof parsed.values !== 'object' || Array.isArray(parsed.values)) return null
    return parsed
  } catch {
    try { window.localStorage.removeItem(sellDraftStorageKey) } catch { /* Storage may be unavailable. */ }
    return null
  }
}

function SellPage({ navigate }) {
  const [photos, setPhotos] = useState([])
  const [showErrors, setShowErrors] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [draftState, setDraftState] = useState(() => { const draft = readSellDraft(); return { draft, showResume: Boolean(draft) } })
  const [draftMessage, setDraftMessage] = useState('')
  const [confirmStartNew, setConfirmStartNew] = useState(false)
  const formRef = useRef(null)
  const createdUrls = useRef([])

  useEffect(() => () => createdUrls.current.forEach((url) => URL.revokeObjectURL(url)), [])

  const addPhotos = (event) => {
    const available = Math.max(0, 6 - photos.length)
    const selected = [...event.target.files].slice(0, available).map((file) => {
      const url = URL.createObjectURL(file)
      createdUrls.current.push(url)
      return { file, url }
    })
    setPhotos((current) => [...current, ...selected])
    event.target.value = ''
  }

  const removePhoto = (url) => {
    URL.revokeObjectURL(url)
    createdUrls.current = createdUrls.current.filter((createdUrl) => createdUrl !== url)
    setPhotos((current) => current.filter((photo) => photo.url !== url))
  }

  const saveDraft = () => {
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    const values = {}
    for (const [name, value] of formData.entries()) {
      if (typeof value !== 'string') continue
      if (name === 'features') values.features = [...(values.features || []), value]
      else values[name] = value
    }
    const draft = { version: 1, savedAt: new Date().toISOString(), values }
    try {
      window.localStorage.setItem(sellDraftStorageKey, JSON.stringify(draft))
      setDraftState({ draft, showResume: false })
      setDraftMessage('Your listing draft is saved on this device. Photos are not included and this listing has not been published.')
    } catch {
      setDraftMessage('This browser could not save the draft locally. Your current form is still here, but refresh will clear it.')
    }
  }

  const resumeDraft = () => {
    const form = formRef.current
    if (!form || !draftState.draft) return
    Object.entries(draftState.draft.values).forEach(([name, value]) => {
      if (name === 'features') {
        form.querySelectorAll('input[name="features"]').forEach((checkbox) => { checkbox.checked = Array.isArray(value) && value.includes(checkbox.value) })
        return
      }
      const field = form.elements.namedItem(name)
      if (field && 'value' in field && typeof value === 'string') field.value = value
    })
    setPhotos([])
    setShowErrors(false)
    setDraftMessage('Saved listing details restored. Add your vehicle photos again to preview them.')
    setDraftState((current) => ({ ...current, showResume: false }))
  }

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(sellDraftStorageKey)
      setDraftMessage('Saved draft cleared from this device.')
    } catch {
      setDraftMessage('This browser could not access local storage. The form has been reset for this session.')
    }
    formRef.current?.reset()
    setPhotos([])
    setShowErrors(false)
    setConfirmStartNew(false)
    setDraftState({ draft: null, showResume: false })
  }

  const submitListing = (event) => {
    event.preventDefault()
    setShowErrors(true)
    if (!event.currentTarget.reportValidity()) return
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) return <main className="sell-success-page page-wrap"><div className="sell-success-mark"><Icon name="check" size={28} /></div><p className="kicker">Demo listing complete</p><h1>Your next chapter<br /><em>starts here.</em></h1><p className="lede">Your information has been reviewed in this demo. No listing was published and no data was sent to a server.</p><div className="sell-success-actions"><button className="button button-dark" onClick={() => navigate('cars')}>Browse cars <Icon name="arrow" /></button><button className="button button-outline" onClick={() => { setSubmitted(false); setShowErrors(false) }}>Create another demo listing</button></div></main>

  const requiredLabel = (label) => <>{label} <span className="required-mark" aria-hidden="true">*</span></>
  return <main className="sell-page">
    <section className="sell-hero"><div className="sell-hero-content page-wrap"><p className="kicker light">A better way to sell</p><h1>Your car’s next<br /><em>chapter starts here.</em></h1><p>Reach thoughtful buyers with a listing that tells the whole story. It’s simple, clear, and always on your terms.</p><a className="button button-accent" href="#listing-form">Start your listing <Icon name="arrow" /></a><span className="sell-demo-note">Portfolio demo · Nothing is published</span></div></section>
    <section className="sell-form-section page-wrap" id="listing-form"><div className="sell-form-intro"><p className="kicker">Start with the details</p><h2>A few good details<br /><em>make all the difference.</em></h2><p>This demo form stays in your browser. Required fields are marked <span className="required-mark">*</span>.</p></div><div className="listing-form-column">{draftState.showResume && <div className="draft-resume-panel"><div><p className="kicker">Draft found</p><strong>Your saved listing is ready to continue.</strong><p>Saved on this device. Photos are not included in the draft.</p></div>{confirmStartNew ? <div className="draft-confirm-actions"><span>Clear this saved draft and start over?</span><button type="button" onClick={clearDraft}>Yes, start new</button><button type="button" onClick={() => setConfirmStartNew(false)}>Cancel</button></div> : <div className="draft-actions"><button className="button button-dark" type="button" onClick={resumeDraft}>Resume saved listing</button><button className="text-button" type="button" onClick={() => setConfirmStartNew(true)}>Start new listing</button></div>}</div>}{draftMessage && <p className="draft-message" role="status">{draftMessage}</p>}<form ref={formRef} className="listing-form" onSubmit={submitListing} noValidate>
      {showErrors && <div className="sell-validation" role="alert">Please complete the required fields and check that your email address is valid.</div>}
      <fieldset className="form-section"><legend><span>01</span> Vehicle information</legend><div className="listing-fields"><label>{requiredLabel('Make')}<input name="make" required placeholder="e.g. Porsche" /></label><label>{requiredLabel('Model')}<input name="model" required placeholder="e.g. 911 Carrera" /></label><label>{requiredLabel('Year')}<input name="year" required type="number" min="1950" max="2027" placeholder="2022" /></label><label>{requiredLabel('Mileage')}<input name="mileage" required type="number" min="0" placeholder="12,500" /></label><label>{requiredLabel('Asking price')}<input name="price" required type="number" min="1" placeholder="$48,500" /></label><label>{requiredLabel('Condition')}<select name="condition" required defaultValue=""><option value="" disabled>Select condition</option><option>Excellent</option><option>Very good</option><option>Good</option><option>Fair</option></select></label><label>{requiredLabel('Body type')}<select name="body" required defaultValue=""><option value="" disabled>Select body type</option>{filterOptions.body.map((body) => <option key={body}>{body}</option>)}</select></label><label>{requiredLabel('Fuel type')}<select name="fuel" required defaultValue=""><option value="" disabled>Select fuel type</option>{filterOptions.fuel.map((fuel) => <option key={fuel}>{fuel}</option>)}</select></label><label>{requiredLabel('Transmission')}<select name="transmission" required defaultValue=""><option value="" disabled>Select transmission</option><option>Automatic</option><option>Manual</option></select></label><label>{requiredLabel('Vehicle location')}<input name="vehicleLocation" required placeholder="City, State" /></label></div></fieldset>
      <fieldset className="form-section"><legend><span>02</span> Vehicle details</legend><label className="full-field">{requiredLabel('Description')}<textarea name="description" required minLength="20" rows="5" placeholder="Share what makes your vehicle special, its history, and anything a buyer should know." /></label><fieldset className="feature-fieldset"><legend>Features and equipment</legend><div className="feature-options">{['Apple CarPlay', 'Leather seats', 'Backup camera', 'Adaptive cruise control', 'Parking sensors', 'Sunroof'].map((feature) => <label key={feature}><input type="checkbox" name="features" value={feature} /> {feature}</label>)}</div></fieldset></fieldset>
      <fieldset className="form-section"><legend><span>03</span> Photos</legend><p className="form-help">Add up to 6 clear photos. A few different angles help buyers picture themselves in the driver’s seat.</p><label className="photo-upload"><input type="file" accept="image/*" multiple onChange={addPhotos} disabled={photos.length >= 6} /><span className="upload-symbol">+</span><strong>{photos.length >= 6 ? 'Photo limit reached' : 'Choose vehicle photos'}</strong><small>JPG, PNG or WEBP · Up to 6 images</small></label>{photos.length > 0 && <div className="photo-preview-grid">{photos.map((photo, index) => <figure key={photo.url}><img src={photo.url} alt={`Vehicle preview ${index + 1}`} /><button type="button" onClick={() => removePhoto(photo.url)} aria-label={`Remove photo ${index + 1}`}>×</button></figure>)}</div>}</fieldset>
      <fieldset className="form-section"><legend><span>04</span> Seller information</legend><div className="listing-fields"><label>{requiredLabel('Your name')}<input name="sellerName" required autoComplete="name" placeholder="Full name" /></label><label>{requiredLabel('Email address')}<input name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label><label>{requiredLabel('Phone number')}<input name="phone" required type="tel" autoComplete="tel" minLength="7" placeholder="(555) 123-4567" /></label><label>{requiredLabel('Your location')}<input name="sellerLocation" required autoComplete="address-level2" placeholder="City, State" /></label></div></fieldset>
      <div className="listing-submit"><p>This is a portfolio demonstration. Submitting does not publish a vehicle or send your information anywhere.</p><div className="listing-submit-actions">{draftState.draft && <button className="text-button clear-draft-button" type="button" onClick={clearDraft}>Clear saved draft</button>}<button className="button button-outline" type="button" onClick={saveDraft}>Save &amp; resume later</button><button className="button button-dark" type="submit">Review demo listing <Icon name="arrow" /></button></div></div>
    </form></div></section>
    <section className="selling-steps"><div className="page-wrap"><p className="kicker">Simple by design</p><h2>How selling works</h2><div className="selling-steps-grid"><div><span>01</span><h3>Create your listing</h3><p>Start with the basics and set your asking price.</p></div><div><span>02</span><h3>Add details and photos</h3><p>Give buyers a clear, honest picture of your car.</p></div><div><span>03</span><h3>Connect with buyers</h3><p>Hear from interested people on your schedule.</p></div><div><span>04</span><h3>Complete the sale</h3><p>Agree on the next steps and hand over the keys.</p></div></div></div></section>
  </main>
}

function App() {
  const initialUrlState = readUrlState()
  const [view, setView] = useState(getPathView)
  const [selectedCar, setSelectedCar] = useState(getPathCar)
  const [selectedDealer, setSelectedDealer] = useState(getPathDealer)
  const [saved, setSaved] = useState(getAvailableSavedCarIds)
  const [savedDealers, setSavedDealers] = useState([])
  const [dealerVisibleCount, setDealerVisibleCount] = useState(6)
  const [query, setQuery] = useState(initialUrlState.query)
  const [filters, setFilters] = useState(initialUrlState.filters)
  const [sort, setSort] = useState(initialUrlState.sort)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [notice, setNotice] = useState('')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [dealerInteraction, setDealerInteraction] = useState(null)
  const [heroMake, setHeroMake] = useState('All makes')
  const [heroModel, setHeroModel] = useState('')
  const [heroPrice, setHeroPrice] = useState('')
  const [heroLocation, setHeroLocation] = useState('')

  useEffect(() => {
    const handlePopState = () => { const nextCar = getPathCar(); const nextDealer = getPathDealer(); const next = new URLSearchParams(window.location.search); setSelectedCar(nextCar); setSelectedDealer(nextDealer); setView(getPathView()); setQuery(next.get('q') || ''); setSort(next.get('sort') || 'Recommended'); setFilters(Object.keys(defaultFilters).reduce((result, key) => ({ ...result, [key]: next.get(key) || defaultFilters[key] }), {})) }
    window.addEventListener('popstate', handlePopState)
    const handleStorageChange = (event) => {
      if (event.key !== SAVED_CARS_STORAGE_KEY) return
      const nextSavedIds = getAvailableSavedCarIds()
      setSaved((currentIds) => currentIds.length === nextSavedIds.length && currentIds.every((id, index) => id === nextSavedIds[index]) ? currentIds : nextSavedIds)
    }
    window.addEventListener('storage', handleStorageChange)
    return () => { window.removeEventListener('popstate', handlePopState); window.removeEventListener('storage', handleStorageChange) }
  }, [])
  useEffect(() => {
    if (!['cars', 'search'].includes(view)) return
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    Object.entries(filters).forEach(([key, value]) => { if (value && value !== defaultFilters[key]) params.set(key, value) })
    if (sort !== 'Recommended') params.set('sort', sort)
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
  }, [filters, query, sort, view])
  const filteredCars = useMemo(() => { let result = cars.filter((car) => { const haystack = `${car.make} ${car.model} ${car.location}`.toLowerCase(); const mileageLimit = filters.mileage === 'Under 5,000 mi' ? 5000 : filters.mileage === 'Under 10,000 mi' ? 10000 : filters.mileage === 'Under 25,000 mi' ? 25000 : Infinity; return (filters.make === 'All makes' || car.make === filters.make) && (!filters.model || car.model.toLowerCase().includes(filters.model.toLowerCase())) && (!filters.minPrice || car.price >= Number(filters.minPrice)) && (!filters.maxPrice || car.price <= Number(filters.maxPrice)) && (!filters.minYear || car.year >= Number(filters.minYear)) && (!filters.maxYear || car.year <= Number(filters.maxYear)) && car.mileage <= mileageLimit && (filters.body === 'Any body type' || car.body === filters.body) && (filters.fuel === 'Any fuel' || car.fuel === filters.fuel) && (filters.transmission === 'Any transmission' || car.transmission === filters.transmission) && (filters.condition === 'Any condition' || (filters.condition === 'Certified' ? car.tag === 'Certified' : filters.condition === 'New' ? car.year >= 2023 : car.year < 2023)) && (!filters.location || car.location.toLowerCase().includes(filters.location.toLowerCase())) && haystack.includes(query.toLowerCase()) })
    if (sort === 'Price: Low to High') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'Price: High to Low') result = [...result].sort((a, b) => b.price - a.price)
    if (sort === 'Newest') result = [...result].sort((a, b) => b.year - a.year)
    if (sort === 'Lowest Mileage') result = [...result].sort((a, b) => a.mileage - b.mileage)
    return result
  }, [filters, query, sort])
  const toggleSaved = (id) => setSaved(toggleSavedCar(id).filter((savedId) => cars.some((car) => car.id === savedId)))
  const removeSaved = (id) => setSaved(removeSavedCar(id).filter((savedId) => cars.some((car) => car.id === savedId)))
  const clearSaved = () => { clearSavedCars(); setSaved([]) }
  const openCar = (id) => { const car = cars.find((item) => item.id === id) || null; setSelectedCar(car); setGalleryIndex(0); setView('details'); window.history.pushState({}, '', `/cars/${id}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const navigate = (nextView) => { setView(nextView); setMobileMenu(false); const nextPath = ['cars', 'search'].includes(nextView) ? '/cars' : nextView === 'dealers' ? '/dealers' : ['/sell', '/saved', '/about', '/contact', '/login', '/signup', '/dashboard'].includes(`/${nextView}`) ? `/${nextView}` : '/'; if (window.location.pathname !== nextPath) window.history.pushState({}, '', `${nextPath}${window.location.search}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openDealer = (id) => { const dealer = dealers.find((item) => item.id === id) || null; setSelectedDealer(dealer); setView('dealer-profile'); window.history.pushState({}, '', `/dealers/${id}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleDealerSaved = (id) => setSavedDealers((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const showNotice = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 3500) }
  const openDealerInteraction = (type) => setDealerInteraction(type)
  const navItems = [['Cars', 'cars'], ['Sell your car', 'sell'], ['Dealers', 'dealers'], ['About', 'about'], ['Contact', 'contact']]

  const renderBrowse = (title = 'Find a car you’ll love', subtitle = 'Hand-picked vehicles. Transparent pricing. A better way to buy.') => {
    const activeFilters = Object.entries(filters).filter(([key, value]) => value && value !== defaultFilters[key]).map(([key, value]) => ({ key, label: key === 'maxPrice' ? `Under ${formatPrice(Number(value))}` : key === 'minPrice' ? `From ${formatPrice(Number(value))}` : key === 'model' ? `Model: ${value}` : key === 'location' ? `Near ${value}` : value }))
    const removeFilter = (key) => setFilters({ ...filters, [key]: defaultFilters[key] })
    const clearFilters = () => { setQuery(''); setFilters(defaultFilters); setSort('Recommended') }
    return <main className="browse-page browse-layout page-wrap"><section className="browse-intro"><div><p className="kicker">The curated car marketplace</p><h1>{title}</h1><p className="lede">{subtitle}</p></div><div className="inventory-stat"><strong>{filteredCars.length}</strong><span>vehicles match<br />your search</span></div></section><div className="search-strip browse-search"><div className="search-input"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by make, model or vehicle name" /><kbd>⌘ K</kbd></div><button className="button button-dark" onClick={() => navigate('search')}>Search inventory <Icon name="arrow" /></button></div><div className="mobile-filter-row"><button className="button button-outline" onClick={() => setFiltersOpen(true)}><Icon name="search" size={15} /> Filters {activeFilters.length ? `(${activeFilters.length})` : ''}</button><span>{filteredCars.length} matches</span></div><div className="browse-content"><aside className="desktop-filters"><FilterPanel filters={filters} setFilters={setFilters} onClear={clearFilters} /></aside><section className="results-column"><div className="results-top"><div><p><strong>{filteredCars.length}</strong> vehicles matching your search</p><div className="active-filters">{query && <button className="filter-chip" onClick={() => setQuery('')}>Search: {query} ×</button>}{activeFilters.map(({ key, label }) => <button className="filter-chip" key={key} onClick={() => removeFilter(key)}>{label} ×</button>)}{activeFilters.length > 0 && <button className="clear-inline" onClick={clearFilters}>Clear all</button>}</div></div><label className="sort-control">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Recommended</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Newest</option><option>Lowest Mileage</option></select></label></div>{filteredCars.length ? <><div className="car-grid">{filteredCars.map((car) => <CarCard key={car.id} car={car} saved={saved.includes(car.id)} onSave={toggleSaved} onOpen={openCar} />)}</div>{filteredCars.length >= 6 && <button className="load-more" onClick={() => showNotice('All available demo vehicles are already shown.')}>Load more vehicles <Icon name="arrow" /></button>}</> : <div className="empty-state"><span className="empty-icon"><Icon name="search" size={24} /></span><h2>No matching vehicles</h2><p>We couldn’t find a car that fits those filters. Try removing a filter or widening your search.</p><button className="button button-outline" onClick={clearFilters}>Clear filters <Icon name="arrow" /></button></div>}</section></div>{filtersOpen && <div className="filter-drawer-backdrop" onClick={() => setFiltersOpen(false)}><aside className="filter-drawer" onClick={(event) => event.stopPropagation()}><div className="filter-drawer-top"><strong>Filter inventory</strong><button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><Icon name="close" /></button></div><FilterPanel filters={filters} setFilters={setFilters} onClear={clearFilters} /><button className="button button-dark wide" onClick={() => setFiltersOpen(false)}>Show {filteredCars.length} vehicles</button></aside></div>}</main>
  }

  const renderHome = () => {
    const searchCars = () => {
      setFilters({ ...defaultFilters, make: heroMake, maxPrice: heroPrice, location: heroLocation })
      setQuery(`${heroModel} ${heroLocation}`.trim())
      navigate('search')
    }
    const filterBy = (key, value) => {
      setQuery('')
      setFilters({ ...defaultFilters, make: key === 'make' ? value : 'All makes', body: key === 'body' ? value : 'Any body type' })
      navigate('search')
    }
    const makes = ['Porsche', 'BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Lexus']
    const bodyTypes = [['SUV', 'Versatile and ready'], ['Sedan', 'Comfort, refined'], ['Coupe', 'Made to be driven'], ['Hatchback', 'Small, mighty'], ['Truck', 'Built for more'], ['Convertible', 'Open road energy']]
    const dealers = [{ name: 'Maven Motors', location: 'Los Angeles, CA', count: 42 }, { name: 'Pinnacle Automotive', location: 'Seattle, WA', count: 28 }, { name: 'Westlake Auto', location: 'Austin, TX', count: 35 }]
    return <main className="home-page">
      <section className="hero-section homepage-hero"><div className="hero-content page-wrap"><p className="kicker light">A better way to buy and sell</p><h1>Find the car<br /><em>that fits.</em></h1><p className="hero-copy">Beautiful cars, honest pricing, and a buying experience designed around your next chapter.</p><div className="hero-search"><div><label>Make</label><select value={heroMake} onChange={(event) => setHeroMake(event.target.value)}><option>All makes</option>{makes.map((make) => <option key={make}>{make}</option>)}</select></div><div><label>Model</label><input value={heroModel} onChange={(event) => setHeroModel(event.target.value)} placeholder="Any model" /></div><div><label>Price</label><select value={heroPrice} onChange={(event) => setHeroPrice(event.target.value)}><option value="">Any price</option><option value="75000">Under $75k</option><option value="100000">Under $100k</option><option value="150000">Under $150k</option></select></div><div><label>Location</label><input value={heroLocation} onChange={(event) => setHeroLocation(event.target.value)} placeholder="City or state" /></div><button className="button button-accent" onClick={searchCars}>Search cars <Icon name="search" size={16} /></button></div></div><div className="hero-caption"><span>01</span><span className="caption-line" /><span>Exceptional cars<br />for every chapter</span></div></section>
      <section className="trust-bar page-wrap"><p>Trusted by drivers in 50 states</p><div><span>✓ Verified listings</span><span>✓ No hidden fees</span><span>✓ 7-day returns</span></div></section>
      <section className="featured-section page-wrap home-section"><div className="section-heading"><div><p className="kicker">The shortlist</p><h2>Worth a closer look</h2><p className="section-copy">A considered collection of exceptional vehicles, ready for their next owner.</p></div><button className="text-button" onClick={() => navigate('cars')}>View all cars <Icon name="arrow" /></button></div><div className="car-grid">{cars.slice(0, 3).map((car) => <CarCard key={car.id} car={car} saved={saved.includes(car.id)} onSave={toggleSaved} onOpen={openCar} />)}</div></section>
      <section className="body-section page-wrap home-section"><div className="section-heading"><div><p className="kicker">Find your shape</p><h2>Browse by body type</h2></div><button className="text-button" onClick={() => navigate('cars')}>Explore inventory <Icon name="arrow" /></button></div><div className="body-grid">{bodyTypes.map(([body, descriptor]) => <button className="body-tile" key={body} onClick={() => filterBy('body', body)}><span className={`body-illustration body-${body.toLowerCase()}`} /><strong>{body}</strong><small>{descriptor}</small><Icon name="arrow" size={16} /></button>)}</div></section>
      <section className="makes-section home-section"><div className="page-wrap"><div className="section-heading"><div><p className="kicker">A marque for every story</p><h2>Popular makes</h2></div></div><div className="make-list">{makes.map((make, index) => <button key={make} onClick={() => filterBy('make', make)}><span>0{index + 1}</span><strong>{make}</strong><Icon name="arrow" size={16} /></button>)}</div></div></section>
      <section className="why-section page-wrap home-section"><div className="why-intro"><p className="kicker">The Maven standard</p><h2>Buying a car should feel <em>good.</em></h2><p className="section-copy">We make the details clear, the search enjoyable, and every next step feel like the right one.</p></div><div className="benefit-grid"><div><span>01</span><h3>Verified vehicles</h3><p>Every listing is checked for history, condition, and ownership.</p></div><div><span>02</span><h3>Trusted sellers</h3><p>Meet dealers and sellers who value the long-term relationship.</p></div><div><span>03</span><h3>Simple search</h3><p>Useful filters and honest information help you move with clarity.</p></div><div><span>04</span><h3>Transparent details</h3><p>See the full picture before you schedule a conversation.</p></div></div></section>
      <section className="dealer-section home-section"><div className="page-wrap"><div className="section-heading"><div><p className="kicker">People worth knowing</p><h2>Featured dealers</h2></div><button className="text-button" onClick={() => navigate('dealers')}>Meet all dealers <Icon name="arrow" /></button></div><div className="dealer-grid">{dealers.map((dealer, index) => <button className="dealer-card" key={dealer.name} onClick={() => navigate('dealers')}><span className="dealer-number">0{index + 1}</span><span className="verified">✓ Verified</span><h3>{dealer.name}</h3><p>{dealer.location}</p><strong>{dealer.count} vehicles</strong><Icon name="arrow" /></button>)}</div></div></section>
      <section className="process-section page-wrap home-section"><div className="process-heading"><p className="kicker">A better way forward</p><h2>From search to <em>road trip.</em></h2></div><div className="process-grid"><div><span>01</span><h3>Search</h3><p>Find a car that matches your life and your taste.</p></div><div><span>02</span><h3>Compare</h3><p>Save your favorites and make the details easy to see.</p></div><div><span>03</span><h3>Connect</h3><p>Contact a dealer or schedule a test drive when ready.</p></div><div><span>04</span><h3>Buy</h3><p>Take the next step with confidence and clarity.</p></div></div></section>
      <section className="testimonial-section home-section"><div className="page-wrap"><p className="kicker">Notes from the road</p><div className="testimonial-grid"><blockquote>“The search felt considered instead of overwhelming. I found a car I love in one weekend.”<footer>Demo customer · Sarah M., Denver</footer></blockquote><blockquote>“Clear details, responsive people, and none of the usual marketplace friction.”<footer>Demo customer · Jordan K., Austin</footer></blockquote></div><p className="demo-note">Testimonials shown for portfolio demonstration.</p></div></section>
      <section className="sell-banner"><div className="page-wrap sell-banner-inner"><div><p className="kicker">Your car has a story</p><h2>Ready for its<br /><em>next chapter?</em></h2><p className="banner-copy">Get a clear valuation and connect with buyers who are looking for a car like yours.</p></div><button className="button button-accent" onClick={() => navigate('sell')}>Sell your car <Icon name="arrow" /></button></div></section>
      <section className="final-cta home-section"><div className="page-wrap"><p className="kicker">The road is waiting</p><h2>Find your next<br /><em>favorite.</em></h2><button className="button button-dark" onClick={() => navigate('cars')}>Browse all cars <Icon name="arrow" /></button></div></section>
    </main>
  }

  const renderDetails = () => {
    if (!selectedCar) return <main className="not-found-page page-wrap"><p className="kicker">Maven / cars</p><h1>Vehicle not<br /><em>found.</em></h1><p className="lede">This listing may have moved or the vehicle ID is not available in our demo inventory.</p><button className="button button-dark" onClick={() => navigate('cars')}>Browse cars <Icon name="arrow" /></button></main>
    const gallery = [selectedCar.image, 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=85']
    const features = selectedCar.body === 'SUV' ? ['Panoramic sunroof', 'Adaptive cruise control', 'Leather seats', 'Parking sensors', 'Apple CarPlay', 'All-wheel drive'] : selectedCar.fuel === 'Electric' ? ['Premium sound system', 'Driver assistance', 'Heated seats', 'Fast charging', 'Glass roof', 'Backup camera'] : ['Apple CarPlay', 'Leather seats', 'Backup camera', 'Adaptive cruise control', 'Parking sensors', 'Sport exhaust']
    const similar = cars.filter((car) => car.id !== selectedCar.id && (car.body === selectedCar.body || Math.abs(car.price - selectedCar.price) < 30000)).slice(0, 3)
    const estimatedPayment = Math.round(selectedCar.price * 0.018)
    const dealer = dealers.find((item) => item.name === selectedCar.dealer)
    const shareVehicle = () => { if (navigator.clipboard) navigator.clipboard.writeText(window.location.href); showNotice('Vehicle link copied to your clipboard.') }
    return <main className="detail-page vehicle-detail page-wrap">
      <div className="breadcrumbs"><button onClick={() => navigate('home')}>Home</button><span>/</span><button onClick={() => navigate('cars')}>Cars</button><span>/</span><strong>{selectedCar.make} {selectedCar.model}</strong></div>
      <div className="vehicle-top">
        <section className="vehicle-gallery"><div className="gallery-main"><img src={gallery[galleryIndex]} alt={`${selectedCar.year} ${selectedCar.make} ${selectedCar.model} view ${galleryIndex + 1}`} onError={handleMarketplaceImageError} /><span className="gallery-count">{galleryIndex + 1} / {gallery.length}</span></div><div className="gallery-thumbs">{gallery.map((image, index) => <button className={galleryIndex === index ? 'active' : ''} key={image} onClick={() => setGalleryIndex(index)} aria-label={`View vehicle image ${index + 1}`}><img src={image} alt="" loading="lazy" onError={handleMarketplaceImageError} /></button>)}</div></section>
        <section className="vehicle-summary"><div className="summary-heading"><div><p className="kicker">{selectedCar.tag}</p><h1>{selectedCar.make}<br /><em>{selectedCar.model}</em></h1><p className="vehicle-trim">{selectedCar.color} · {selectedCar.body}</p></div><button className={`save-detail ${saved.includes(selectedCar.id) ? 'saved' : ''}`} onClick={() => toggleSaved(selectedCar.id)} aria-label={saved.includes(selectedCar.id) ? 'Remove vehicle from saved cars' : 'Save vehicle'}><Icon name="heart" /></button></div>
          <div className="price-row"><strong>{formatPrice(selectedCar.price)}</strong><span>Demo estimate<br />from {formatPrice(estimatedPayment)} / mo</span></div>
          <div className="vehicle-facts"><div><span>Year</span><strong>{selectedCar.year}</strong></div><div><span>Mileage</span><strong>{formatMileage(selectedCar.mileage)}</strong></div><div><span>Condition</span><strong>{selectedCar.tag === 'Certified' ? 'Certified' : selectedCar.year >= 2023 ? 'New arrival' : 'Used'}</strong></div><div><span>Location</span><strong>{selectedCar.location}</strong></div></div>
          <div className="summary-actions"><button className="button button-dark wide" onClick={() => openDealerInteraction('test-drive')}>Schedule a test drive <Icon name="arrow" /></button><div className="action-row"><button className="button button-outline" onClick={() => openDealerInteraction('contact')}>Contact dealer</button><button className="button button-outline" onClick={shareVehicle}>Share</button></div></div>
        </section>
      </div>
      <div className="vehicle-lower"><div className="vehicle-main-column"><section className="detail-section"><p className="kicker">The details</p><h2>Made for the<br /><em>long way around.</em></h2><p className="detail-description">This {selectedCar.year} {selectedCar.make} {selectedCar.model} brings together confident performance, considered design, and the kind of everyday usability that makes every drive feel like the right one. Carefully inspected and ready for its next chapter.</p></section><section className="detail-section specs-section"><p className="kicker">At a glance</p><h2>Vehicle specifications</h2><div className="spec-grid"><div><span>Fuel type</span><strong>{selectedCar.fuel}</strong></div><div><span>Transmission</span><strong>{selectedCar.transmission}</strong></div><div><span>Drivetrain</span><strong>{selectedCar.body === 'SUV' ? 'AWD' : 'Rear-wheel drive'}</strong></div><div><span>Engine</span><strong>{selectedCar.fuel === 'Electric' ? 'Dual motor electric' : selectedCar.body === 'SUV' ? '3.0L turbocharged' : '3.0L inline-six'}</strong></div><div><span>Exterior</span><strong>{selectedCar.color}</strong></div><div><span>Interior</span><strong>Black leather</strong></div></div></section><section className="detail-section"><p className="kicker">Included</p><h2>Key features</h2><div className="feature-grid">{features.map((feature) => <span key={feature}><Icon name="check" size={15} /> {feature}</span>)}</div></section></div>
        <aside className="vehicle-side-column"><div className="dealer-panel"><div className="dealer-avatar">{selectedCar.dealer.slice(0, 1)}</div><div><p className="kicker">Verified dealer</p><h3>{selectedCar.dealer}</h3><p><Icon name="pin" size={13} /> {selectedCar.location}</p></div><span className="dealer-check">✓</span><div className="dealer-stats"><span><strong>4.9</strong> rating</span><span><strong>128</strong> reviews</span><span><strong>{dealer?.vehicles || 0}</strong> cars</span></div><button className="button button-dark wide" onClick={() => dealer && openDealer(dealer.id)}>View dealer profile <Icon name="arrow" /></button></div><div className="finance-panel"><p className="kicker">Demo financing</p><h3>Make it yours from<br /><em>{formatPrice(estimatedPayment)} / month</em></h3><p>Estimate based on 72 months and 8.9% APR. This is portfolio demo information, not a financing offer.</p><button className="text-button" onClick={() => showNotice('Demo payment details requested.')}>See payment details <Icon name="arrow" /></button></div></aside>
      </div>
      <section className="similar-section"><div className="section-heading"><div><p className="kicker">Keep looking</p><h2>Similar vehicles</h2></div><button className="text-button" onClick={() => navigate('cars')}>View all cars <Icon name="arrow" /></button></div><div className="car-grid">{similar.map((car) => <CarCard key={car.id} car={car} saved={saved.includes(car.id)} onSave={toggleSaved} onOpen={openCar} />)}</div></section>
    </main>
  }

  const renderDealers = () => {
    const dealerQuery = query.toLowerCase()
    const matches = dealers.filter((dealer) => `${dealer.name} ${dealer.location}`.toLowerCase().includes(dealerQuery))
    const sorted = [...matches].sort((a, b) => sort === 'Name A–Z' ? a.name.localeCompare(b.name) : sort === 'Name Z–A' ? b.name.localeCompare(a.name) : Number(b.rating) - Number(a.rating))
    return <main className="dealer-directory page-wrap"><section className="dealer-directory-intro"><div><p className="kicker">The Maven network</p><h1>Find your<br /><em>people.</em></h1><p className="lede">Meet the independent dealers who bring expertise, transparency, and a little more care to every vehicle.</p></div><div className="dealer-directory-stat"><strong>{dealers.length}</strong><span>trusted dealers<br />in the network</span></div></section><div className="dealer-search-row"><div className="search-input"><Icon name="search" /><input aria-label="Search dealers" value={query} onChange={(event) => { setDealerVisibleCount(6); setQuery(event.target.value) }} placeholder="Search by dealer name or location" /></div><select aria-label="Sort dealers" value={sort === 'Recommended' || sort.startsWith('Name') ? sort : 'Recommended'} onChange={(event) => { setDealerVisibleCount(6); setSort(event.target.value) }}><option>Recommended</option><option>Name A–Z</option><option>Name Z–A</option></select></div>{sorted.length ? <><div className="dealer-directory-grid">{sorted.slice(0, dealerVisibleCount).map((dealer) => { const inventory = cars.filter((car) => car.dealer === dealer.name); return <article className="dealer-directory-card" key={dealer.id}><img src={dealer.image} alt="" loading="lazy" decoding="async" onError={handleMarketplaceImageError} /><div className="dealer-directory-card-body"><div className="dealer-card-top"><span className="verified-badge">✓ Verified</span><button className={`dealer-save ${savedDealers.includes(dealer.id) ? 'saved' : ''}`} onClick={() => toggleDealerSaved(dealer.id)} aria-label={`Save ${dealer.name}`}><Icon name="heart" size={16} /></button></div><h2>{dealer.name}</h2><p className="dealer-location"><Icon name="pin" size={14} /> {dealer.location}</p><p className="dealer-description">{dealer.description}</p><div className="dealer-directory-meta"><span><strong>{inventory.length || dealer.vehicles}</strong> vehicles</span><span><strong>★ {dealer.rating}</strong> ({dealer.reviews})</span></div><button className="button button-dark wide" onClick={() => openDealer(dealer.id)}>View dealer <Icon name="arrow" /></button></div></article> })}</div>{dealerVisibleCount < sorted.length && <button className="load-more dealer-load-more" onClick={() => setDealerVisibleCount((count) => Math.min(count + 6, sorted.length))}>Load more dealers <Icon name="arrow" /></button>}</> : <div className="empty-state dealer-empty"><span className="empty-icon"><Icon name="search" size={24} /></span><h2>No dealers found</h2><p>Try searching by a different name, city, or state.</p><button className="button button-outline" onClick={() => { setDealerVisibleCount(6); setQuery('') }}>Clear search</button></div>}</main>
  }

  const renderDealerProfile = () => {
    if (!selectedDealer) return <main className="not-found-page page-wrap"><p className="kicker">Maven / dealers</p><h1>Dealer not<br /><em>found.</em></h1><p className="lede">This dealer profile is not available in our demo network.</p><button className="button button-dark" onClick={() => navigate('dealers')}>Browse dealers <Icon name="arrow" /></button></main>
    const inventory = cars.filter((car) => car.dealer === selectedDealer.name)
    return <main className="dealer-profile-page page-wrap"><div className="breadcrumbs"><button onClick={() => navigate('home')}>Home</button><span>/</span><button onClick={() => navigate('dealers')}>Dealers</button><span>/</span><strong>{selectedDealer.name}</strong></div><section className="dealer-profile-hero"><img src={selectedDealer.image} alt="" loading="lazy" decoding="async" onError={handleMarketplaceImageError} /><div className="dealer-profile-overlay"><div className="dealer-profile-heading"><div><span className="verified-badge">✓ Verified dealer</span><h1>{selectedDealer.name}</h1><p><Icon name="pin" size={15} /> {selectedDealer.location}</p></div><button className={`save-detail ${savedDealers.includes(selectedDealer.id) ? 'saved' : ''}`} onClick={() => toggleDealerSaved(selectedDealer.id)} aria-label="Save dealer"><Icon name="heart" /></button></div></div></section><div className="dealer-profile-content"><section className="dealer-about"><div><p className="kicker">About the dealer</p><h2>People who know<br /><em>the road ahead.</em></h2></div><div><p>{selectedDealer.description} We believe the right vehicle should come with the right context, which is why our team takes time to share every detail and answer every question.</p><div className="dealer-profile-stats"><span><strong>★ {selectedDealer.rating}</strong> {selectedDealer.reviews} reviews</span><span><strong>{inventory.length || selectedDealer.vehicles}</strong> available vehicles</span><span><strong>✓</strong> Verified network member</span></div></div></section><section className="dealer-inventory-section"><div className="section-heading"><div><p className="kicker">Available now</p><h2>Current inventory</h2></div><button className="button button-outline" onClick={() => showNotice(`Contact request sent to ${selectedDealer.name}.`)}>Contact dealer <Icon name="arrow" /></button></div>{inventory.length ? <div className="car-grid">{inventory.map((car) => <CarCard key={car.id} car={car} saved={saved.includes(car.id)} onSave={toggleSaved} onOpen={openCar} />)}</div> : <div className="empty-state"><h2>No vehicles listed</h2><p>This dealer has no available vehicles in the current demo inventory.</p></div>}</section><aside className="dealer-contact-card"><div><p className="kicker">Talk to the team</p><h3>Ready to find<br /><em>your next car?</em></h3></div><div><p>{selectedDealer.phone}<br />{selectedDealer.email}</p><button className="button button-dark" onClick={() => showNotice('Demo contact request sent.')}>Call or email dealer <Icon name="arrow" /></button></div></aside></div></main>
  }
  const renderSimple = (type) => {
    if (type === 'not-found') return <main className="not-found-page page-wrap"><p className="kicker">Maven / page not found</p><h1>That road<br /><em>ends here.</em></h1><p className="lede">The page you’re looking for isn’t part of this marketplace.</p><button className="button button-dark" onClick={() => navigate('home')}>Back to home <Icon name="arrow" /></button></main>
    const content = { sell: ['Sell your car', 'A simpler, smarter way to sell.', 'Tell us about your car and get a transparent offer from our network of trusted buyers.'], dealers: ['Meet the experts', 'Local knowledge. Exceptional service.', 'Our dealer partners are selected for their expertise, integrity, and commitment to a better car buying experience.'], about: ['Built around the driver', 'Car buying, with the noise removed.', 'Maven is a curated marketplace for people who care about the journey as much as the destination.'], contact: ['We’re here to help', 'Have a question? Let’s talk.', 'Our team is ready to help with your search, your sale, or anything in between.'] }[type]
    return <main className="simple-page page-wrap"><div className="simple-heading"><p className="kicker">{type === 'contact' ? 'Get in touch' : 'Maven / ' + type}</p><h1>{content[0]}<br /><em>{content[1]}</em></h1><p className="lede">{content[2]}</p></div><div className="simple-grid"><div className="form-panel"><h2>{type === 'sell' ? 'Start with the basics' : type === 'contact' ? 'Send us a note' : 'Let’s make a plan'}</h2>{['Your name', 'Email address', type === 'sell' ? 'Year, make and model' : 'How can we help?'].map((label) => <label key={label}>{label}<input placeholder={label} /></label>)}<button className="button button-dark" onClick={() => showNotice('Message received. We’ll be in touch soon.')}>Submit request <Icon name="arrow" /></button></div><div className="simple-aside"><div className="aside-number">0{type === 'sell' ? '1' : '2'}</div><h3>{type === 'sell' ? 'One fair offer, no awkward negotiations.' : 'Good conversations make better journeys.'}</h3><p>Monday–Friday, 8am–6pm PT<br />hello@mavenmotors.co</p></div></div></main>
  }
  const renderSaved = () => {
    const savedCars = cars.filter((car) => saved.includes(car.id))
    return <main className="browse-page page-wrap saved-page"><section className="browse-intro"><div><p className="kicker">Your garage</p><h1>Saved cars</h1><p className="lede">Keep your favorites close while you find the right one.</p></div>{savedCars.length > 0 && <div className="saved-page-count"><strong>{savedCars.length}</strong><span>{savedCars.length === 1 ? 'vehicle saved' : 'vehicles saved'}</span></div>}</section>{savedCars.length ? <><div className="saved-list-heading"><p>Your shortlist</p><button className="clear-inline" onClick={clearSaved}>Clear all</button></div><div className="car-grid">{savedCars.map((car) => <CarCard key={car.id} car={car} saved onSave={removeSaved} onOpen={openCar} />)}</div></> : <div className="empty-state saved-empty"><span className="empty-icon"><Icon name="heart" size={24} /></span><h2>No saved cars yet</h2><p>Tap the heart on any vehicle you like. Your saved cars will be collected here.</p><button className="button button-dark" onClick={() => navigate('cars')}>Browse Cars <Icon name="arrow" /></button></div>}</main>
  }

  const renderAbout = () => <main className="about-page"><section className="about-hero"><div className="page-wrap"><p className="kicker light">A different kind of marketplace</p><h1>More than a car.<br /><em>A better way forward.</em></h1><p>We built Maven for people who believe finding the right car should feel as good as driving it.</p><button className="button button-accent" onClick={() => navigate('cars')}>Browse cars <Icon name="arrow" /></button></div></section><section className="about-story page-wrap"><div><p className="kicker">The idea behind Maven</p><h2>Clarity makes<br /><em>the journey.</em></h2></div><p>Maven is a fictional, curated automotive marketplace made for this portfolio project. It brings thoughtful listings, useful details, and independent dealers together in one calm place, so drivers can spend less time sorting through noise and more time finding a car that feels right.</p></section><section className="about-stats"><div className="page-wrap"><p className="kicker">A marketplace with momentum</p><div className="about-stat-grid"><div><strong>1,240+</strong><span>curated listings</span></div><div><strong>50</strong><span>states represented</span></div><div><strong>4.9/5</strong><span>demo buyer rating</span></div><div><strong>100%</strong><span>clear details</span></div></div><small>Illustrative portfolio demo figures.</small></div></section><section className="about-why page-wrap"><div className="about-section-heading"><p className="kicker">Why choose Maven</p><h2>Good information.<br /><em>Better decisions.</em></h2></div><div className="about-benefits"><article><span>01</span><h3>Vehicles worth a look</h3><p>Listings are presented with clear details to make comparison easier.</p></article><article><span>02</span><h3>People you can trust</h3><p>Independent dealer profiles help you understand who is behind each car.</p></article><article><span>03</span><h3>Search on your terms</h3><p>Useful filters and saved favorites keep your shortlist focused.</p></article></div></section><section className="about-process"><div className="page-wrap"><p className="kicker">A clear path to the driver’s seat</p><h2>How it works</h2><div className="about-process-grid"><div><span>01</span><h3>Discover</h3><p>Search by the details that matter to you.</p></div><div><span>02</span><h3>Compare</h3><p>Review vehicle information and save your favorites.</p></div><div><span>03</span><h3>Connect</h3><p>Contact a dealer or request a test drive.</p></div><div><span>04</span><h3>Move forward</h3><p>Continue the conversation directly with the seller.</p></div></div></div></section><section className="about-trust page-wrap"><div><p className="kicker">Confidence, by design</p><h2>Trust is in<br /><em>the details.</em></h2></div><div className="about-trust-copy"><p>Our demo marketplace highlights the information buyers need to take the next step with confidence.</p><ul><li>Vehicle history and condition details are easy to find.</li><li>Dealer profiles show location, reputation, and inventory.</li><li>Messages and test-drive requests are clearly labeled demo interactions.</li></ul></div></section><section className="about-cta"><div className="page-wrap"><p className="kicker light">Your next chapter</p><h2>Find the one<br /><em>that fits.</em></h2><div className="about-cta-actions"><button className="button button-accent" onClick={() => navigate('cars')}>Browse cars <Icon name="arrow" /></button><button className="text-button light" onClick={() => navigate('dealers')}>Meet our dealers <Icon name="arrow" /></button></div></div></section></main>

  const renderAppView = () => view === 'sell' ? <SellPage navigate={navigate} /> : view === 'contact' ? <ContactPage navigate={navigate} /> : view === 'about' ? renderAbout() : view === 'home' ? renderHome() : view === 'cars' || view === 'search' ? renderBrowse(view === 'search' ? 'Search results' : undefined) : view === 'details' ? renderDetails() : view === 'dealers' ? renderDealers() : view === 'dealer-profile' ? renderDealerProfile() : view === 'saved' ? renderSaved() : view === 'login' || view === 'signup' ? <main className="auth-page"><div className="auth-card"><p className="kicker">Maven / {view}</p><h1>{view === 'login' ? 'Welcome back.' : 'Start your journey.'}</h1><p>Save cars, manage your search, and pick up where you left off.</p><label>Email address<input type="email" placeholder="you@example.com" /></label><label>Password<input type="password" placeholder="••••••••" /></label><button className="button button-dark wide" onClick={() => { showNotice('Demo mode: welcome to Maven.'); navigate('dashboard') }}>{view === 'login' ? 'Sign in' : 'Create account'} <Icon name="arrow" /></button><button className="text-button" onClick={() => navigate(view === 'login' ? 'signup' : 'login')}>{view === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}</button></div></main> : view === 'dashboard' ? <main className="simple-page page-wrap"><div className="simple-heading"><p className="kicker">Your dashboard</p><h1>Welcome to<br /><em>your garage.</em></h1><p className="lede">Keep your search organized and your next move close.</p></div><div className="dashboard-stats"><div><strong>{saved.length}</strong><span>Saved cars</span></div><div><strong>0</strong><span>Test drives</span></div><div><strong>1</strong><span>Profile status</span></div></div><button className="button button-dark" onClick={() => navigate('cars')}>Continue browsing <Icon name="arrow" /></button></main> : renderSimple(view)

  return <div className="app-shell"><header className="site-header page-wrap"><button className="brand" onClick={() => navigate('home')}><span className="brand-mark">M</span><span>MAVEN<br /><small>MOTORS</small></span></button><nav className={mobileMenu ? 'open' : ''}>{navItems.map(([label, route]) => <button key={route} className={(view === route || (route === 'cars' && ['search', 'details'].includes(view))) ? 'active' : ''} aria-current={(view === route || (route === 'cars' && ['search', 'details'].includes(view))) ? 'page' : undefined} onClick={() => navigate(route)}>{label}</button>)}<button aria-label={`Saved cars, ${saved.length} saved`} aria-current={view === 'saved' ? 'page' : undefined} className={view === 'saved' ? 'active' : ''} onClick={() => navigate('saved')}>Saved <span className="saved-count">{saved.length}</span></button></nav><div className="header-actions"><button className="profile-button" onClick={() => navigate('login')}>Sign in</button><button className="button button-dark sell-button" onClick={() => navigate('sell')}>Sell a car <Icon name="arrow" /></button></div><button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation"><Icon name={mobileMenu ? 'close' : 'menu'} /></button></header>{renderAppView()}{dealerInteraction && selectedCar && <DealerInteractionModal type={dealerInteraction} car={selectedCar} dealer={dealers.find((dealer) => dealer.name === selectedCar.dealer)} onClose={() => setDealerInteraction(null)} />}<footer className="site-footer"><div className="page-wrap footer-grid"><div><button className="brand footer-brand" onClick={() => navigate('home')}><span className="brand-mark">M</span><span>MAVEN<br /><small>MOTORS</small></span></button><p>Exceptional cars.<br />A better way forward.</p></div><div><strong>Explore</strong><button onClick={() => navigate('cars')}>Browse cars</button><button onClick={() => navigate('dealers')}>Our dealers</button><button onClick={() => navigate('sell')}>Sell your car</button></div><div><strong>Company</strong><button onClick={() => navigate('about')}>About Maven</button><button onClick={() => navigate('contact')}>Contact</button><button onClick={() => navigate('login')}>Sign in</button></div><div><strong>Stay in the know</strong><p>New arrivals, thoughtfully<br />delivered to your inbox.</p><div className="email-capture"><input placeholder="Your email address" /><button aria-label="Subscribe"><Icon name="arrow" /></button></div></div></div><div className="page-wrap footer-bottom"><span>© 2024 Maven Motors</span><span>Made for the road ahead</span></div></footer>{notice && <div className="toast"><Icon name="check" /> {notice}</div>}</div>
}

export default App
