const KEY_USERS = 'eco_mock_users'
const KEY_SESSION = 'eco_mock_session'
function _loadUsers(){ return JSON.parse(localStorage.getItem(KEY_USERS) || '{}') }
function _saveUsers(users){ localStorage.setItem(KEY_USERS, JSON.stringify(users)) }

export const mockService = {
  async signup(email, password){
    const users = _loadUsers()
    if(users[email]) throw new Error('E-mail já cadastrado')
    users[email] = { email, password, profile: { name: '', email, interesses: [] } }
    _saveUsers(users)
    localStorage.setItem(KEY_SESSION, email)
    return { email }
  },
  async login(email, password){
    const users = _loadUsers()
    if(!users[email] || users[email].password !== password) throw new Error('Credenciais inválidas')
    localStorage.setItem(KEY_SESSION, email)
    return { email }
  },
  async logout(){ localStorage.removeItem(KEY_SESSION) },
  onAuthChange(cb){
    const email = localStorage.getItem(KEY_SESSION)
    setTimeout(()=> cb(email ? { email } : null), 0)
    return () => {}
  },
  async saveProfile(uidOrEmail, profileData){
    const users = _loadUsers()
    if(!users[uidOrEmail]) users[uidOrEmail] = { email: uidOrEmail, password: '', profile: profileData }
    else users[uidOrEmail].profile = { ...users[uidOrEmail].profile, ...profileData }
    _saveUsers(users)
  },
  async getProfile(uidOrEmail){
    const users = _loadUsers()
    return users[uidOrEmail] ? users[uidOrEmail].profile : null
  },
  async searchProfiles(filters){
    const users = _loadUsers()
    const arr = Object.values(users).map(u => u.profile || {})
    return arr.filter(p => {
      if(filters.municipio && (!p.municipio || p.municipio.toLowerCase() !== filters.municipio.toLowerCase())) return false
      if(filters.materiais && filters.materiais.length){
        const has = (p.interesses || []).some(i => filters.materiais.includes(i))
        if(!has) return false
      }
      return true
    })
  },
  getCurrentUser(){ const email = localStorage.getItem(KEY_SESSION); return email ? { email } : null }
}
