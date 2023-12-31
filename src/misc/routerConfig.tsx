import { RouteObject } from 'react-router-dom'
import { VocabPracticeApp } from '../VocabPracticeApp'
import { LoginPage } from '../pages/user/LoginPage/LoginPage'
import { RegistrationPage } from '../pages/user/RegistrationPage/RegistrationPage'
import { VocabPage } from '../pages/VocabPage/VocabPage'
import { LogoutPage } from '../pages/user/LogoutPage/LogoutPage'
import { SettingsPage } from '../pages/settings/SettingsPage/SettingsPage'
import { ManageVocabsPage } from '../pages/settings/ManageVocabsPage/ManageVocabsPage'
import { EditRecord } from '../pages/EditRecord/EditRecord'
import { RandomCardPage } from '../pages/practicing/RandomCardPage/RandomCardPage'
import { BuildWordPage } from '../pages/practicing/BuildWordPage/BuildWordPage'

export const routerConfig: RouteObject[] = [
  {
    path: '/',
    element: <VocabPracticeApp />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'logout',
        element: <LogoutPage />,
      },
      {
        path: 'registration',
        element: <RegistrationPage />,
      },
      {
        path: 'vocab',
        children: [
          {
            path: '',
            element: <VocabPage />,
          },
          {
            path: ':vocabId',
            element: <VocabPage />,
          },
          {
            path: ':vocabId/new-word',
            element: <EditRecord />,
          },
          {
            path: ':vocabId/:recordId',
            element: <EditRecord />,
          },
        ],
      },
      {
        path: 'practicing',
        children: [
          {
            path: 'random-card/:vocabId',
            element: <RandomCardPage />,
          },
          {
            path: 'build-word/:vocabId',
            element: <BuildWordPage />,
          },
        ],
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            element: <SettingsPage />,
          },
          {
            path: 'vocabs',
            element: <ManageVocabsPage />,
          },
        ],
      },
    ],
  },
]
