import React, {useState} from 'react'

interface IPROPS {
  submitFormData?: any
  appModalClose?: any
}

const AddCoin: React.FC<IPROPS> = ({submitFormData, appModalClose}) => {
  const [formData, setFormData] = useState({diamond: 0})

  const handleChange = (e: any) => setFormData({...formData, [e.target.name]: e.target.value})

  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2 className='modal-title' id='add-notification-admin'>
            Add Coin
          </h2>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitFormData(formData)
            }}
          >
            <input type='hidden' name='_token' defaultValue='rSzVE84ohSmbIpBmRJyv7PY87LeWi5RLSLSDfw6G' />{' '}
            <div className='form-group'>
              <label>Coin To Add</label>
              <input type='number' name='diamond' defaultValue={0} id='title-coin' className='form-control mt-3' value={formData.diamond} required onChange={handleChange} />
            </div>
            <button type='submit' className='btn-comn-submit mt-8'>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddCoin
