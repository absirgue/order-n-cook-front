import React from "react";
// import PlaceOrder from "./place_order";

// reactstrap components
import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import CreateAvoir from "./create_avoir";

async function send_receive_avoir(data, commande_id) {
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint =
    `http://127.0.0.1:8000/api/receive_avoir/` + commande_id + "/";

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

function ReceiveAvoir({ commande }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [avoirItems, setAvoirItems] = React.useState(
    commande.avoir.items.map((item) => {
      return { ...item, quantity_received: 0 };
    })
  );
  const [ignored, forceUpdate] = React.useReducer((x) => x + 1, 0);

  async function receive_avoir() {
    let data = {};
    data["items"] = avoirItems.map((item) => {
      return {
        id: item.id,
        quantity_received: item.quantity_received,
        reason: item.reason,
      };
    });
    if (
      window.confirm(
        "Assurez-vous d'avoir renseigné la bonne quantité pour chaque élément de l'avoir."
      )
    ) {
      const response = await send_receive_avoir(data, commande.id);
      if (response.status == 200) {
        alert("L'avoir reçu a bien été enregistré.");
      } else {
        alert(
          "Une erreur est survenue. Merci de réessayer utlérieurement ou de contacter le service technique."
        );
      }
    }
  }

  return (
    <>
      <Button
        className="btn btn-secondary"
        onClick={() => setModalOpen(!modalOpen)}
      >
        Réceptionner l'Avoir
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
          <div className="col-12 d-flex flex-column justify-content-center">
            {avoirItems.map((item) => (
              <div
                className="col-12 d-flex flex-column justify-content-between align-items-center p-3"
                style={{ borderRadius: "15px", backgroundColor: "#f3f0f0" }}
              >
                <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                  <div className="col-4" style={{ fontWeight: 500 }}>
                    {item.name}
                  </div>
                  <div className="col-8 d-flex flex-row justify-content-center flex-grow-1 align-items-center">
                    <p
                      className="col-4 me-1"
                      style={{ textAlign: "end", fontWeight: 500 }}
                    >
                      Raison:{" "}
                    </p>
                    <input
                      className="col-8"
                      type="text"
                      value={item.reason}
                      onChange={(event) => {
                        const new_state = avoirItems;
                        new_state[new_state.indexOf(item)].reason =
                          event.target.value;
                        setAvoirItems(new_state);
                        forceUpdate();
                      }}
                    />
                  </div>
                </div>
                <div className="col-12 d-flex flex-row justify-content-between align-items-center mt-1">
                  <div className="col-3">
                    Quantité demandée: {item.quantity_demanded}
                  </div>
                  <div
                    className="col-3 d-flex flex-row justify-content-center flex-grow-1 align-items-center"
                    style={{ fontWeight: 500, color: "#f85959" }}
                  >
                    <p className="me-1">Quantité reçue : </p>
                    <input
                      type="number"
                      step="any"
                      value={item.quantity_received}
                      placeholder={item.quantity_demanded}
                      onChange={(event) => {
                        const new_state = avoirItems;
                        new_state[new_state.indexOf(item)].quantity_received =
                          event.target.value;
                        setAvoirItems(new_state);
                        forceUpdate();
                      }}
                    />
                  </div>
                  <div className="col-2">
                    Soit {(item.quantity_received * item.unit_price).toFixed(2)}
                    € HT
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="col-12 d-flex flex-row justify-content-end">
            <Button className="me-4 btn btn-primary" onClick={receive_avoir}>
              Enregistrer
            </Button>
            <Button onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReceiveAvoir;
