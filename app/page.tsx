'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, Calendar, Heart, Camera, Gift, Users, Sparkles, ChevronDown, Star, Flower2, Copy, CheckCircle, Navigation } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function WeddingInvitation() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    message: '',
    attendCivil: false,
    attendLunch: false,
    dietaryRestrictions: 'none',
    dietaryDetails: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    guests: '',
    message: '',
    events: '',
    dietary: ''
  })
  const [fieldValid, setFieldValid] = useState({
    name: false,
    guests: true,
    message: true,
    events: false,
    dietary: true
  })
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [copiedCVU, setCopiedCVU] = useState(false)
  const [copiedAlias, setCopiedAlias] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  // Wedding date: October 7, 2025 at 12:30
  const weddingDate = new Date('2025-10-07T12:30:00').getTime()

  useEffect(() => {
    setIsMounted(true)
    setIsVisible(true)
    
    // Countdown timer
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = weddingDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      // Detect active section
      const sections = ['hero', 'countdown', 'details', 'dresscode', 'gifts', 'rsvp', 'gallery']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [weddingDate])

  const { toast } = useToast()

  // Dietary restrictions options
  const dietaryOptions = [
    { id: 'none', label: 'Sin limitaciones', icon: '✅' },
    { id: 'vegetarian', label: 'Vegetariano', icon: '🥬' },
    { id: 'vegan', label: 'Vegano', icon: '🌱' },
    { id: 'gluten_free', label: 'Sin gluten (celíaco)', icon: '🚫🌾' },
    { id: 'lactose_free', label: 'Sin lactosa', icon: '🚫🥛' },
    { id: 'allergies', label: 'Alergias alimentarias', icon: '⚠️' },
    { id: 'other', label: 'Otras limitaciones', icon: '📝' }
  ]

  // Real-time validation functions
  const validateName = (name: string) => {
    if (!name.trim()) {
      setFieldErrors(prev => ({ ...prev, name: 'El nombre es requerido' }))
      setFieldValid(prev => ({ ...prev, name: false }))
      return false
    }
    if (name.trim().length < 2) {
      setFieldErrors(prev => ({ ...prev, name: 'El nombre debe tener al menos 2 caracteres' }))
      setFieldValid(prev => ({ ...prev, name: false }))
      return false
    }
    setFieldErrors(prev => ({ ...prev, name: '' }))
    setFieldValid(prev => ({ ...prev, name: true }))
    return true
  }

  const validateGuests = (guests: string) => {
    const num = Number(guests)
    if (isNaN(num) || num < 1 || num > 10) {
      setFieldErrors(prev => ({ ...prev, guests: 'Tiene que ser entre 1 y 10 invitados' }))
      setFieldValid(prev => ({ ...prev, guests: false }))
      return false
    }
    setFieldErrors(prev => ({ ...prev, guests: '' }))
    setFieldValid(prev => ({ ...prev, guests: true }))
    return true
  }

  const validateMessage = (message: string) => {
    if (message.length > 500) {
      setFieldErrors(prev => ({ ...prev, message: 'El mensaje no puede exceder 500 caracteres' }))
      setFieldValid(prev => ({ ...prev, message: false }))
      return false
    }
    setFieldErrors(prev => ({ ...prev, message: '' }))
    setFieldValid(prev => ({ ...prev, message: true }))
    return true
  }

  const validateEvents = (attendCivil: boolean, attendLunch: boolean) => {
    if (!attendCivil && !attendLunch) {
      setFieldErrors(prev => ({ ...prev, events: 'Debés seleccionar al menos un evento' }))
      setFieldValid(prev => ({ ...prev, events: false }))
      return false
    }
    setFieldErrors(prev => ({ ...prev, events: '' }))
    setFieldValid(prev => ({ ...prev, events: true }))
    return true
  }

  const validateDietaryRestrictions = (attendLunch: boolean, dietaryRestrictions: string, dietaryDetails: string) => {
    // Only validate if attending lunch
    if (!attendLunch) {
      return true // No validation needed if not attending lunch
    }
    
    // If has dietary restrictions other than "none" but no details provided
    if (dietaryRestrictions !== 'none' && ['allergies', 'other'].includes(dietaryRestrictions) && !dietaryDetails.trim()) {
      setFieldErrors(prev => ({ ...prev, dietary: 'Por favor especificá los detalles de tu limitación alimentaria' }))
      setFieldValid(prev => ({ ...prev, dietary: false }))
      return false
    }
    
    setFieldErrors(prev => ({ ...prev, dietary: '' }))
    setFieldValid(prev => ({ ...prev, dietary: true }))
    return true
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const nameValid = validateName(formData.name)
    const guestsValid = validateGuests(formData.guests)
    const messageValid = validateMessage(formData.message)
    const eventsValid = validateEvents(formData.attendCivil, formData.attendLunch)
    const dietaryValid = validateDietaryRestrictions(formData.attendLunch, formData.dietaryRestrictions, formData.dietaryDetails)
    
    if (nameValid && guestsValid && messageValid && eventsValid && dietaryValid) {
      setShowConfirmModal(true)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setShowConfirmModal(false)
    
    try {
      // Basic client-side validation
      if (!formData.name.trim()) {
        toast({
          title: "Error de validación",
          description: "Por favor ingresa tu nombre completo.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (Number(formData.guests) < 1 || Number(formData.guests) > 10) {
        toast({
          title: "Error de validación",
          description: "El número de invitados debe ser entre 1 y 10.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Send to our internal API
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombre: formData.name,
          Invitados: formData.guests,
          Mensaje: formData.message,
          attendCivil: formData.attendCivil,
          attendLunch: formData.attendLunch,
          dietaryRestrictions: formData.dietaryRestrictions,
          dietaryDetails: formData.dietaryDetails
        })
      })

      const result = await response.json()

      if (response.ok) {
        setIsLoading(false)
        setIsSubmitted(true)
        
        // Basic analytics tracking
        try {
          // Track RSVP submission event (Google Analytics)
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'rsvp_submitted', {
              event_category: 'engagement',
              event_label: 'wedding_rsvp',
              value: Number(result.data.invitados)
            })
          }
          
          // Simple local analytics (could be sent to your own analytics endpoint)
          const analyticsData = {
            timestamp: new Date().toISOString(),
            guests: result.data.invitados,
            hasMessage: !!formData.message,
            userAgent: navigator.userAgent,
            referrer: document.referrer
          }
          
          // Store locally for now (in production, you'd send this to an analytics service)
          localStorage.setItem('rsvp_analytics', JSON.stringify(analyticsData))
        } catch (error) {
          console.log('Analytics tracking failed:', error)
        }
        
        // Show success toast with personalized message based on selected events
        const eventsText = []
        if (formData.attendCivil) eventsText.push('la ceremonia civil (12:30 hs)')
        if (formData.attendLunch) eventsText.push('la celebración almuerzo (14:00 hs)')
        const eventsDescription = eventsText.length === 2 
          ? `en ${eventsText[0]} y ${eventsText[1]}`
          : `en ${eventsText[0]}`
        
        toast({
          title: "¡Confirmación enviada! ",
          description: `Gracias ${result.data.nombre}! Esperamos verte con ${result.data.invitados} invitado${Number(result.data.invitados) > 1 ? 's' : ''} ${eventsDescription}. ¡Será un día inolvidable!`,
        })
        
        // Reset after celebration
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({ name: '', guests: '1', message: '', attendCivil: false, attendLunch: false, dietaryRestrictions: 'none', dietaryDetails: '' })
        }, 5000)
      } else {
        throw new Error(result.error || 'Error al enviar confirmación')
      }
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
      
      // Show error toast
      toast({
        title: "Error al enviar confirmación",
        description: error instanceof Error ? error.message : "Hubo un problema al procesar tu solicitud. Por favor intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const copyToClipboard = async (text: string, type: 'cvu' | 'alias') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'cvu') {
        setCopiedCVU(true)
        setTimeout(() => setCopiedCVU(false), 2000)
      } else {
        setCopiedAlias(true)
        setTimeout(() => setCopiedAlias(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const generateCalendarEvent = () => {
    // Generate calendar events based on confirmed RSVP events
    let events = []
    
    if (formData.attendCivil) {
      events.push({
        startDate: '20251007T123000', // October 7, 2025 at 12:30
        endDate: '20251007T133000',   // October 7, 2025 at 13:30 (1 hour)
        summary: 'Ceremonia de Civil - Boda Natalia & Jan ⚖️',
        description: '¡Celebramos nuestro amor en la ceremonia civil! Te esperamos en este momento tan especial.',
        filename: 'ceremonia-civil-natalia-jan.ics'
      })
    }
    
    if (formData.attendLunch) {
      events.push({
        startDate: '20251007T140000', // October 7, 2025 at 14:00
        endDate: '20251008T020000',   // October 8, 2025 at 02:00 (estimated end)
        summary: 'Celebración Almuerzo - Boda Natalia & Jan 🍽️',
        description: '¡Celebramos nuestro amor con un almuerzo especial! Te esperamos para compartir este momento único.',
        filename: 'almuerzo-natalia-jan.ics'
      })
    }
    
    // Safety check: if no events selected, don't generate calendar
    if (events.length === 0) {
      toast({
        title: "No hay eventos seleccionados",
        description: "Primero confirmá tu asistencia a los eventos.",
        variant: "destructive"
      })
      return
    }
    
    // If both events are selected, create a combined calendar file
    if (formData.attendCivil && formData.attendLunch) {
      const combinedContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Natalia & Jan Wedding//ES
BEGIN:VEVENT
UID:${Date.now()}-civil@naty-jan-wedding.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:20251007T123000
DTEND:20251007T133000
SUMMARY:Ceremonia de Civil - Boda Natalia & Jan ⚖️
DESCRIPTION:¡Celebramos nuestro amor en la ceremonia civil! Te esperamos en este momento tan especial.
LOCATION:Subsede Comunal 11
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-P1D
DESCRIPTION:Recordatorio: Ceremonia de Civil mañana
ACTION:DISPLAY
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:${Date.now()}-lunch@naty-jan-wedding.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:20251007T140000
DTEND:20251008T020000
SUMMARY:Celebración Almuerzo - Boda Natalia & Jan 🍽️
DESCRIPTION:¡Celebramos nuestro amor con un almuerzo especial! Te esperamos para compartir este momento único.
LOCATION:Salón Los Jardines
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-P1D
DESCRIPTION:Recordatorio: Celebración Almuerzo mañana
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`
      
      const blob = new Blob([combinedContent], { type: 'text/calendar;charset=utf-8' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'boda-completa-natalia-jan.ics'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
      
      toast({
        title: "¡Eventos agregados! 📅",
        description: "Se descargaron ambos eventos. Ábrelo para agregarlos a tu calendario.",
      })
    } else {
      // Create single event
      const event = events[0]
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Natalia & Jan Wedding//ES
BEGIN:VEVENT
UID:${Date.now()}@naty-jan-wedding.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${event.startDate}
DTEND:${event.endDate}
SUMMARY:${event.summary}
DESCRIPTION:${event.description}
LOCATION:${formData.attendCivil ? 'Subsede Comunal 11' : 'Salón Las Delias'}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-P1D
DESCRIPTION:Recordatorio: ${event.summary} mañana
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = event.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)

      toast({
        title: "¡Evento agregado! 📅",
        description: "El evento se ha descargado. Abrilo para agregarlo a tu calendario.",
      })
    }
  }

  const FloatingElements = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-20"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i * 0.5}s`
          }}
        >
          <Flower2 className="w-4 h-4 text-champagne" />
        </div>
      ))}
    </div>
  )

  const ParallaxBackground = () => (
    <div 
      className="absolute inset-0 opacity-30"
      style={{
        transform: `translateY(${scrollY * 0.5}px)`,
      }}
    >
      <div className="absolute top-20 left-10 w-32 h-32 bg-champagne/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-eucalyptus/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-champagne/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  )

  // Prevent hydration mismatch by only rendering after component is mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-pearl text-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-champagne border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-eucalyptus font-poppins text-xl">Cargando invitación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pearl text-charcoal relative overflow-hidden">
      <FloatingElements />
      
      {/* Enhanced Navigation Dots - Hidden on mobile */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-4 hidden lg:flex flex-col">
        {['hero', 'countdown', 'details', 'dresscode', 'gifts', 'rsvp', 'gallery'].map((section, index) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className={`w-3 h-3 rounded-full transition-all duration-500 hover:scale-150 ${
              activeSection === section 
                ? 'bg-eucalyptus shadow-lg shadow-eucalyptus/50' 
                : 'bg-champagne/50 hover:bg-champagne'
            }`}
            aria-label={`Go to ${section} section`}
          />
        ))}
      </div>

      {/* Hero Section - Enhanced */}
      <section id="hero" ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <ParallaxBackground />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 z-10" />
        
        {/* Animated Background */}
        <div 
          className="absolute inset-0 transition-transform duration-1000 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0002})`,
          }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kennygifs_kiss_desmayo-TE0xKcLriZkrBDZOhQsnM4I0bmnXaJ.gif"
            alt="Natalia y Jan - Beso de Amor"
            fill
            className="object-cover object-position-center-60" // Adjusted image position
            priority
          />
        </div>

        {/* Enhanced Content */}
        <div className={`relative z-20 text-center text-white transition-all duration-2000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          {/* Decorative Elements */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-4 opacity-60">
              <Star className="w-4 h-4 animate-twinkle" />
              <Star className="w-3 h-3 animate-twinkle" style={{ animationDelay: '0.5s' }} />
              <Star className="w-4 h-4 animate-twinkle" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          {/* Nombres principales */}
          <div className="font-quicksand font-semibold text-[3.5rem] md:text-[5.5rem] mb-6 tracking-wide text-shadow-lg flex flex-col items-center">
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.5s' }}>Jan</span>
            <Heart className="w-10 h-10 md:w-12 md:h-12 my-2 text-champagne animate-heartbeat" style={{ animationDelay: '0.8s' }} />
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '1s' }}>Nati</span>
          </div>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-champagne animate-expand-width"></div>
            <Heart className="w-8 h-8 text-champagne animate-heartbeat" />
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-champagne animate-expand-width"></div>
          </div>
          
          {/* "Celebramos nuestro amor" */}
          <p className="font-poppins font-light text-lg mb-3 text-shadow-lg animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
            ✨ Celebramos nuestro amor ✨
          </p>
          {/* Fecha */}
          <p className="font-poppins font-medium text-3xl mb-4 text-champagne text-shadow-lg animate-fade-in-up" style={{ animationDelay: '2s' }}>
            ¡Nos casamos el 7 de octubre de 2025 a las 12.30 hs!
          </p>
          {/* Texto inferior */}
          
          <Button 
            onClick={() => scrollToSection('countdown')}
            className="bg-champagne/90 hover:bg-champagne text-charcoal font-medium px-10 py-4 rounded-full transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-champagne/50 animate-fade-in-up group"
            style={{ animationDelay: '3s' }}
          >
            <span className="mr-2">Ver Detalles</span>
            <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/70" />
        </div>
      </section>

      {/* Countdown Section - NEW */}
      <section id="countdown" className="py-32 bg-gradient-to-b from-eucalyptus/10 to-champagne/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-48 h-48 bg-eucalyptus rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-champagne rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="mb-16">
            <h2 className="font-poppins text-4xl md:text-5xl font-bold text-eucalyptus mb-6">Faltan ⏰</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-champagne to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: timeLeft.days, label: 'Días', color: 'from-eucalyptus/20 to-eucalyptus/10' },
              { value: timeLeft.hours, label: 'Horas', color: 'from-champagne/20 to-champagne/10' },
              { value: timeLeft.minutes, label: 'Minutos', color: 'from-eucalyptus/20 to-eucalyptus/10' },
              { value: timeLeft.seconds, label: 'Segundos', color: 'from-champagne/20 to-champagne/10' }
            ].map((item, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-3xl font-bold text-eucalyptus tabular-nums">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-charcoal">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="font-poppins font-normal text-lg text-center mt-12 text-eucalyptus/70">
            💖 Sumate a nosotros en este día único 💖
          </p>

          <div className="mt-12 space-y-6">
            
          </div>
        </div>
      </section>


      {/* Enhanced Event Details with Maps */}
      <section id="details" className="py-32 bg-gradient-to-b from-eucalyptus/5 to-champagne/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-eucalyptus rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-champagne rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-poppins text-4xl md:text-5xl font-bold text-eucalyptus mb-6">Detalles del Evento 📍</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-champagne to-transparent mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Ceremonia */}
            <Card className="group bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-eucalyptus/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-0 relative z-10">
                {/* Map */}
                <div className="h-48 relative overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.4234567890123!2d-58.4961905!3d-34.6017898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb6256a38ebbb%3A0x1dc1e8b2a2d9554b!2sSubsede%20Comunal%2011%2C%20Buenos%20Aires%2C%20Argentina!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="transition-all duration-300 group-hover:scale-105"
                  ></iframe>
                </div>
                
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-eucalyptus/20 to-eucalyptus/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Heart className="w-8 h-8 text-eucalyptus" />
                  </div>
                  <h3 className="font-poppins text-3xl text-eucalyptus mb-6">Ceremonia de Civil</h3>
                  <div className="space-y-4 text-charcoal mb-6">
                    <div className="flex items-center justify-center gap-3 group/item hover:text-eucalyptus transition-colors">
                      <Calendar className="w-6 h-6 text-champagne group-hover/item:scale-110 transition-transform" />
                      <span className="text-lg">7 de Octubre, 2025</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 group/item hover:text-eucalyptus transition-colors">
                      <Clock className="w-6 h-6 text-champagne group-hover/item:scale-110 transition-transform" />
                      <span className="text-lg">12:30 hs</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 group/item hover:text-eucalyptus transition-colors">
                      <MapPin className="w-6 h-6 text-champagne group-hover/item:scale-110 transition-transform" />
                      <span className="text-lg">Subsede Comunal 11</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.open('https://www.google.com/maps/place/Subsede+Comunal+11/@-34.6017898,-58.4961905,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb6256a38ebbb:0x1dc1e8b2a2d9554b!8m2!3d-34.6017898!4d-58.4961905!16s%2Fg%2F11bwf81yc7?entry=ttu&g_ep=EgoyMDI1MDgwNC4wIKXMDSoASAFQAw%3D%3D', '_blank')}
                    className="bg-eucalyptus/10 hover:bg-eucalyptus hover:text-white text-eucalyptus border-eucalyptus/30 transition-all duration-300"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Cómo llegar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Celebración */}
            <Card className="group bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-champagne/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-0 relative z-10">
                {/* Map */}
                <div className="h-48 relative overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3286.9015017826946!2d-58.497924!3d-34.5307234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb12d51edcfa3%3A0xf11ea055b32e5d63!2sLas%20Delias!5e0!3m2!1ses-419!2sar!4v1756425958245!5m2!1ses-419!2sar"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="transition-all duration-300 group-hover:scale-105"
                  ></iframe>
                </div>
                
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-champagne/20 to-champagne/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-8 h-8 text-eucalyptus" />
                  </div>
                  <h3 className="font-poppins text-3xl text-eucalyptus mb-6">Celebración</h3>
                  <div className="space-y-4 text-charcoal mb-6">
                    <div className="flex items-center justify-center gap-3 group/item hover:text-eucalyptus transition-colors">
                      <Calendar className="w-6 h-6 text-champagne group-hover/item:scale-110 transition-transform" />
                      <span className="text-lg">Continuamos festejando</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 group/item hover:text-eucalyptus transition-colors">
                      <Clock className="w-6 h-6 text-champagne group-hover/item:scale-110 transition-transform" />
                      <span className="text-lg">14:00 hs</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 group/item hover:text-eucalyptus transition-colors">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-champagne group-hover/item:scale-110 transition-transform" />
                        <span className="text-lg">Salón Las Delias</span>
                      </div>
                      <span className="text-sm text-charcoal/70">Gral. José de San Martín 2673, Florida</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.open('https://maps.app.goo.gl/hUXN4gBHdG4oBqPK8', '_blank')}
                    className="bg-champagne/10 hover:bg-eucalyptus hover:text-white text-eucalyptus border-eucalyptus/30 transition-all duration-300"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Cómo llegar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* Simplified Dress Code */}
      <section id="dresscode" className="py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-eucalyptus mb-6">Dress Code ✨</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-champagne to-transparent mx-auto"></div>
        </div>

        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border-0 shadow-2xl max-w-4xl mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-eucalyptus/5 via-transparent to-champagne/5"></div>
          <CardContent className="p-16 relative z-10 text-center">
            <div className="space-y-8">
              <div className="text-3xl text-eucalyptus font-poppins font-medium leading-relaxed text-center">
                Elegante sport ¡Sé vos!
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Enhanced Gifts Section with CVU */}
      <section id="gifts" className="py-32 bg-gradient-to-b from-champagne/5 to-eucalyptus/5">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-eucalyptus mb-6">Mesa de Regalos 🎁</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-champagne to-transparent mx-auto mb-8"></div>
          
          <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-eucalyptus/5 to-champagne/5"></div>
            <CardContent className="p-12 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-eucalyptus/20 to-champagne/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Gift className="w-10 h-10 text-eucalyptus" />
              </div>
              <h3 className="font-poppins text-3xl text-eucalyptus mb-6">Con amor y gratitud</h3>
              <p className="text-xl text-charcoal mb-8 leading-relaxed max-w-3xl mx-auto">
                Tu presencia es nuestro regalo más preciado. Si deseás obsequiarnos algo especial, 
                podés hacerlo a través de una transferencia bancaria.
              </p>

              {/* CVU Information */}
              <div className="bg-eucalyptus/5 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
                <h4 className="font-poppins text-2xl text-eucalyptus mb-6">Datos de la cuenta</h4>
                
                <div className="space-y-6">
                  {/* Alias */}
                  <div className="bg-white/80 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm text-charcoal/70 mb-1">Alias</p>
                        <p className="text-base sm:text-lg font-semibold text-charcoal break-all">jan.nata.boda</p>
                      </div>
                      <Button
                        onClick={() => copyToClipboard('jan.nata.boda', 'alias')}
                        className="bg-champagne/10 hover:bg-eucalyptus hover:text-white text-eucalyptus border-0 transition-all duration-300 shrink-0 w-full sm:w-auto"
                      >
                        {copiedAlias ? (
                          <><CheckCircle className="w-4 h-4 mr-2" /> Copiado</>
                        ) : (
                          <><Copy className="w-4 h-4 mr-2" /> Copiar</>
                        )}
                      </Button>
                    </div>
                  </div>
                  {/* CVU */}
                  <div className="bg-white/80 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm text-charcoal/70 mb-1">CVU</p>
                        <p className="text-base sm:text-lg font-semibold text-charcoal break-all">0000003100038534588857</p>
                      </div>
                      <Button
                        onClick={() => copyToClipboard('0000003100038534588857', 'cvu')}
                        className="bg-champagne/10 hover:bg-eucalyptus hover:text-white text-eucalyptus border-0 transition-all duration-300 shrink-0 w-full sm:w-auto"
                      >
                        {copiedCVU ? (
                          <><CheckCircle className="w-4 h-4 mr-2" /> Copiado</>
                        ) : (
                          <><Copy className="w-4 h-4 mr-2" /> Copiar</>
                        )}
                      </Button>
                    </div>
                  </div>
                  {/* Titular */}
                  <div className="bg-white/80 rounded-xl p-4 sm:p-6">
                    <div className="text-left">
                      <p className="text-sm text-charcoal/70 mb-1">Titular</p>
                      <p className="text-base sm:text-lg font-semibold text-charcoal">Natalia Estefania Villagra</p>
                    </div>
                  </div>
                  {/* Mercado Pago */}
                  <div className="bg-white/80 rounded-xl p-4 sm:p-6">
                    <div className="text-left">
                      <p className="text-sm text-charcoal/70 mb-1">Banco</p>
                      <p className="text-base sm:text-lg font-semibold text-charcoal">Mercado Pago</p>
                    </div>
                  </div>
                </div>

                <p className="text-eucalyptus italic">
                  ¡Cualquier monto será recibido con muchísimo amor y gratitud!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced RSVP - Simplified */}
      <section id="rsvp" className="py-32 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-eucalyptus mb-6">Confirmá tu Asistencia 💌</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-champagne to-transparent mx-auto mb-6"></div>
          <p className="text-xl text-charcoal mb-2">Tu presencia es el regalo más importante para nosotros.</p>
          <p className="text-eucalyptus font-medium">¡Por favor, confirmá antes del 15 de septiembre!</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-eucalyptus/5 to-champagne/5"></div>
          <CardContent className="p-12 relative z-10">
            {isSubmitted ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-br from-eucalyptus/20 to-champagne/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <Heart className="w-12 h-12 text-eucalyptus animate-heartbeat" />
                </div>
                <h3 className="font-poppins text-4xl text-eucalyptus mb-4">¡Gracias!</h3>
                <p className="text-xl text-charcoal mb-6">Hemos recibido tu confirmación con mucha alegría</p>
                <p className="text-eucalyptus mb-8">¡Esperamos verte en nuestro día especial!</p>
                
                {/* Calendar Button - Only show if at least one event is selected */}
                {(formData.attendCivil || formData.attendLunch) && (
                  <div className="animate-fade-in" style={{ animationDelay: '1s' }}>
                    <div className="bg-eucalyptus/5 rounded-2xl p-6 mb-8 max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-eucalyptus" />
                        <span className="text-eucalyptus font-semibold">No te olvides de la fecha</span>
                      </div>
                      <p className="text-sm text-charcoal/70 mb-4">
                        Agrega {formData.attendCivil && formData.attendLunch ? 'los eventos' : 'el evento'} a tu calendario para no perderte nuestro día especial
                      </p>
                      <Button
                        onClick={generateCalendarEvent}
                        className="bg-eucalyptus hover:bg-eucalyptus/90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Agregar al Calendario
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-champagne animate-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-charcoal mb-3">
                      Nombre completo *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value
                        setFormData({...formData, name: value})
                        validateName(value)
                      }}
                      onBlur={() => validateName(formData.name)}
                      className={`border-2 focus:border-eucalyptus rounded-xl px-4 py-3 text-lg transition-all duration-300 hover:border-eucalyptus/50 ${
                        fieldErrors.name ? 'border-red-400 focus:border-red-500' : 
                        fieldValid.name ? 'border-green-400 focus:border-eucalyptus' : 'border-eucalyptus/30'
                      }`}
                      placeholder="Tu nombre completo"
                    />
                    {fieldErrors.name && (
                      <p className="text-red-500 text-sm mt-1 animate-fade-in">{fieldErrors.name}</p>
                    )}
                    {fieldValid.name && !fieldErrors.name && (
                      <p className="text-green-600 text-sm mt-1 animate-fade-in flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Nombre válido
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-charcoal mb-3">
                      Número de acompañantes
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.guests}
                      onChange={(e) => {
                        const value = e.target.value
                        setFormData({...formData, guests: value})
                        validateGuests(value)
                      }}
                      onBlur={() => validateGuests(formData.guests)}
                      className={`border-2 focus:border-eucalyptus rounded-xl px-4 py-3 text-lg transition-all duration-300 hover:border-eucalyptus/50 ${
                        fieldErrors.guests ? 'border-red-400 focus:border-red-500' : 
                        fieldValid.guests ? 'border-green-400 focus:border-eucalyptus' : 'border-eucalyptus/30'
                      }`}
                    />
                    {fieldErrors.guests && (
                      <p className="text-red-500 text-sm mt-1 animate-fade-in">{fieldErrors.guests}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-charcoal mb-3">
                    Mensaje personal (opcional)
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData({...formData, message: value})
                      validateMessage(value)
                    }}
                    onBlur={() => validateMessage(formData.message)}
                    className={`border-2 focus:border-eucalyptus rounded-xl px-4 py-3 text-lg transition-all duration-300 hover:border-eucalyptus/50 min-h-[120px] ${
                      fieldErrors.message ? 'border-red-400 focus:border-red-500' : 'border-eucalyptus/30'
                    }`}
                    placeholder="Compartí tus buenos deseos para este día especial..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {fieldErrors.message && (
                      <p className="text-red-500 text-sm animate-fade-in">{fieldErrors.message}</p>
                    )}
                    <p className={`text-sm ml-auto ${
                      formData.message.length > 450 ? 'text-red-500' : 
                      formData.message.length > 400 ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {formData.message.length}/500
                    </p>
                  </div>
                </div>
                
                {/* Event Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-charcoal mb-4">
                    ¿A qué eventos asistirás? *
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Civil Ceremony */}
                    <div className="bg-white/80 rounded-xl p-6 border-2 transition-all duration-300 hover:border-eucalyptus/50 cursor-pointer"
                         onClick={() => {
                           const newValue = !formData.attendCivil
                           setFormData({...formData, attendCivil: newValue})
                           validateEvents(newValue, formData.attendLunch)
                         }}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                          formData.attendCivil ? 'bg-eucalyptus border-eucalyptus' : 'border-eucalyptus/30'
                        }`}>
                          {formData.attendCivil && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">⚖️</span>
                            <h4 className="font-semibold text-eucalyptus">Ceremonia de Civil</h4>
                          </div>
                          <p className="text-sm text-charcoal/70">12:30 hs</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lunch Celebration */}
                    <div className="bg-white/80 rounded-xl p-6 border-2 transition-all duration-300 hover:border-eucalyptus/50 cursor-pointer"
                         onClick={() => {
                           const newValue = !formData.attendLunch
                           setFormData({...formData, attendLunch: newValue})
                           validateEvents(formData.attendCivil, newValue)
                         }}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                          formData.attendLunch ? 'bg-eucalyptus border-eucalyptus' : 'border-eucalyptus/30'
                        }`}>
                          {formData.attendLunch && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">🍽️</span>
                            <h4 className="font-semibold text-eucalyptus">Celebración Almuerzo</h4>
                          </div>
                          <p className="text-sm text-charcoal/70">14:00 hs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {fieldErrors.events && (
                    <p className="text-red-500 text-sm mt-2 animate-fade-in flex items-center gap-1">
                      <span className="text-red-500">⚠️</span>
                      {fieldErrors.events}
                    </p>
                  )}
                  {fieldValid.events && !fieldErrors.events && (
                    <p className="text-green-600 text-sm mt-2 animate-fade-in flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> 
                      Eventos seleccionados correctamente
                    </p>
                  )}
                </div>

                {/* Dietary Restrictions Section - Only show if attending lunch */}
                {formData.attendLunch && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="border-t border-eucalyptus/20 pt-6">
                      <h4 className="font-poppins text-xl text-eucalyptus mb-4 flex items-center gap-2">
                        🍽️ Preferencias Gastronómicas
                      </h4>
                      <p className="text-charcoal/70 text-sm mb-4">
                        Para ofrecerte la mejor experiencia culinaria, por favor indicanos si tenés alguna limitación alimentaria:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {dietaryOptions.map((option) => (
                          <label
                            key={option.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                              formData.dietaryRestrictions === option.id
                                ? 'border-eucalyptus bg-eucalyptus/10 text-eucalyptus'
                                : 'border-gray-200 hover:border-eucalyptus/50 hover:bg-eucalyptus/5'
                            }`}
                          >
                            <input
                              type="radio"
                              name="dietaryRestrictions"
                              value={option.id}
                              checked={formData.dietaryRestrictions === option.id}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                dietaryRestrictions: e.target.value,
                                dietaryDetails: e.target.value === 'none' ? '' : prev.dietaryDetails
                              }))}
                              className="sr-only"
                            />
                            <span className="text-lg">{option.icon}</span>
                            <span className="font-medium text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>

                      {/* Details field - show if not "none" */}
                      {formData.dietaryRestrictions !== 'none' && (
                        <div className="animate-fade-in">
                          <Textarea
                            placeholder="Por favor, especificá detalles (ej: alergia a nueces, mariscos, etc.)"
                            value={formData.dietaryDetails}
                            onChange={(e) => setFormData(prev => ({ ...prev, dietaryDetails: e.target.value }))}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 transition-all duration-300 resize-none"
                            rows={2}
                            maxLength={200}
                          />
                          <p className="text-xs text-charcoal/50 mt-1">
                            {formData.dietaryDetails.length}/200 caracteres
                          </p>
                          {fieldErrors.dietary && (
                            <p className="text-red-500 text-sm mt-2 animate-fade-in flex items-center gap-1">
                              <span className="text-red-500">⚠️</span>
                              {fieldErrors.dietary}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="text-center pt-6">
                  <Button 
                    type="submit"
                    disabled={isLoading || !fieldValid.name || !fieldValid.guests || !fieldValid.message || !fieldValid.events || !fieldValid.dietary}
                    className="bg-eucalyptus hover:bg-eucalyptus/90 text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Confirmar Asistencia
                    </div>
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-eucalyptus/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-eucalyptus" />
              </div>
              <h3 className="font-poppins text-2xl font-bold text-eucalyptus mb-2">Confirmar Asistencia</h3>
              <p className="text-charcoal/70">¿Estás seguro de que quieres enviar tu confirmación?</p>
            </div>
            
            <div className="bg-eucalyptus/5 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal/70">Nombre:</span>
                <span className="font-semibold text-charcoal">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/70">Invitados:</span>
                <span className="font-semibold text-charcoal">{formData.guests}</span>
              </div>
              <div className="pt-2 border-t border-eucalyptus/20">
                <span className="text-charcoal/70 block mb-2">Eventos seleccionados:</span>
                <div className="space-y-1">
                  {formData.attendCivil && (
                    <div className="flex items-center gap-2 text-sm text-eucalyptus">
                      <span>⚖️</span>
                      <span>Ceremonia de Civil (12:30 hs)</span>
                    </div>
                  )}
                  {formData.attendLunch && (
                    <div className="flex items-center gap-2 text-sm text-eucalyptus">
                      <span>🍽️</span>
                      <span>Celebración Almuerzo (14:00 hs)</span>
                    </div>
                  )}
                </div>
              </div>
              {formData.attendLunch && formData.dietaryRestrictions !== 'none' && (
                <div className="pt-2 border-t border-eucalyptus/20">
                  <span className="text-charcoal/70 block mb-2">Limitaciones gastronómicas:</span>
                  <div className="flex items-center gap-2 text-sm text-eucalyptus mb-1">
                    <span>{dietaryOptions.find(opt => opt.id === formData.dietaryRestrictions)?.icon}</span>
                    <span>{dietaryOptions.find(opt => opt.id === formData.dietaryRestrictions)?.label}</span>
                  </div>
                  {formData.dietaryDetails && (
                    <p className="text-xs text-charcoal italic mt-1">"{formData.dietaryDetails}"</p>
                  )}
                </div>
              )}
              {formData.message && (
                <div className="pt-2 border-t border-eucalyptus/20">
                  <span className="text-charcoal/70 block mb-1">Mensaje:</span>
                  <p className="text-sm text-charcoal italic">"{formData.message}"</p>
                </div>
              )}
            </div>
            
            {/* Mensaje de puntualidad - Solo si asiste a ceremonia civil */}
            {formData.attendCivil && (
              <div className="flex items-center justify-center gap-2 text-xs text-green-600 mb-6 bg-green-50 rounded-lg py-3 px-4">
                <span>✅</span>
                <span className="font-medium">Favor de llegar 15 minutos antes</span>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-charcoal border-0"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-eucalyptus hover:bg-eucalyptus/90 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Enviando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Confirmar
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Gallery */}
      <section id="gallery" className="py-32 bg-gradient-to-b from-eucalyptus/5 to-champagne/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="font-poppins text-4xl md:text-5xl font-bold text-eucalyptus mb-6">¡Te Esperamos! 💖</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-champagne to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center max-w-4xl mx-auto">
            {/* KennysGifs Gallery Images */}
            <div className="relative w-80 h-80 overflow-hidden rounded-2xl group cursor-pointer">
              <Image
                src="/kennygifs_1.jpg"
                alt="Natalia y Jan - Momentos Especiales"
                fill
                className="object-cover transition-all duration-700 group-hover:scale-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="relative w-80 h-80 overflow-hidden rounded-2xl group cursor-pointer">
              <Image
                src="/kennygifs_2.jpg"
                alt="Natalia y Jan - Momentos Especiales"
                fill
                className="object-cover transition-all duration-700 group-hover:scale-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="relative w-80 h-80 overflow-hidden rounded-2xl group cursor-pointer">
              <Image
                src="/kennygifs_3.jpg"
                alt="Natalia y Jan - Momentos Especiales"
                fill
                className="object-cover transition-all duration-700 group-hover:scale-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="relative w-80 h-80 overflow-hidden rounded-2xl group cursor-pointer">
              <Image
                src="/kennygifs_4.jpg"
                alt="Natalia y Jan - Momentos Especiales"
                fill
                className="object-cover transition-all duration-700 group-hover:scale-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 text-center bg-gradient-to-b from-charcoal to-charcoal/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-champagne rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-eucalyptus rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="font-poppins text-5xl mb-6 text-champagne">Natalia & Jan</div>
          
          {/* GIF romántico centrado */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-champagne/30 shadow-2xl hover:border-champagne/60 transition-all duration-500 hover:scale-110">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kennygifs_kiss_desmayo-TE0xKcLriZkrBDZOhQsnM4I0bmnXaJ.gif"
                alt="Natalia y Jan - Beso de Amor"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
          
          <p className="text-2xl mb-6 text-white/90">7 de Octubre, 2025</p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-champagne"></div>
            <Heart className="w-8 h-8 text-champagne animate-heartbeat" />
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-champagne"></div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default WeddingInvitation
