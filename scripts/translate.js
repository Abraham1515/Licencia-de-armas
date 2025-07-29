// scripts/translate.js
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Traduce recursivamente targetObj rellenando cadenas vacías
 * a partir de sourceObj usando el cliente openai.
 */
async function translateObject(sourceObj, targetObj, openai, options, pathPrefix = '') {
  const result = { ...targetObj }

  for (const key of Object.keys(targetObj)) {
    const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key
    const sourceValue = sourceObj[key]
    const targetValue = targetObj[key]

    if (sourceValue === undefined) {
      console.warn(`⚠️  La clave "${currentPath}" no existe en el JSON de origen. Se omite.`)
      continue
    }

    // Si es un objeto, profundiza recursivamente
    if (
      typeof targetValue === 'object' &&
      targetValue !== null &&
      typeof sourceValue === 'object' &&
      sourceValue !== null
    ) {
      result[key] = await translateObject(
        sourceValue,
        targetValue,
        openai,
        options,
        currentPath
      )

    // Si es cadena vacía y hay texto en origen → traducir
    } else if (
      typeof targetValue === 'string' &&
      targetValue.trim() === '' &&
      typeof sourceValue === 'string' &&
      sourceValue.trim() !== ''
    ) {
      let attempts = 0
      const maxAttempts = 5
      let delay = 1000

      while (attempts < maxAttempts) {
        try {
          const completion = await openai.chat.completions.create({
            model: options.model,
            messages: [
              { role: 'system', content: 'Eres un traductor conciso de ES → EN.' },
              { role: 'user', content: `Traduce al inglés: "${sourceValue}"` }
            ]
          })
          const text = completion.choices[0].message.content.trim()
          result[key] = text
          console.log(`✅ ${currentPath} → "${text}"`)
          // espera breve tras éxito
          await sleep(500)
          break
        } catch (err) {
          attempts++
          console.error(
            `❌ Error traduciendo "${currentPath}" (Intento ${attempts}/${maxAttempts}):`,
            err.message
          )
          if (attempts < maxAttempts) {
            console.log(`🕒 Esperando ${delay / 1000}s antes de reintentar…`)
            await sleep(delay)
            delay *= 2
          } else {
            console.error(`🚫 Fallaron todos los intentos para "${currentPath}". Se deja vacío.`)
            result[key] = targetValue
          }
        }
      }

    // Si ya está traducido, saltar
    } else {
      console.log(`⏩ Saltando clave ya traducida: "${currentPath}"`)
    }
  }

  return result
}

async function main() {
  // Rutas de los ficheros
  const esPath = path.resolve('src/i18n/es.json')
  const enPath = path.resolve('src/i18n/en.json')

  console.log('📖 Leyendo archivos JSON…')
  const esRaw = JSON.parse(fs.readFileSync(esPath, 'utf-8'))
  const enRaw = JSON.parse(fs.readFileSync(enPath, 'utf-8'))

  // Si tus archivos llevan clave raíz "es"/"en", la manejamos:
  const esSource = esRaw.es || esRaw
  const enTarget = enRaw.en || enRaw
  const isEnNested = !!enRaw.en

  // Inicializa cliente OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  console.log(`\n🔍 Traduciendo ${Object.keys(enTarget).length} claves…`)
  const translated = await translateObject(
    esSource,
    enTarget,
    openai,
    { model: 'gpt-3.5-turbo' }
  )

  // Reconstruye estructura si estaba anidada
  const finalJSON = isEnNested ? { ...enRaw, en: translated } : translated

  console.log('\n💾 Guardando resultado en', enPath)
  fs.writeFileSync(enPath, JSON.stringify(finalJSON, null, 2), 'utf-8')

  console.log('\n🎉 Traducción completada. Revisa src/i18n/en.json')
}

main().catch(err => {
  console.error('💥 Error en el script:', err)
  process.exit(1)
})
