import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Dropdown, MenuProps } from "antd"
import { useAppSelector } from "../../hooks/store"
import { useMemo } from "react"
import { insertAIf } from "../../utils/insertAIf"
import { ItemType } from "antd/es/menu/hooks/useItems"
import { Link, useLocation } from "react-router-dom"

export const HeaderDropdownMenu = () => {
  const user = useAppSelector((state) => state.user.user)
  const location = useLocation()

  const menuItems = useMemo((): MenuProps['items'] => {
    return [
      ...insertAIf<ItemType>(
        Boolean(user),
        {
          key: 'vocabs',
          type: 'group',
          label: 'Your vocabs:',
          children: [
            {
              key: 'vocab 1',
              label: 'Vocab 1',
            },
            {
              key: 'vocab 2',
              label: 'Vocab 2',
            },
          ]
        },
        {
          key: 'createVocab',
          label: (
            // TODO: It seems it would be better to move this item into settings page or so.
            <Link to={`/create-vocab`}>Create vocab</Link>
          ),
        },
        {
          type: 'divider'
        },
        {
          key: 'logout',
          label: (
            <Link to={`/logout`}>Logout</Link>
          ),
        }
      ),
      ...insertAIf<ItemType>(
        '/login' === location.pathname,
        {
          key: 'registration',
          label: (
            <Link to={`/registration`}>Registration</Link>
          ),
        }
      ),
      ...insertAIf<ItemType>(
        ['/registration', '/logout'].includes(location.pathname),
        {
          key: 'login',
          label: (
            <Link to={`/login`}>Login</Link>
          ),
        }
      )
    ]
  }, [location.pathname, user])

  return <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
    <Button icon={<FontAwesomeIcon icon={faBars} />} />
  </Dropdown>
}
