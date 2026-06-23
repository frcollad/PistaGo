import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [state, setState] = useState({ loading: true, error: null, coords: null })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: 'Tu navegador no soporta geolocalización', coords: null })
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setState({ loading: false, error: null, coords: { lat: coords.latitude, lng: coords.longitude } }),
      () => setState({ loading: false, error: 'Permiso de ubicación denegado', coords: null }),
      { enableHighAccuracy: false, timeout: 8000 }
    )
  }, [])

  return state
}
