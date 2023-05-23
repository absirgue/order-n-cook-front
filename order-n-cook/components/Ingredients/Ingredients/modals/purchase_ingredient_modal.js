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

      real_unit: { unit: "tester", quantity: "1" },
      conversion_unit: { unit: "gramme", quantity: 250 },
      price: 8,
      kilogramme_price: 22,
      geographic_location: "Bretagne",
      labels: [
        { id: 1, name: "AOC" },
        { id: 2, name: "Bio" },
      ],
    },
    {
      id: 1,
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
      id: 2,
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
const PurchaseIngredientHelper = ({ ingredient }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [productIsSelected, setProductIsSelected] = React.useState(false);
  const produits_for_ingredient = get_produits_for_ingredient();

  // var label_string = "";
  // if (produit.labels && produit.labels.length > 0) {
  //   produit.labels.forEach((label) => (label_string += label.name + "; "));
  //   label_string = label_string.substring(0, label_string.length - 2);
  // }

  function toggleModal() {
    setModalOpen(!modalOpen);
    setProductIsSelected(false);
    setSelectedProduct(null);
  }

  return (
    <>
      <Button className="emoji_button" onClick={() => setModalOpen(!modalOpen)}>
        🛒
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
              {productIsSelected
                ? "Passer commande - " +
                  ingredient.name +
                  " chez " +
                  selectedProduct.fournisseur_name
                : "Vos fournisseurs proposant ce produit - " + ingredient.name}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          {productIsSelected ? (
            <div className="col-12 d-flex flex-column">
              <Button
                color="white"
                className="btn"
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  textAlign: "left",
                  border: 0,
                }}
                onClick={() => {
                  setProductIsSelected(false);
                  setSelectedProduct(null);
                }}
              >
                {"< Retour"}
              </Button>
              <PlaceOrder produit={selectedProduct}></PlaceOrder>
            </div>
          ) : (
            produits_for_ingredient.map((produit) => (
              <div className="d-flex flex-row justify-content-start align-items-center">
                <Button
                  className="emoji_button"
                  onClick={() => {
                    setProductIsSelected(true);
                    setSelectedProduct({
                      ...produit,
                      ingredient: { name: ingredient.name },
                    });
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
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="col-12 d-flex flex-row justify-content-end">
            <Button onClick={toggleModal}>Fermer</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PurchaseIngredientHelper;
