import fs from 'fs'
import path from 'path'

type PackManifest = {
  provider?: string
  pack?: string
  version?: string
  generated_at?: string
  total_items?: number
}

type SymbolPackSummary = {
  pack: string
  provider: string
  latest_version: string | null
  versions: string[]
  total_items: number | null
  generated_at: string | null
  manifest_url: string
}

function getManifestDir(provider: string) {
  return path.resolve(__dirname, `../../public/symbols/${provider}/manifest`)
}

function safeReadJson(filePath: string): PackManifest | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as PackManifest
  } catch {
    return null
  }
}

function parseVersionFromFile(fileName: string) {
  const match = fileName.match(/^[^.]+\.(v[^.]+)\.json$/)
  return match ? match[1] : null
}

export const symbolPackService = {
  listPacks(provider = 'arasaac') {
    const manifestDir = getManifestDir(provider)
    if (!fs.existsSync(manifestDir)) {
      return { provider, packs: [] as SymbolPackSummary[] }
    }

    const files = fs.readdirSync(manifestDir).filter((f) => f.endsWith('.json'))
    const latestFiles = files.filter((f) => f.endsWith('.latest.json')).sort()

    const packs = latestFiles
      .map((latestFile) => {
        const packName = latestFile.replace('.latest.json', '')
        const latestPath = path.join(manifestDir, latestFile)
        const latest = safeReadJson(latestPath)
        if (!latest) return null

        const versions = files
          .filter((file) => file.startsWith(`${packName}.v`) && file.endsWith('.json'))
          .map((file) => parseVersionFromFile(file))
          .filter((version): version is string => Boolean(version))
          .sort()

        return {
          pack: packName,
          provider: latest.provider || provider,
          latest_version: latest.version || null,
          versions,
          total_items: typeof latest.total_items === 'number' ? latest.total_items : null,
          generated_at: latest.generated_at || null,
          manifest_url: `/symbols/${provider}/manifest/${latestFile}`
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))

    return { provider, packs }
  }
}
