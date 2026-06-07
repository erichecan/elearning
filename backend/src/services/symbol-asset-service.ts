type SymbolRowLike = {
  image_url?: string | null
  symbol_provider?: string | null
  symbol_key?: string | null
  usage_pack?: string | null
  symbol_cdn_url?: string | null
  symbol_local_path?: string | null
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

function buildFallbackSymbolUrl(provider?: string | null, symbolKey?: string | null) {
  if (!provider || !symbolKey) return null
  if (provider !== 'arasaac') return null
  const baseUrl = normalizeBaseUrl(
    process.env.BACKEND_PUBLIC_BASE_URL || `http://127.0.0.1:${process.env.PORT || '3001'}`
  )
  return `${baseUrl}/symbols/arasaac/raw/${encodeURIComponent(symbolKey)}`
}

function buildPackSymbolUrl(provider?: string | null, pack?: string | null, symbolKey?: string | null) {
  if (!provider || !pack || !symbolKey) return null
  if (provider !== 'arasaac') return null
  const version = process.env.SYMBOL_PACK_VERSION || 'v1'
  const baseUrl = normalizeBaseUrl(
    process.env.BACKEND_PUBLIC_BASE_URL || `http://127.0.0.1:${process.env.PORT || '3001'}`
  )
  return `${baseUrl}/symbols/arasaac/${encodeURIComponent(version)}/${encodeURIComponent(pack)}/${encodeURIComponent(symbolKey)}`
}

export const symbolAssetService = {
  resolveImageUrl(row: SymbolRowLike) {
    if (row.image_url) return row.image_url
    const packUrl = buildPackSymbolUrl(row.symbol_provider, row.usage_pack, row.symbol_key)
    if (packUrl) return packUrl
    if (row.symbol_cdn_url) return row.symbol_cdn_url
    if (row.symbol_local_path) {
      const baseUrl = normalizeBaseUrl(
        process.env.BACKEND_PUBLIC_BASE_URL || `http://127.0.0.1:${process.env.PORT || '3001'}`
      )
      const localPath = row.symbol_local_path.startsWith('/') ? row.symbol_local_path : `/${row.symbol_local_path}`
      return `${baseUrl}${localPath}`
    }
    return buildFallbackSymbolUrl(row.symbol_provider, row.symbol_key)
  }
}
