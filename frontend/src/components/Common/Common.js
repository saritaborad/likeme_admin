import React from 'react'
import {Dropdown} from 'react-bootstrap'
import Arrow from '../../Images/arrow-top.svg'
import {ReactComponent as UpDownArr} from '../../Images/up-down-arrow.svg'

export const StatusFilter = ({selectedItem, handleSelect}) => {
  return (
    <div className='custom-design-dropdwon'>
      <Dropdown>
        <Dropdown.Toggle id='dropdown' className='custom-toggle-button'>
          <UpDownArr />
          {selectedItem}
          <img src={Arrow} alt='arrow' />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleSelect('All')}>All</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSelect('Online')}>Online</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSelect('Offline')}>Offline</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
