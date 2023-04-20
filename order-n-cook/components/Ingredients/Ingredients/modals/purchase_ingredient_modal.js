import React from "react";

// reactstrap components
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";

/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
*/
const PurchaseIngredientHelper = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <Button className="emoji_button" onClick={() => setModalOpen(!modalOpen)}>
        🛒
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header">
          <h5 className="modal-title">
            Vos fournisseurs proposant cet ingrédient
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
            style={{ backgroundColor: "transparent", border: 0 }}
          >
            x
          </button>
        </div>
        <ModalBody>... to be implemented ... </ModalBody>
        <ModalFooter>
          <Button
            className="btn-primary"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            Fermer
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PurchaseIngredientHelper;
