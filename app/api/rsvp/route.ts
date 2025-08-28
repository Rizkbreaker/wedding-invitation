import { NextRequest, NextResponse } from 'next/server'

// Rate limiting storage (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

// Simple rate limiting: max 5 requests per 5 minutes per IP
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 5 * 60 * 1000 // 5 minutes
  const maxRequests = 5

  const current = rateLimit.get(ip)
  
  if (!current || now > current.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

// Input sanitization
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500) // Limit length
}

// Validation schema
interface RSVPData {
  Fecha: string
  Nombre: string
  Invitados: string
  Mensaje: string
  Asiste_Civil: string
  Asiste_Almuerzo: string
  Limitaciones_Gastronomicas: string
}

function validateRSVPData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.Nombre || typeof data.Nombre !== 'string' || data.Nombre.trim().length < 2) {
    errors.push('Nombre es requerido y debe tener al menos 2 caracteres')
  }
  
  if (!data.Invitados || isNaN(Number(data.Invitados)) || Number(data.Invitados) < 1 || Number(data.Invitados) > 10) {
    errors.push('Número de invitados debe ser entre 1 y 10')
  }
  
  if (data.Mensaje && typeof data.Mensaje === 'string' && data.Mensaje.length > 500) {
    errors.push('El mensaje no puede exceder 500 caracteres')
  }
  
  // Validate event selection - at least one event must be selected
  if (!data.attendCivil && !data.attendLunch) {
    errors.push('Debes seleccionar al menos un evento')
  }
  
  // Validate dietary restrictions if attending lunch
  if (data.attendLunch && data.dietaryRestrictions !== 'none' && 
      ['allergies', 'other'].includes(data.dietaryRestrictions) && 
      (!data.dietaryDetails || data.dietaryDetails.trim().length === 0)) {
    errors.push('Debes especificar detalles de las limitaciones gastronómicas')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor intenta en unos minutos.' },
        { status: 429 }
      )
    }
    
    // Parse request body
    const body = await request.json()
    
    // Validate input
    const validation = validateRSVPData(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.errors },
        { status: 400 }
      )
    }
    
    // Format dietary restrictions for Google Sheets
    const formatDietaryRestrictions = (attendLunch: boolean, dietaryRestrictions: string, dietaryDetails: string) => {
      if (!attendLunch) return 'No aplica (no asiste al almuerzo)'
      if (dietaryRestrictions === 'none') return 'Sin limitaciones'
      
      const dietaryLabels: { [key: string]: string } = {
        'vegetarian': 'Vegetariano',
        'vegan': 'Vegano',
        'gluten_free': 'Sin gluten (celíaco)',
        'lactose_free': 'Sin lactosa',
        'allergies': 'Alergias alimentarias',
        'other': 'Otras limitaciones'
      }
      
      const label = dietaryLabels[dietaryRestrictions] || dietaryRestrictions
      return dietaryDetails ? `${label}: ${dietaryDetails}` : label
    }

    // Sanitize inputs
    const sanitizedData: RSVPData = {
      Fecha: new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      Nombre: sanitizeInput(body.Nombre),
      Invitados: String(Number(body.Invitados)), // Ensure it's a valid number
      Mensaje: body.Mensaje ? sanitizeInput(body.Mensaje) : 'Sin mensaje',
      Asiste_Civil: body.attendCivil ? 'Sí' : 'No',
      Asiste_Almuerzo: body.attendLunch ? 'Sí' : 'No',
      Limitaciones_Gastronomicas: formatDietaryRestrictions(
        body.attendLunch, 
        body.dietaryRestrictions || 'none', 
        body.dietaryDetails ? sanitizeInput(body.dietaryDetails) : ''
      )
    }
    
    // Get SheetDB URL from environment variable
    const sheetDbUrl = process.env.SHEETDB_API_URL
    if (!sheetDbUrl) {
      console.error('SHEETDB_API_URL environment variable not set')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }
    
    // Send to Google Sheets via SheetDB
    const response = await fetch(sheetDbUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedData)
    })
    
    if (!response.ok) {
      throw new Error(`SheetDB API error: ${response.status}`)
    }
    
    // Success response
    return NextResponse.json({
      success: true,
      message: 'RSVP enviado exitosamente',
      data: {
        nombre: sanitizedData.Nombre,
        invitados: sanitizedData.Invitados
      }
    })
    
  } catch (error) {
    console.error('RSVP API Error:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor intenta nuevamente.' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'RSVP API'
  })
}
