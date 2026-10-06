export const SAVED_CARS_STORAGE_KEY = 'car-marketplace:saved-cars'
const CAR_ID_PATTERN = /^car-\d{3}$/

function readStoredIds() {
  try {
    const stored = window.localStorage.getItem(SAVED_CARS_STORAGE_KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []

    return [...new Set(parsed.filter((id) => typeof id === 'string' && CAR_ID_PATTERN.test(id)))]
  } catch {
    return []
  }
}

function writeStoredIds(ids) {
  try {
    window.localStorage.setItem(SAVED_CARS_STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Saved state still works for the current session if storage is unavailable.
  }
  return ids
}

export function getSavedCarIds() {
  return readStoredIds()
}

export function isCarSaved(carId) {
  return typeof carId === 'string' && readStoredIds().includes(carId)
}

export function saveCar(carId) {
  if (typeof carId !== 'string' || !CAR_ID_PATTERN.test(carId)) return readStoredIds()
  const ids = readStoredIds()
  return ids.includes(carId) ? ids : writeStoredIds([...ids, carId])
}

export function removeSavedCar(carId) {
  if (typeof carId !== 'string') return readStoredIds()
  return writeStoredIds(readStoredIds().filter((id) => id !== carId))
}

export function toggleSavedCar(carId) {
  return isCarSaved(carId) ? removeSavedCar(carId) : saveCar(carId)
}

export function clearSavedCars() {
  try {
    window.localStorage.removeItem(SAVED_CARS_STORAGE_KEY)
  } catch {
    // Clearing is best-effort when storage is unavailable.
  }
  return []
}