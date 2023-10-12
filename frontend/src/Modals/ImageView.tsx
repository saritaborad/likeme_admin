import React from 'react'
import {Modal} from 'react-bootstrap'
import {ImgUrl} from '../const'

interface IPROPS {
  image?: any
  setView?: any
  video?: any
}

const ImageView: React.FC<IPROPS> = ({image, setView, video}) => {
  return (
    <Modal.Body>
      <div className='modal-content'>
        <div className='modal-header'>
          <button type='button' className='btn-close' onClick={() => setView(false)}></button>
        </div>
        <div className='modal-body'>
          {video ? (
            <video controls className='w-100'>
              <source src={ImgUrl + video} />
            </video>
          ) : (
            <img id='imgPreview' src={ImgUrl + image} alt='' className='w-100' />
          )}
        </div>
      </div>
    </Modal.Body>
  )
}

export default ImageView
