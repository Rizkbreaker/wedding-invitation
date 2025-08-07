'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, Calendar, Heart, Camera, Gift, Users, Sparkles, ChevronDown, Star, Flower2, Copy, CheckCircle, Navigation } from 'lucide-react'
import Image from 'next/image'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function WeddingInvitation() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
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
      const sections = ['hero', 'countdown', 'story', 'details', 'dresscode', 'gifts', 'rsvp', 'gallery']
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call with elegant loading
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setIsSubmitted(true)
    
    // Reset after celebration
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', guests: '1', message: '' })
    }, 5000)
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
        {['hero', 'countdown', 'story', 'details', 'dresscode', 'gifts', 'rsvp', 'gallery'].map((section, index) => (
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
          <div className="font-quicksand font-semibold text-[3.5rem] md:text-[5.5rem] mb-6 tracking-wide text-shadow-lg">
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.5s' }}>Natalia</span>
            <span className="mx-6 text-champagne animate-pulse text-5xl md:text-7xl">💕</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '1s' }}>Jan</span>
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
            7 de Octubre, 2025
          </p>
          {/* Texto inferior */}
          <p className="font-poppins font-normal text-base mb-12 opacity-90 text-shadow-lg animate-fade-in-up" style={{ animationDelay: '2.5s' }}>
            💖 Tu presencia hará especial nuestro día 💖
          </p>
          
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
            <p className="text-eucalyptus/70 mt-4">Cada segundo nos acerca más a nuestro día especial</p>
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

          <div className="mt-12">
            <p className="text-xl text-eucalyptus font-medium">
              ¡Nos casamos el 7 de Octubre de 2025 a las 12:30 hs!
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Story Section */}
      <section id="story" className="py-32 px-4 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 text-9xl font-poppins text-eucalyptus transform rotate-12">Love</div>
        </div>
        
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center mb-20">
            <div className="inline-block relative">
              <h2 className="font-poppins text-4xl md:text-5xl font-bold text-eucalyptus mb-6 relative z-10">
                Nuestra Historia 💕
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-champagne to-transparent"></div>
            </div>
            <p className="text-eucalyptus/70 mt-4 italic">Un amor que trasciende el tiempo</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Hoy, queremos celebrar este nuevo capítulo junto a las personas que más amamos. Cada detalle ha sido pensado para reflejar nuestra historia única y el futuro que construiremos juntos.
                </p>
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-champagne/20 to-eucalyptus/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kennygifs_almorzando.jpg-vBJYnkOdvCBYgWOG8485hUFRhUadud.jpeg"
                  alt="Natalia y Jan - Nuestra Historia"
                  width={500}
                  height={600}
                  className="relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-700"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-champagne/10 rounded-full blur-2xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-eucalyptus/10 rounded-full blur-xl"></div>
              </div>
            </div>
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
            <p className="text-eucalyptus/70 mt-4">Momentos que recordaremos para siempre</p>
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
                  <h3 className="font-poppins text-3xl text-eucalyptus mb-6">Ceremonia</h3>
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
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168907785845!2d-58.3815591!3d-34.6037181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca3b4ef90cbd%3A0xa0b3812e88e88e8e!2sPuerto%20Madero%2C%20Buenos%20Aires%2C%20Argentina!5e0!3m2!1sen!2sus!4v1234567890"
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
                    <div className="flex items-center justify-center gap-3 group/item hover:text-eucalyptus transition-colors">
                      <MapPin className="w-6 h-6 text-champagne group-hover/item:scale-110 transition-transform" />
                      <span className="text-lg">Salón Los Jardines</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.open('https://maps.google.com/?q=Salon+Los+Jardines+Buenos+Aires', '_blank')}
                    className="bg-champagne/10 hover:bg-eucalyptus hover:text-white text-eucalyptus border-eucalyptus/30 transition-all duration-300"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Cómo llegar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <Clock className="w-5 h-5 text-eucalyptus" />
              <p className="text-eucalyptus font-medium">Favor de llegar 15 minutos antes de la ceremonia</p>
            </div>
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
              <p className="text-2xl text-eucalyptus/80 leading-relaxed font-light">
                Elegancia natural para un día especial...
              </p>
              
              <div className="text-3xl text-eucalyptus font-poppins font-medium leading-relaxed">
                ¡sé vos, pero en tu versión más radiante! ✨
              </div>
              
              <p className="text-xl text-charcoal/80 leading-relaxed font-light">
                Vení cómodo, vení auténtico, vení brillando :)
              </p>
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
                Tu presencia es nuestro regalo más preciado. Si deseas obsequiarnos algo especial, 
                puedes hacerlo a través de una transferencia bancaria.
              </p>

              {/* CVU Information */}
              <div className="bg-eucalyptus/5 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
                <h4 className="font-poppins text-2xl text-eucalyptus mb-6">Datos para Transferencia</h4>
                
                <div className="space-y-6">
                  {/* CVU */}
                  <div className="bg-white/80 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm text-charcoal/70 mb-1">CVU</p>
                        <p className="text-base sm:text-lg font-mono font-semibold text-charcoal break-all">0000003100010000000001</p>
                      </div>
                      <Button
                        onClick={() => copyToClipboard('0000003100010000000001', 'cvu')}
                        className="bg-eucalyptus/10 hover:bg-eucalyptus hover:text-white text-eucalyptus border-0 transition-all duration-300 shrink-0 w-full sm:w-auto"
                      >
                        {copiedCVU ? (
                          <><CheckCircle className="w-4 h-4 mr-2" /> Copiado</>
                        ) : (
                          <><Copy className="w-4 h-4 mr-2" /> Copiar</>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Alias */}
                  <div className="bg-white/80 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm text-charcoal/70 mb-1">Alias</p>
                        <p className="text-base sm:text-lg font-semibold text-charcoal break-all">NATALIA.JAN.BODA</p>
                      </div>
                      <Button
                        onClick={() => copyToClipboard('NATALIA.JAN.BODA', 'alias')}
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

                  {/* Additional Info */}
                  <div className="bg-white/80 rounded-xl p-6">
                    <div className="text-left space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-charcoal/70">Titular:</span>
                        <span className="text-sm font-semibold text-charcoal">Jan Kowalski</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-charcoal/70">Banco:</span>
                        <span className="text-sm font-semibold text-charcoal">Banco Nación</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-charcoal/70">CUIT:</span>
                        <span className="text-sm font-semibold text-charcoal">20-12345678-9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-eucalyptus italic">
                ¡Cualquier monto será recibido con muchísimo amor y gratitud!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced RSVP - Simplified */}
      <section id="rsvp" className="py-32 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-eucalyptus mb-6">Confirma tu Asistencia 💌</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-champagne to-transparent mx-auto mb-6"></div>
          <p className="text-xl text-charcoal mb-2">Tu presencia es el regalo más importante para nosotros</p>
          <p className="text-eucalyptus font-medium">Por favor, confirma antes del 15 de septiembre</p>
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
                <p className="text-eucalyptus">¡Esperamos verte en nuestro día especial!</p>
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-champagne animate-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-charcoal mb-3">
                      Nombre completo *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="border-2 border-eucalyptus/30 focus:border-eucalyptus rounded-xl px-4 py-3 text-lg transition-all duration-300 hover:border-eucalyptus/50"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-charcoal mb-3">
                      Número de acompañantes
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: e.target.value})}
                      className="border-2 border-eucalyptus/30 focus:border-eucalyptus rounded-xl px-4 py-3 text-lg transition-all duration-300 hover:border-eucalyptus/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-charcoal mb-3">
                    Mensaje personal (opcional)
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="border-2 border-eucalyptus/30 focus:border-eucalyptus rounded-xl px-4 py-3 text-lg transition-all duration-300 hover:border-eucalyptus/50 min-h-[120px]"
                    placeholder="Comparte tus buenos deseos para este día especial..."
                  />
                </div>
                
                <div className="text-center pt-6">
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-eucalyptus hover:bg-eucalyptus/90 text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Enviando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Confirmar Asistencia
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Enhanced Gallery */}
      <section id="gallery" className="py-32 bg-gradient-to-b from-eucalyptus/5 to-champagne/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="font-poppins text-4xl md:text-5xl font-bold text-eucalyptus mb-6">¡Te Esperamos! 💖</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-champagne to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Imágenes de KennysGifs al final de la galería */}
            <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.jpg-BQq8cYlMKbJ3gwevekKnu1fM9bvPd0.jpeg"
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
            
            <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.jpg-vvMFciwlN3SnUrC56GBEg9ruwaaFwS.jpeg"
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
            
            <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3.jpg-un8R3C6xB0M4Cmkx25Jm2zpAliKrAh.jpeg"
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
            
            <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kennygifs_kiss_desmayo-TE0xKcLriZkrBDZOhQsnM4I0bmnXaJ.gif"
                alt="Natalia y Jan - Beso de Amor"
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
          <p className="text-2xl mb-6 text-white/90">7 de Octubre, 2025</p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-champagne"></div>
            <Heart className="w-8 h-8 text-champagne animate-heartbeat" />
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-champagne"></div>
          </div>
          <p className="text-lg opacity-80 mb-4">Con amor, esperamos celebrar junto a ustedes</p>
          <p className="text-sm opacity-60">Este día será aún más especial con tu presencia</p>
        </div>
      </footer>
    </div>
  )
}
