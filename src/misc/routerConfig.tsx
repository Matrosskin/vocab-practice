import { RouteObject } from 'react-router-dom'
import { VocabPracticeApp } from '../VocabPracticeApp'
import { LoginPage } from '../pages/user/LoginPage/LoginPage'
import { RegistrationPage } from '../pages/user/RegistrationPage/RegistrationPage'
import { VocabPage } from '../pages/VocabPage/VocabPage'
import { LogoutPage } from "../pages/user/LogoutPage/LogoutPage"
import { SettingsPage } from '../pages/settings/SettingsPage/SettingsPage'
import { ManageVocabsPage } from '../pages/settings/ManageVocabsPage/ManageVocabsPage'

export const routerConfig: RouteObject[] = [
    {
        path: '/',
        element: <VocabPracticeApp />,
        children: [
          {
            path: 'login',
            element: <LoginPage />
          },
          {
            path: 'logout',
            element: <LogoutPage />
          },
          {
            path: 'registration',
            element: <RegistrationPage />
          },
          {
            path: 'vocab',
            element: <VocabPage />
          },
          {
            path: 'vocab/:vocabId',
            element: <VocabPage />
          },
          {
            path: 'settings',
            children: [
              {
                path: '',
                element: <SettingsPage />
              },
              {
                path: 'vocabs',
                element: <ManageVocabsPage />
              },
            ]
          }
        ]
    },
]
