import { Platform } from 'react-native'
import * as webRouter from './react-router'
import * as nativeRouter from './react-router.native'

let router: any = nativeRouter

if (Platform.OS === 'web') {
  router = webRouter
}

export default router
