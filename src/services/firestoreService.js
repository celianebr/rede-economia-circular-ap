// src/services/firestoreService.js
import { db } from "./firebase"; // 👈 ajusta o caminho (estava "../firebase")
import { doc, setDoc, getDoc } from "firebase/firestore";

// Salva (cria ou atualiza) o perfil
export async function salvarPerfil(usuarioId, dados) {
  await setDoc(doc(db, "users", usuarioId), dados, { merge: true });
}

// Busca um perfil
export async function buscarPerfil(usuarioId) {
  const ref = doc(db, "users", usuarioId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}
