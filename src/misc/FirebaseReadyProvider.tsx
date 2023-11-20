import { connectAuthEmulator, getAuth, onAuthStateChanged } from 'firebase/auth'
import { connectDatabaseEmulator, getDatabase } from 'firebase/database'
import { PropsWithChildren, useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './firebaseConfig'
import { useAppDispatch } from '../hooks/store'
import { setDetermined, setUser } from '../slices/userSlice'

export function FirebaseReadyProvider({ children }: PropsWithChildren) {
  const [isFirebaseReady, setFirebaseReadyState] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    initializeApp(firebaseConfig)

    function whenFBReady() {
      setFirebaseReadyState(true)

      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {
        dispatch(setDetermined())
        dispatch(
          setUser(
            user
              ? {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                }
              : null
          )
        )
      })
    }

    if (process.env.NODE_ENV !== 'production') {
      // NOTE: Next hacks required to make firebase emulators workable over wepback proxy.
      // So I can share only react app instance (port) without separate sharing of firebase services.
      // For instance during developing in onlide ide (https://vscode.dev) each port has own tunnel name (domain name),
      // so it is impossible to use them without hacks.
      const auth = getAuth()
      connectAuthEmulator(auth, `${window.location.protocol}//${window.location.host}`, { disableWarnings: true })
      ;(auth.config as any).emulator.url += 'vp-auth/'

      const db = getDatabase()
      connectDatabaseEmulator(db, window.location.host, 80) // Here any port will be fine, because it will be rewriten.
      const repo = (db as any)._repoInternal
      const repoInfo = repo.repoInfo_
      repoInfo._host = `${window.location.host}/vp-database`
      repoInfo._domain = 'localhost'
      repoInfo.internalHost = repoInfo._host // Looks like this field (internalHost) used in requests to db.
      repoInfo.secure = 'https:' === window.location.protocol
    }
    whenFBReady()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isFirebaseReady ? <>{children}</> : null
}
