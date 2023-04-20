import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";

const ProgressionElementEditHelper = ({ progression_element }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const handleEditSubmission = async (event) => {
    event.preventDefault();

    console.log(event.target.id.value);
  };
  return (
    <>
      <Button
        className="emoji_button col-6"
        onClick={() => setOpenEditModal(true)}
      >
        🖊
      </Button>
      <Modal
        toggle={() => setOpenEditModal(!openEditModal)}
        isOpen={openEditModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">Modifier la progression</h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setOpenEditModal(!openEditModal)}
            style={{ backgroundColor: "transparent", border: 0 }}
          >
            x
          </button>
        </div>
        <form
          style={{ fontSize: "14px", marginBottom: "0px" }}
          onSubmit={handleEditSubmission}
        >
          <ModalBody>
            <div className="d-flex flex-column">
              <div className="d-flex flex-row justify-content-start mt-2">
                <label htmlFor="note" className="col-3">
                  Texte:
                </label>
                <input
                  name="id"
                  id="id"
                  defaultValue={progression_element.id}
                  hidden
                ></input>
                <textarea
                  id="note"
                  name="note"
                  rows="5"
                  cols="150"
                  className="col-9"
                >
                  {progression_element.text}
                </textarea>
              </div>
            </div>
            <div className="col-12 d-flex flex-row justify-content-end mt-2"></div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" type="submit">
              Enregistrer
            </button>
            <Button
              className="btn-secondary"
              type="button"
              onClick={() => setOpenEditModal(!openEditModal)}
            >
              Fermer
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default ProgressionElementEditHelper;
