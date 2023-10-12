import {Formik} from 'formik'
import React, {useRef} from 'react'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'

interface IPROPS {
  update?: any
  countryDetail?: any
  submitFormData?: any
  updateCountry?: any
  appModalClose?: any
}

const AddCountry: React.FC<IPROPS> = ({submitFormData, update, countryDetail, updateCountry, appModalClose}) => {
  const agentRef = useRef(null)

  return (
    <div className='modal-content'>
      <div className='modal-header'>
        <h4 className='modal-title' id='edit-one'>
          {update ? 'Edit Country ' : 'Add Country '}
        </h4>
        <button type='button' className='btn-close' onClick={appModalClose}></button>
      </div>
      <div className='modal-body'>
        <Formik
          innerRef={agentRef}
          enableReinitialize
          initialValues={{
            _id: countryDetail && countryDetail?._id,
            country_name: countryDetail?.country_name || '',
          }}
          validationSchema={Yup.object({
            country_name: Yup.string().required('required.'),
          })}
          onSubmit={(formData, {resetForm}) => {
            update ? updateCountry(formData) : submitFormData(formData)
          }}
        >
          {(runform) => (
            <form method='post' onSubmit={runform.handleSubmit}>
              <input type='hidden' name='_token' defaultValue='iybw3ylRTQ7mpkUJxg9ahYBTvpDuoS2XgBfoY6U8' /> <input id='countryId' name='id' className='form-control' type='hidden' defaultValue={16} />
              <div className='form-group mt-2'>
                <label>Country Name</label>
                <input type='text' className='form-control mt-3' required name='country_name' {...formAttr(runform, 'country_name')} />
                {errorContainer(runform, 'country_name')}
              </div>
              <button type='submit' className='btn-comn-submit mt-5'>
                Submit
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddCountry
