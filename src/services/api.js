import { firebaseService } from './firebase'
import { mockService } from './mockService'
export const USE_FIREBASE = true
export const api = USE_FIREBASE ? firebaseService : mockService
