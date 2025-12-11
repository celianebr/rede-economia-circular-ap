// src/services/firebase.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
} from 'firebase/firestore'
import { auth, db } from '../firebase'

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
    const docRef = doc(db, 'users', uid)
    await setDoc(docRef, profileData, { merge: true })
  },
  async getProfile(uid) {
    const docRef = doc(db, 'users', uid)
    const snap = await getDoc(docRef)
    return snap.exists() ? snap.data() : null
  },
  async searchProfiles(filters) {
    const col = collection(db, 'users')
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
