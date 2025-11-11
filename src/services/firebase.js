// src/services/firebase.js
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyABEc1vdWHGav3k5XL3ZFp9WqbO21yjOw0",
  authDomain: "agentes-amapa.firebaseapp.com",
  projectId: "agentes-amapa",
  storageBucket: "agentes-amapa.firebasestorage.app",
  messagingSenderId: "237940639605",
  appId: "1:237940639605:web:766b6b92db969eeb77753c",
  measurementId: "G-1B4EVVZ0TF"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export const firebaseService = {
  async signup(email, password) {
    const userCred = await createUserWithEmailAndPassword(auth, email, password)
    return userCred.user
  },
  async login(email, password) {
    const userCred = await signInWithEmailAndPassword(auth, email, password)
    return userCred.user
  },
  async logout() {
    return signOut(auth)
  },
  onAuthChange(cb) {
    return onAuthStateChanged(auth, cb)
  },
  async saveProfile(uid, profileData) {
    const docRef = doc(db, 'profiles', uid)
    await setDoc(docRef, profileData, { merge: true })
  },
  async getProfile(uid) {
    const docRef = doc(db, 'profiles', uid)
    const snap = await getDoc(docRef)
    return snap.exists() ? snap.data() : null
  },
  async searchProfiles(filters) {
    const col = collection(db, 'profiles')
    const snaps = await getDocs(col)
    const results = []
    snaps.forEach(d => results.push({ id: d.id, ...d.data() }))
    return results.filter(p => {
      if (filters.municipio && (!p.municipio || p.municipio.toLowerCase() !== filters.municipio.toLowerCase())) return false
      if (filters.materiais && filters.materiais.length) {
        const has = (p.interesses || []).some(i => filters.materiais.includes(i))
        if (!has) return false
      }
      return true
    })
  },
  getCurrentUser() {
    return auth.currentUser
  }
}

export { auth, db }
