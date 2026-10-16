// src/services/firestoreService.js
import { db } from "./firebase"; // 👈 ajusta o caminho (estava "../firebase")
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

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

// Exclui o cadastro/perfil (documento no Firestore)
export async function excluirPerfil(usuarioId) {
  await deleteDoc(doc(db, "users", usuarioId));
}

// ---------- Matchmaking: demonstrações de interesse em contato ----------

// Registra que um agente (deId) demonstrou interesse em contato com outro (paraId)
export async function enviarInteresse({ deId, deNome, paraId, paraNome, mensagem }) {
  const ref = await addDoc(collection(db, "interesses"), {
    deId,
    deNome: deNome || "Agente",
    paraId,
    paraNome: paraNome || "Agente",
    mensagem: mensagem || "",
    lido: false,
    criadoEm: new Date().toISOString(),
  });
  return ref.id;
}

// Busca os interesses recebidos por um agente (do mais recente para o mais antigo).
// A ordenação é feita aqui no código para não exigir índice composto no Firestore.
export async function buscarInteressesRecebidos(usuarioId) {
  const q = query(collection(db, "interesses"), where("paraId", "==", usuarioId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""));
}

// Marca um interesse recebido como lido
export async function marcarInteresseLido(interesseId) {
  await updateDoc(doc(db, "interesses", interesseId), { lido: true });
}
