import { GoogleGenerativeAI } from '@google/generative-ai'

export type StoryPage = {
  text_en: string
  text_zh: string
  image_prompt: string
}

export type StorybookResult = {
  title: string
  pages: StoryPage[]
}

const fallbackStory: StorybookResult = {
  title: 'A Sunny Day',
  pages: [
    { text_en: 'Luna wakes up and smiles.', text_zh: '露娜醒来并微笑。', image_prompt: 'a happy child waking up in a cozy bedroom, soft morning light' },
    { text_en: 'She says hello to her family.', text_zh: '她向家人打招呼。', image_prompt: 'a child waving to family at breakfast table, warm and friendly' },
    { text_en: 'They walk to the park together.', text_zh: '他们一起去公园散步。', image_prompt: 'family walking in a sunny park, trees and playground' },
    { text_en: 'Luna plays on the slide.', text_zh: '露娜在滑梯上玩。', image_prompt: 'child playing on a playground slide, bright colors' },
    { text_en: 'Everyone shares a picnic.', text_zh: '大家一起野餐。', image_prompt: 'family picnic on a blanket with simple food, sunny day' },
    { text_en: 'Luna feels calm and happy.', text_zh: '露娜感到平静和开心。', image_prompt: 'child resting under a tree, peaceful and happy' }
  ]
}

export const storybookGeneratorService = {
  async generateStory(topic: string, pageCount: number = 6): Promise<StorybookResult> {
    if (!process.env.GOOGLE_API_KEY) {
      return fallbackStory
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

    const prompt = `
You are an expert storyteller for young children.
Create a short storybook based on the topic: "${topic}".
Return STRICT JSON with keys: "title" and "pages".
"pages" is an array of ${pageCount} objects. Each object has:
- "text_en": a short, simple English sentence.
- "text_zh": the Chinese translation.
- "image_prompt": a brief prompt to generate a child-friendly illustration.
No markdown, no code fences.
Example:
{
  "title": "My Happy Morning",
  "pages": [
    {"text_en":"I wake up.","text_zh":"我醒来了。","image_prompt":"child waking up in bed"}
  ]
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim()

    let data: any
    try {
      data = JSON.parse(text)
    } catch (error) {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0])
      }
    }

    if (!data || !Array.isArray(data.pages)) {
      return fallbackStory
    }

    const pages = data.pages.slice(0, pageCount).map((page: any) => ({
      text_en: String(page.text_en || ''),
      text_zh: String(page.text_zh || ''),
      image_prompt: String(page.image_prompt || '')
    }))

    return {
      title: String(data.title || 'Untitled Story'),
      pages
    }
  }
}
