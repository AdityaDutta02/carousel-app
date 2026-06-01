import { callGateway } from './terminal-ai'

const QUERY_TEMPLATES: Record<string, string> = {
  numbers: '{topic} exact statistics numbers data 2024 2025',
  contrast: '{topic} common misconception myth debunked what people get wrong',
  failure: '{topic} biggest failure loss scandal mistake shocking',
  insider: '{topic} what nobody tells you insider truth hidden reality',
}

async function search(query: string, embedToken: string): Promise<string> {
  const result = await callGateway(
    [{ role: 'user', content: query }],
    embedToken,
    { category: 'web_search', tier: 'good' },
  )
  return result.content
}

export async function researchTopic(topic: string, embedToken: string, sourceUrl?: string): Promise<string> {
  const interpolate = (t: string) => t.replace(/\{topic\}/g, topic)
  const keys = Object.keys(QUERY_TEMPLATES)

  // Serialize searches to avoid simultaneous 429s from the gateway
  const webResults: string[] = []
  for (const k of keys) {
    webResults.push(await search(interpolate(QUERY_TEMPLATES[k]), embedToken))
  }

  const primarySource = sourceUrl
    ? await search(`Read and summarize all key data, statistics, and claims from this URL: ${sourceUrl}`, embedToken)
    : null

  const web = keys.map((k, i) => `=== ${k.toUpperCase()} ===\n${webResults[i]}`).join('\n\n')
  return primarySource ? `=== PRIMARY SOURCE (user-provided) ===\n${primarySource}\n\n${web}` : web
}
