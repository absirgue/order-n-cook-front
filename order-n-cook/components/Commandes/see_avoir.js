import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
export default function SeeAvoir({ commande }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button className="btn btn-success" onClick={() => setModalOpen(true)}>
        Détails de l'Avoir
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
              Détails de l'avoir pour votre commande chez{" "}
              {commande.fournisseur.name}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="col-12 d-flex flex-column justify-content-center">
            {commande.avoir.items.map((item) => (
              <div
                className="col-12 d-flex flex-column justify-content-between align-items-center p-3 mt-3"
                style={{ borderRadius: "15px", backgroundColor: "#f3f0f0" }}
              >
                <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                  <div className="col-6" style={{ fontWeight: 500 }}>
                    {item.name}
                  </div>
                  <div className="col-6 d-flex flex-row justify-content-between">
                    <p>Quantité demandée: {item.quantity_demanded}</p>
                    {item.quantity_received ? (
                      <p>Quantité reçue: {item.quantity_received}</p>
                    ) : (
                      <p>Quantité reçue: -</p>
                    )}
                  </div>
                </div>
                <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                  <div className="col-6">Raison: {item.reason}</div>
                  <div className="col-6 d-flex flex-row justify-content-end">
                    {item.quantity_received ? (
                      <p>
                        Soit:{" "}
                        {(item.quantity_received * item.unit_price).toFixed(2)}€
                        HT
                      </p>
                    ) : (
                      <p>
                        Soit:{" "}
                        {(item.quantity_demanded * item.unit_price).toFixed(2)}€
                        HT
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
