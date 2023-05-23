import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cart.slice";
// reactstrap components
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import React from "react";

// dispatch(addToCart(product))

export default function PlaceOrder({ produit, toggleOnOpen = null }) {
  const [orderModalOpen, setOrderModalOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(null);

  function handleSubmit() {}
  return (
    <>
      <Button
        className="emoji_button"
        onClick={() => {
          //   toggleOnOpen(false);
          setOrderModalOpen(!orderModalOpen);
        }}
      >
        🛒
      </Button>
      <Modal
        toggle={() => {
          setOrderModalOpen(!orderModalOpen);
        }}
        isOpen={orderModalOpen}
        style={{ zIndex: 6 }}
      >
        <div className="modal-header">
          <h5 className="modal-title">
            Passer commande chez {produit.fournisseur_name}
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => {
              setOrderModalOpen(!orderModalOpen);
              resetSelections();
            }}
            style={{ backgroundColor: "transparent", border: 0 }}
          >
            x
          </button>
        </div>

        <ModalBody>
          <div className="d-flex flex-column">
            <div className="d-flex flex-column justify-content-start col-12 align-items-start">
              <div className="d-flex flex-row justify-content-between col-12">
                <div className="d-flex flex-row justify-content-start align-items-baseline">
                  <label htmlFor="quantity">Quantité:</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    step="any"
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "end",
                      width: "100px",
                    }}
                    placeholder={"3"}
                    required
                    onChange={(event) => setQuantity(event.target.value)}
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" type="submit">
            Enregistrer
          </button>
          <Button
            className="btn-secondary"
            type="button"
            onClick={() => {
              setOrderModalOpen(!orderModalOpen);
            }}
          >
            Fermer
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
