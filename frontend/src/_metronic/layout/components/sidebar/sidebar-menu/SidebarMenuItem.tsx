import {FC} from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {checkIsActive, WithChildren} from '../../../../helpers'
import {useLayout} from '../../../core'

type Props = {
  to: string
  state?: any
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
}

const SidebarMenuItem: FC<Props & WithChildren> = ({children, to, title, icon, fontIcon, hasBullet = false}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)
  const {config} = useLayout()
  const {app} = config

  return (
    <div className='menu-item pb-4'>
      <Link className={clsx('menu-link without-sub', {active: isActive})} to={to}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
          <span className='menu-icon'>
            <i className={icon} aria-hidden='true'></i>
          </span>
        )}
        {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && <i className={clsx('bi fs-3', fontIcon)}></i>}
        <span className='menu-title fs-4'>{title}</span>
      </Link>
      {children}
    </div>
  )
}

export {SidebarMenuItem}
