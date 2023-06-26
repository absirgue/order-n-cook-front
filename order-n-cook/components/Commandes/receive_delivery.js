import React from "react";
// import PlaceOrder from "./place_order";

// reactstrap components
import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";

async function createBonLivraison(data, commande_id) {
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint =
    `http://127.0.0.1:8000/api/record_delivery/` + commande_id + "/";

  // Form the request for sending data to the server.
  const options = {
    // The method is POST because we are sending data.
    method: "PUT",
    // Tell the server we're sending JSON.
    headers: {
      "Content-Type": "application/json",
    },
    // Body of the request is the JSON data we created above.
    body: JSONdata,
  };

  // Send the form data to our forms API on Vercel and get a response.
  const response = await fetch(endpoint, options);
  return response;
}
const ReceiveDeliveryButton = ({ commande }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [BLValue, setBLValue] = React.useState(null);
  const [BLAmount, setBLAmount] = React.useState(null);

  function toggleModal() {
    setModalOpen(!modalOpen);
    setBLValue("");
    console.log(BLValue);
  }

  async function recordBL() {
    console.log("ENTERED");
    let data = {};
    if ((BLValue != null) & (BLValue != "")) {
      data["number"] = BLValue;
      if (BLAmount) {
        data["total_amount_ht"] = BLAmount;
      }
      console.log("DATA");
      console.log(data);
      const response = await createBonLivraison(data, commande.id);
      console.log("RESPONSE");
      console.log(response);
      if (response.status == 200) {
        alert("Le bon de livraison a bien été enregistré.");
      } else {
        alert(
          "Une erreur est survenue. Merci de réessayer utlérieurement ou de contacter le service technique."
        );
      }
    } else {
      alert("Veuillez d'abord renseigner le numéro de bon de livraison.");
    }
  }

  return (
    <>
      <Button
        className="btn btn-primary"
        onClick={() => setModalOpen(!modalOpen)}
      >
        Réceptionner la Livraison
      </Button>
      <Modal
        size="lg"
        show={modalOpen}
        onHide={() => toggleModal()}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <div className="d-flex flex-row justify-content-between col-11 align-items-end">
            <Modal.Title id="example-modal-sizes-title-lg">
              Enregister la réception de cette commande chez{" "}
              {commande.fournisseur.name}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <>
            <div className="d-flex flex-row justify-content-center col-12">
              <p className="me-2">Numéro du bon de livraison*:</p>
              <input
                value={BLValue}
                type="text"
                onChange={(event) => setBLValue(event.target.value)}
              />
            </div>
            <div className="d-flex flex-row justify-content-center col-12 mt-1">
              <p className="me-2">Montant du bon de livraison (HT):</p>
              <input
                type="text"
                value={BLAmount}
                placeholder="Montant H.T"
                onChange={(event) => setBLAmount(event.target.value)}
              />
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <div className="col-12 d-flex flex-row justify-content-end">
            {BLValue != null && BLValue != "" ? (
              <Button
                className="btn btn-primary me-3"
                onClick={() => {
                  console.log("CLICKED");
                  recordBL();
                  setModalOpen(false);
                }}
              >
                Enregistrer
              </Button>
            ) : null}
            <Button onClick={toggleModal}>Annuler</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReceiveDeliveryButton;
