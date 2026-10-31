"use client"

import { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { fetchMyProfile, touchLastLogin } from "@/lib/db/admin-users"
import { getSetting, subscribeToSetting } from "@/lib/db/settings"
import { AdminUser, UserRole, TabId, ROLE_PERMISSIONS } from "@/lib/permissions"

/**
 * Motivo pelo qual um usuário autenticado não possui perfil administrativo utilizável.
 *   no-profile  — autenticou, mas ninguém provisionou acesso ao painel
 *   disabled    — perfil existe, porém está desativado
 *   unavailable — falha de rede ao ler o perfil (e não havia um perfil anterior)
 */
export type ProfileError = "no-profile" | "disabled" | "unavailable"

interface AuthContextType {
  /** Sessão do Supabase Auth. `null` quando ninguém está logado. */
  user: User | null
  adminUser: AdminUser | null
  role: UserRole | null
  loading: boolean
  profileError: ProfileError | null
  canAccess: (tab: TabId) => boolean
  customPermissions: Record<UserRole, TabId[]>
  /** Busca o perfil de novo — para o botão "Tentar novamente". */
  retryProfile: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminUser: null,
  role: null,
  loading: true,
  profileError: null,
  canAccess: () => false,
  customPermissions: ROLE_PERMISSIONS,
  retryProfile: () => {},
})

/** Espera entre novas tentativas de ler o perfil após falha de rede (ms). */
const RETRY_DELAYS = [2_000, 5_000, 15_000, 30_000, 60_000]

/**
 * Única fonte de sessão do painel. O middleware já garantiu que só chega aqui
 * quem tem sessão; este provider acompanha o que muda depois (logout, troca de
 * usuário, token renovado) e carrega o perfil administrativo.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [profileError, setProfileError] = useState<ProfileError | null>(null)
  const [customPermissions, setCustomPermissions] = useState<Record<UserRole, TabId[]>>(ROLE_PERMISSIONS)
  const [loading, setLoading] = useState(true)

  // Usuário cujo perfil está valendo. Respostas que chegam depois de uma troca
  // de usuário (ou logout) são descartadas comparando com este id.
  const currentUserIdRef = useRef<string | null>(null)
  const hasProfileRef = useRef(false)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryCountRef = useRef(0)

  // Carrega configurações de permissões customizadas do Supabase app_settings em tempo real
  useEffect(() => {
    getSetting<Record<UserRole, TabId[]>>("role_permissions").then((perms) => {
      if (perms) setCustomPermissions(perms)
    })

    const unsubPermissions = subscribeToSetting<Record<UserRole, TabId[]>>(
      "role_permissions",
      (perms) => {
        if (perms) setCustomPermissions(perms)
      }
    )

    return () => unsubPermissions()
  }, [])

  const clearRetry = useCallback(() => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
    retryTimerRef.current = null
  }, [])

  const loadProfile = useCallback(
    async (userId: string) => {
      clearRetry()
      try {
        const profile = await fetchMyProfile(userId)
        if (currentUserIdRef.current !== userId) return

        retryCountRef.current = 0
        if (!profile) {
          hasProfileRef.current = false
          setAdminUser(null)
          setProfileError("no-profile")
        } else if (profile.active === false) {
          hasProfileRef.current = false
          setAdminUser(null)
          setProfileError("disabled")
        } else {
          hasProfileRef.current = true
          setAdminUser(profile)
          setProfileError(null)
        }
      } catch (err) {
        if (currentUserIdRef.current !== userId) return
        console.warn("[AuthContext] Erro ao buscar perfil do admin:", err)

        // Falha de rede não tira o acesso: com um perfil já carregado, o painel
        // segue com ele. Só sem perfil algum é que mostramos "indisponível".
        if (!hasProfileRef.current) setProfileError("unavailable")

        const delay = RETRY_DELAYS[Math.min(retryCountRef.current, RETRY_DELAYS.length - 1)]
        retryCountRef.current += 1
        retryTimerRef.current = setTimeout(() => loadProfile(userId), delay)
      } finally {
        if (currentUserIdRef.current === userId) setLoading(false)
      }
    },
    [clearRetry]
  )

  useEffect(() => {
    // O callback é síncrono de propósito. Chamar o Supabase com `await` aqui
    // dentro trava o cliente (ele segura um lock enquanto notifica); por isso
    // as consultas são agendadas para depois com setTimeout.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null
      const nextId = nextUser?.id ?? null

      if (!nextUser) {
        currentUserIdRef.current = null
        hasProfileRef.current = false
        clearRetry()
        setUser(null)
        setAdminUser(null)
        setProfileError(null)
        setLoading(false)
        // INITIAL_SESSION sem sessão não redireciona: o middleware já cuida da
        // entrada, e um cookie ainda sendo gravado não deve expulsar ninguém.
        if (event === "SIGNED_OUT") router.replace("/login")
        return
      }

      // Renovação de token entrega um objeto User novo para a mesma pessoa.
      // Mantemos o anterior para não disparar efeitos nem rebuscar o perfil.
      if (nextId === currentUserIdRef.current) {
        if (event === "USER_UPDATED") setUser(nextUser)
        return
      }

      currentUserIdRef.current = nextId
      hasProfileRef.current = false
      retryCountRef.current = 0
      setUser(nextUser)
      setAdminUser(null)
      setProfileError(null)
      setLoading(true)

      setTimeout(() => {
        if (event === "SIGNED_IN") touchLastLogin(nextUser.id)
        loadProfile(nextUser.id)
      }, 0)
    })

    // Voltar a ter rede (ou voltar para a aba) tenta de novo na hora, sem
    // esperar o próximo intervalo de nova tentativa.
    const retryNow = () => {
      const id = currentUserIdRef.current
      if (id && retryTimerRef.current) loadProfile(id)
    }
    const onVisible = () => {
      if (document.visibilityState === "visible") retryNow()
    }
    window.addEventListener("online", retryNow)
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      subscription.unsubscribe()
      clearRetry()
      window.removeEventListener("online", retryNow)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [router, loadProfile, clearRetry])

  const retryProfile = useCallback(() => {
    const id = currentUserIdRef.current
    if (!id) return
    retryCountRef.current = 0
    setLoading(true)
    loadProfile(id)
  }, [loadProfile])

  // Memoizado: consumidores usam `canAccess` em arrays de dependência de efeitos.
  const checkAccess = useCallback(
    (tab: TabId): boolean => {
      if (!adminUser || !adminUser.active) return false
      // Super admin sempre tem acesso total
      if (adminUser.role === "super_admin") return true

      const permissions = customPermissions[adminUser.role] || ROLE_PERMISSIONS[adminUser.role]
      return permissions?.includes(tab) ?? false
    },
    [adminUser, customPermissions]
  )

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      adminUser,
      role: adminUser?.role ?? null,
      loading,
      profileError,
      canAccess: checkAccess,
      customPermissions,
      retryProfile,
    }),
    [user, adminUser, loading, profileError, checkAccess, customPermissions, retryProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
