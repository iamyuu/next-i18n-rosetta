import Link from 'next/link'
import {useI18n} from '../lib/i18n'

import fs from 'fs/promises'
import path from 'path'

export async function getServerSideProps(ctx) {
  const lng = ctx.locale

  const rootPath = process.cwd().replace('/next-app', '')
  const localesPath = path.join(rootPath, 'locales')
  const file = await fs.readFile(`${localesPath}/${lng}/index.json`)
  const lngDict = JSON.parse(file.toString())

  return {
    props: {lng, lngDict},
  }
}

// export async function getServerSideProps(ctx) {
//   const lng = ctx.locale
//   const {default: lngDict = {}} = await import(`../../locales/${lng}/index.json`)

//   return {
//     props: {lng, lngDict},
//   }
// }

export default function IndexPage() {
  const i18n = useI18n()

  return (
    <div>
      <h2>{i18n.t('intro.text')}</h2>
      <h3>{i18n.t('dashboard.description')}</h3>

      <Link href='/' locale={i18n.activeLocale === 'en' ? 'de' : 'en'}>
        change lang
      </Link>
    </div>
  )
}
