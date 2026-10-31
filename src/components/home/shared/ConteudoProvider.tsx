"use client"

import { createContext, useContext, type ReactNode } from "react"
import { navegacao } from "@/config/home-content"
import { itemDoPerfil, resolverConteudo, type ConteudoResolvido } from "@/lib/conteudo-tipos"

const Contexto = createContext<ConteudoResolvido>(resolverConteudo(null))

/**
 * Entrega a todo o site os textos deste cliente (lidos no servidor pelo
 * layout raiz). Sem provedor, valem os padrões da vertical.
 */
export function ConteudoProvider({ conteudo, children }: { conteudo: ConteudoResolvido; children: ReactNode }) {
  return <Contexto.Provider value={conteudo}>{children}</Contexto.Provider>
}

/** Textos da home/site do cliente. */
export function useHome() {
  return useContext(Contexto).home
}

/** Dados da página do profissional. */
export function usePerfil() {
  return useContext(Contexto).perfil
}

/** Itens do menu e do rodapé, incluindo a página do profissional. */
export function useNavegacao() {
  const { home, perfil } = useContext(Contexto)
  return navegacao(home, itemDoPerfil(perfil))
}
