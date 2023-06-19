import { useState } from "react";
import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import DeliveryDaysDisplay from "../Fournisseurs/delivery_days_display";
export default function RecordOrder({ items }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [orderMean, setOrderMean] = useState(null);
  const [emailNote, setEmailNote] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);

  const fournisseur_data = {
    name: "Éric",
    principal_email: "principal@emailtest.com",
    ordering_email: "order@emailtest.com",
    principal_phone_number: "07898765",
    ordering_phone_number: "07898765111",
    delivers_monday: false,
    delivers_tuesday: true,
    delivers_wednesday: true,
    delivers_thursday: true,
    delivers_friday: false,
    delivers_saturday: true,
    delivers_sunday: false,
    last_order_time: "12h",
  };
  return (
    <>
      <Button
        className="btn btn-primary"
        onClick={() => {
          console.log("CLICKED");
          setModalOpen(!modalOpen);
        }}
      >
        Passer commande
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
              Passer commande chez {items[0].fournisseur_name}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="col-12 d-flex flex-row justify-content-center align-items-start mb-3">
            <div className="col-6 d-flex flex-column">
              <p>
                <span className="greyed-label">Email de commande:</span>{" "}
                {fournisseur_data.ordering_email}
              </p>
              <p>
                {" "}
                <span className="greyed-label">Email principal:</span>{" "}
                {fournisseur_data.principal_email}
              </p>
            </div>
            <div className="col-6 d-flex flex-column align-items-end">
              <p>
                <span className="greyed-label">Téléphone de commande:</span>{" "}
                {fournisseur_data.ordering_phone_number}
              </p>
              <p>
                <span className="greyed-label">Téléphone principal:</span>{" "}
                {fournisseur_data.principal_phone_number}
              </p>
            </div>
          </div>
          <div className="col-12 d-flex flex-column justify-content-center align-items-start mb-4">
            <DeliveryDaysDisplay
              fournisseurData={fournisseur_data}
            ></DeliveryDaysDisplay>
            <p>
              <i>Dernière heure de commande: </i>
              {fournisseur_data.last_order_time ? (
                fournisseur_data.last_order_time
              ) : (
                <span className="greyed-label">Non renseignée</span>
              )}
            </p>
          </div>
          <div className="col-12 d-flex flex-row justify-content-center align-items-start">
            <div
              className="ps-5 d-flex flex-column col-6"
              onChange={(event) => setOrderMean(event.target.value)}
            >
              <div className="d-flex flex-row">
                {" "}
                <input
                  type="radio"
                  value="by_email"
                  name="order_mean"
                  className="me-2"
                />{" "}
                Commander par email
              </div>
              <div className="d-flex flex-row">
                {" "}
                <input
                  type="radio"
                  value="by_phone"
                  name="order_mean"
                  className="me-2"
                />{" "}
                Commander par téléphone
              </div>
              <div className="d-flex flex-row">
                {" "}
                <input
                  type="radio"
                  value="in_person"
                  name="order_mean"
                  className="me-2"
                />{" "}
                Commander en physique
              </div>
              <div className="d-flex flex-row">
                {" "}
                <input
                  type="radio"
                  value="cash_out"
                  name="order_mean"
                  className="me-2"
                />{" "}
                Sortie de caisse
              </div>
            </div>
            <div className="col-6 d-flex flex-column align-items-center justify-content-center">
              {orderMean === "by_email" ? (
                <textarea
                  id="email_note"
                  name="email_note"
                  rows="3"
                  cols="50"
                  className="col-9"
                  placeholder="Note à inclure dans l'email"
                  onChange={(event) => setEmailNote(event.target.value)}
                />
              ) : null}
            </div>
          </div>
          {orderMean && orderMean != "cash_out" ? (
            <div className="col-12 d-flex flex-column justify-content-start align-items-center mt-3">
              {" "}
              <p>Date de livraison:</p>
              <input
                className="col-4 pt-2 pb-2"
                type="date"
                style={{ borderRadius: "15px" }}
                onChange={(event) => setDeliveryDate(event.target.value)}
              />
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <div className="col-12 d-flex flex-row justify-content-end">
            {orderMean != null ? (
              <Button
                className="btn btn-primary me-4"
                onClick={() => {
                  console.log("Penser a supprimer tous les items associés");
                }}
              >
                Commander
              </Button>
            ) : null}
            <Button onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
