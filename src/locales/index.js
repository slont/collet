import en from './en.json'
import ja from './ja.json'
import jaLocale from 'element-ui/lib/locale/lang/ja'
import enLocale from 'element-ui/lib/locale/lang/en'

export default {
  en: Object.assign({}, en, enLocale),
  ja: Object.assign({}, ja, jaLocale)
}
