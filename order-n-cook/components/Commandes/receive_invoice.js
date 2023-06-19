import React from "react";
// import PlaceOrder from "./place_order";

// reactstrap components
import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import CreateAvoir from "./create_avoir";
import InvoiceManualInput from "./invoice_manual_input";
function ReceiveInvoice({ commande }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [manualInput, setManualInput] = React.useState(false);

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state
    setSelectedFile(event.target.files[0]);
  };

  return (
    <>
      <Button
        className="btn btn-primary"
        onClick={() => setModalOpen(!modalOpen)}
      >
        Réceptionner la Facture
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
              Réceptionner la facture pour cette commande chez{" "}
              {commande.fournisseur.name}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          {manualInput ? (
            <InvoiceManualInput commande={commande}></InvoiceManualInput>
          ) : (
            <div className="col-12 d-flex flex-column justify-content-center">
              <p
                className="col-12 mb-1"
                style={{ textDecoration: "underline" }}
              >
                Ajouter le fichier de la facture pour procéder à son analyse:
              </p>
              <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                <input type="file" onChange={onFileChange} />
                <Button className="btn btn-primary mt-1">
                  Lancer l'Analyse
                </Button>
              </div>
              <div className="col-12 mt-4 d-flex flex-row justify-content-center align-items-center">
                <p className="me-2">Ou</p>
                <Button
                  className="btn btn-success"
                  onClick={() => setManualInput(true)}
                >
                  Saisie Manuelle
                </Button>
              </div>
            </div>
          )}
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
export default ReceiveInvoice;
