import React from "react";
import PlaceOrder from "../../../general/place_order";

// reactstrap components
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  Placeholder,
} from "reactstrap";
import Modal from "react-bootstrap/Modal";

function get_produits_for_ingredient() {
  return [
    {
      fournisseur_name: "Anthès",
      real_unit: { unit: "plaquette", quantity: "1" },
      conversion_unit: { unit: "gramme", quantity: 250 },
      price: 5.5,
      kilogramme_price: 22,
      geographic_location: "Bretagne",
      labels: [
        { id: 1, name: "AOC" },
        { id: 2, name: "Bio" },
      ],
    },
    {
      fournisseur_name: "Anthès",
      real_unit: { unit: "plaquette", quantity: "1" },
      conversion_unit: { unit: "gramme", quantity: 250 },
      price: 5.5,
      kilogramme_price: 22,
      geographic_location: "Bretagne",
      labels: [
        { id: 1, name: "AOC" },
        { id: 2, name: "Bio" },
      ],
    },
    {
      fournisseur_name: "Anthès",
      real_unit: { unit: "plaquette", quantity: "1" },
      conversion_unit: { unit: "gramme", quantity: 250 },
      price: 5.5,
      kilogramme_price: 22,
      geographic_location: "Bretagne",
      labels: [
        { id: 1, name: "AOC" },
        { id: 2, name: "Bio" },
      ],
    },
  ];
}

/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
*/
const PurchaseIngredientHelper = ({
  ingredient,
  modalOpen,
  setModalOpen,
  setOtherModalProduit,
  openOtherModal,
}) => {
  const produits_for_ingredient = get_produits_for_ingredient();

  // var label_string = "";
  // if (produit.labels && produit.labels.length > 0) {
  //   produit.labels.forEach((label) => (label_string += label.name + "; "));
  //   label_string = label_string.substring(0, label_string.length - 2);
  // }

  return (
    <>
      <Modal
        size="lg"
        show={modalOpen}
        onHide={() => {
          setModalOpen(!modalOpen);
          openOtherModal(true);
        }}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <div className="d-flex flex-row justify-content-between col-11 align-items-end">
            <Modal.Title id="example-modal-sizes-title-lg">
              Passer commande - {ingredient.name}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          {produits_for_ingredient.map((produit) => (
            <div className="d-flex flex-row justify-content-start align-items-center">
              <Button
                className="emoji_button"
                onClick={() => {
                  console.log("OPEN IT UP");
                  setModalOpen(false);
                  setOtherModalProduit({
                    ...produit,
                    ingredient_name: ingredient.name,
                  });
                  openOtherModal(true);
                }}
              >
                🛒
              </Button>
              <p className="col-3" style={{ textAlign: "center" }}>
                {produit.fournisseur_name}
              </p>
              <p className="col-3 me-2">
                {produit.real_unit.quantity + " " + produit.real_unit.unit}
                {produit.conversion_unit
                  ? " (" +
                    produit.conversion_unit.quantity +
                    produit.conversion_unit.unit +
                    ")"
                  : null}
              </p>
              <p className="col-1 align-items-end">{produit.price + "€"}</p>
              <p className="col-1 align-items-end">
                {produit.kilogramme_price + "€/kg"}
              </p>
              {produit.labels && produit.labels.length > 0 ? (
                <div className="d-flex flex-row justify-content-end">
                  <Button
                    color="white"
                    type="button"
                    id="see-labels"
                    style={{ textDecoration: "underline", color: "blue" }}
                  >
                    Labels
                  </Button>
                  <UncontrolledPopover
                    placement="bottom"
                    target="see-labels"
                    trigger="legacy"
                  >
                    <PopoverHeader>Labels</PopoverHeader>
                    <PopoverBody>
                      {produit.labels.reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue.name + " ",
                        ""
                      )}
                    </PopoverBody>
                  </UncontrolledPopover>
                </div>
              ) : null}
              {produit.geographic_location ? (
                <div className="d-flex flex-row justify-content-end">
                  <Button
                    color="white"
                    type="button"
                    id="see-labels"
                    style={{ textDecoration: "underline", color: "blue" }}
                  >
                    Provenance
                  </Button>
                  <UncontrolledPopover
                    placement="bottom"
                    target="see-labels"
                    trigger="legacy"
                  >
                    <PopoverHeader>Labels</PopoverHeader>
                    <PopoverBody>{produit.geographic_location}</PopoverBody>
                  </UncontrolledPopover>
                </div>
              ) : null}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <div className="col-12 d-flex flex-row justify-content-end">
            <Button
              onClick={() => {
                setModalOpen(!modalOpen);
                openOtherModal(true);
              }}
            >
              Fermer
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PurchaseIngredientHelper;
