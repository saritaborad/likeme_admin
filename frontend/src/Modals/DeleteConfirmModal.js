import {Modal} from 'react-bootstrap'

export const DeleteConfirmModal = ({setDelete, setConfirmDel, delChecked}) => {
  return (
    <>
      <Modal.Body>
        <div className='row'>
          <div className='swal2-icon swal2-warning swal2-animate-warning-icon' id='data_view'></div>
          <div>
            <h5 className='text-center m-1 pb-1'>Are you sure?</h5>
          </div>
          <div>
            <p className='text-center m-2'> Do you really want to take this action?</p>
          </div>
          <div className='text-center mt-3 pb-3'>
            <button type='button' className='btn-smart-comn me-2' onClick={() => setConfirmDel()}>
              OK
            </button>
            <button type='button' onClick={() => setDelete(false)} className='btn-smart-comn2'>
              Cancel
            </button>
          </div>
        </div>
      </Modal.Body>
    </>
  )
}
