import React from "react";
// import PlaceOrder from "./place_order";

// reactstrap components
import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import useSWR, { useSWRConfig } from "swr";
import CreateAvoir from "./create_avoir";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ReceiveDeliveryButton = ({ commande }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [createAvoir, setCreateAvoir] = React.useState(false);
  const [BLValue, setBLValue] = React.useState(null);
  const [BLAmount, setBLAmount] = React.useState(null);

  //   const { data: produits_for_ingredient, error: retrievalError } = useSWR(
  //     "http://127.0.0.1:8000/api/ingredient/produits/" + ingredient.ingredient_id,
  //     fetcher
  //   );

  function toggleModal() {
    setModalOpen(!modalOpen);
    setCreateAvoir(false);
    setBLValue("");
    console.log(BLValue);
  }

  async function recordBL() {}

  function demanderAvoir() {
    //    ENREGISTER LE BL ET TT
    if (BLValue == null || BLValue == "") {
      alert("Veuillez d'abord renseigner le numéro de bon de livraison.");
    } else {
      recordBL();
      setCreateAvoir(true);
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
          {createAvoir ? (
            <CreateAvoir commande={commande}></CreateAvoir>
          ) : (
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
              <div className="d-flex flex-row justify-content-end mt-4 col-12">
                {BLValue != null && BLValue != "" ? (
                  <Button className="btn btn-success" onClick={demanderAvoir}>
                    Demander un avoir
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="col-12 d-flex flex-row justify-content-end">
            {BLValue != null && BLValue != "" && !createAvoir ? (
              <Button
                className="btn btn-primary me-3"
                onClick={() => {
                  //    ENREGISTER LE BL ET TT
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
