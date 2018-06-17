import en from './en.json'
import ja from './ja.json'
import esMomentLocale from 'moment/locale/es'
import jaMomentLocale from 'moment/locale/ja'
import jaElLocale from 'element-ui/lib/locale/lang/ja'
import enElLocale from 'element-ui/lib/locale/lang/en'
import jaVeeLocale from 'vee-validate/dist/locale/ja'
import enVeeLocale from 'vee-validate/dist/locale/en'
import { Validator } from 'vee-validate'

Object.assign(jaVeeLocale.attributes, ja.attributes)
Object.assign(enVeeLocale.attributes, en.attributes)
Validator.localize('ja', jaVeeLocale)
Validator.localize('en', enVeeLocale)

export default {
  en: Object.assign({}, en, esMomentLocale, enElLocale, enVeeLocale),
  ja: Object.assign({}, ja, jaMomentLocale, jaElLocale, jaVeeLocale)
}
