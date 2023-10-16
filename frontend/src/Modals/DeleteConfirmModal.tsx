import {Modal} from 'react-bootstrap'

interface IProps {
  setDelete?: any
  setConfirmDel?: any
}

export const DeleteConfirmModal: React.FC<IProps> = ({setDelete, setConfirmDel}) => {
  return (
    <>
      <Modal.Body>
        <div className='row'>
          <div className='swal2-icon swal2-warning swal2-animate-warning-icon' id='data_view'></div>
          <div>
            <h5 className='text-center m-1 pb-3 fs-1'>Are you sure?</h5>
          </div>
          <div>
            <p className='text-center m-3 fs-4'> Do you really want to take this action?</p>
          </div>
          <div className='text-center mt-3 pb-3'>
            <button type='button' className='btn-comn-submit me-3' onClick={() => setConfirmDel()}>
              OK
            </button>
            <button type='button' onClick={() => setDelete({deleteConfirm: false})} className='btn-smart-comn2'>
              Cancel
            </button>
          </div>
        </div>
      </Modal.Body>
    </>
  )
}
