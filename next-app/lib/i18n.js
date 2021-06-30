import {createContext, useContext, useState, useRef, useEffect} from 'react'
import rosetta from 'rosetta/debug'
import nextConfig from '../next.config'

const {i18n: i18nConfig} = nextConfig

const i18n = rosetta()

export const I18nContext = createContext(undefined)

// default language
i18n.locale(i18nConfig.defaultLocale)

export function useI18n() {
  const i18n = useContext(I18nContext)
  return i18n
}

export default function I18nProvider({children, locale, lngDict}) {
  const activeLocaleRef = useRef(locale || i18nConfig.defaultLocale)
  const [, setTick] = useState(0)
  const firstRender = useRef(true)

  const i18nWrapper = {
    activeLocale: activeLocaleRef.current,
    t: (...args) => i18n.t(...args),
    locale: (l, dict) => {
      i18n.locale(l)
      activeLocaleRef.current = l
      if (dict) {
        i18n.set(l, dict)
      }
      // force rerender to update view
      setTick(tick => tick + 1)
    },
  }

  // for initial SSR render
  if (locale && firstRender.current === true) {
    firstRender.current = false
    i18nWrapper.locale(locale, lngDict)
  }

  // when locale is updated
  useEffect(() => {
    if (locale) {
      i18nWrapper.locale(locale, lngDict)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lngDict, locale])

  return <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>
}
