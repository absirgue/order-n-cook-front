import React from "react";
// import PlaceOrder from "./place_order";

// reactstrap components
import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import CreateAvoir from "./create_avoir";

function AskAvoir({ commande }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <>
      <Button
        className="btn btn-secondary"
        onClick={() => setModalOpen(!modalOpen)}
      >
        Demander un Avoir
      </Button>
      <Modal
        size="lg"
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <div className="d-flex flex-row justify-content-between col-11 align-items-end">
            <Modal.Title id="example-modal-sizes-title-lg">
              Demander un avoir pour cette commande chez{" "}
              {commande.fournisseur.name}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <CreateAvoir
            commande={commande}
            closeModal={() => setModalOpen(false)}
          ></CreateAvoir>
        </Modal.Body>
        <Modal.Footer>
          <div className="col-12 d-flex flex-row justify-content-end">
            <Button onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AskAvoir;
