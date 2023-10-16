import {Formik} from 'formik'
import React from 'react'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'

interface IPROPS {
  update?: any
  coinPlan?: any
  submitFormData?: any
  updateCoinPlan?: any
  appModalClose?: any
}

const CoinPlanModal: React.FC<IPROPS> = ({update, coinPlan, submitFormData, updateCoinPlan, appModalClose}) => {
  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2 className='modal-title' id='edit-one'>
            {update ? 'Edit Coin Plan' : 'Add Coin Plan'}
          </h2>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <Formik
            enableReinitialize
            initialValues={{
              _id: coinPlan && coinPlan?._id,
              orignal_sku: coinPlan?.orignal_sku || '',
              play_store_id: coinPlan?.play_store_id || '',
              app_store_id: coinPlan?.app_store_id || '',
              diamond: coinPlan?.diamond || 0,
              discount_price: coinPlan?.discount_price || 0,
              price: coinPlan?.price || 0,
              highlight_text: coinPlan?.highlight_text || '',
            }}
            validationSchema={Yup.object({
              orignal_sku: Yup.string().required('required.'),
              play_store_id: Yup.string().required('required.'),
              app_store_id: Yup.string().required('required.'),
              diamond: Yup.number().required('required.'),
              discount_price: Yup.number().required('required.'),
              price: Yup.number().required('required.'),
              highlight_text: Yup.string().required('required.'),
            })}
            onSubmit={(formData, {resetForm}) => {
              update ? updateCoinPlan(formData) : submitFormData(formData)
            }}
          >
            {(runform) => (
              <form onSubmit={runform.handleSubmit}>
                <input type='hidden' name='_token' defaultValue='7g2ETyfzgFyhJxwuYSAx3519NJ6eTka72A8J3y60' /> <input id='subcriptionId' name='id' className='form-control' type='hidden' defaultValue={24} />
                <span />
                <div className='form-group mt-5'>
                  <label htmlFor='price'> Price</label>
                  <input type='number' className='form-control mt-2' name='price' id='price' {...formAttr(runform, 'price')} />
                  {errorContainer(runform, 'price')}
                </div>
                <div className='form-group mt-5'>
                  <label htmlFor='price'> Discount Price</label>
                  <input type='number' className='form-control mt-2' name='discount_price' id='discount_price' {...formAttr(runform, 'discount_price')} />
                  {errorContainer(runform, 'discount_price')}
                </div>
                <div className='form-group mt-5'>
                  <label htmlFor='diamond'>Diamond</label>
                  <input type='number' className='form-control mt-2' name='diamond' id='diamond' {...formAttr(runform, 'diamond')} />
                  {errorContainer(runform, 'diamond')}
                </div>
                <div className='form-group mt-5'>
                  <label htmlFor='app_store_id'> App store id</label>
                  <input type='text' className='form-control mt-2' name='app_store_id' id='app_store_id' {...formAttr(runform, 'app_store_id')} />
                  {errorContainer(runform, 'app_store_id')}
                </div>
                <div className='form-group mt-5'>
                  <label htmlFor='play_store_id'>Play Store Id</label>
                  <input type='text' className='form-control mt-2' name='play_store_id' id='play_store_id' {...formAttr(runform, 'play_store_id')} />
                  {errorContainer(runform, 'play_store_id')}
                </div>
                <div className='form-group mt-5'>
                  <label htmlFor='orignal_sku'>Orignal SKU - without discount</label>
                  <input type='text' className='form-control mt-2' name='orignal_sku' id='orignal_sku' {...formAttr(runform, 'orignal_sku')} />
                  {errorContainer(runform, 'orignal_sku')}
                </div>
                <div className='form-group mt-5'>
                  <label htmlFor='orignal_sku'>Highlight text</label>
                  <input type='text' className='form-control mt-2' name='highlight_text' id='highlight_text' {...formAttr(runform, 'highlight_text')} />
                  {errorContainer(runform, 'highlight_text')}
                </div>
                <button type='submit' className='btn-comn-submit mt-5'>
                  {update ? 'Edit Subscription' : 'Add Subcription'}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default CoinPlanModal
