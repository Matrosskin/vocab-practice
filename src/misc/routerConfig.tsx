import { RouteObject } from 'react-router-dom'
import { VocabPracticeApp } from '../VocabPracticeApp'
import { LoginPage } from '../pages/user/LoginPage/LoginPage'
import { RegistrationPage } from '../pages/user/RegistrationPage/RegistrationPage'
import { VocabPage } from '../pages/VocabPage/VocabPage'

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
            path: 'registration',
            element: <RegistrationPage />
          },
          {
            path: 'vocab',
            element: <VocabPage />
          }
        ]
    },
]
