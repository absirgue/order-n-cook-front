import React from "react";
import PlaceOrder from "./place_order";

// reactstrap components
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import Modal from "react-bootstrap/Modal";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
*/
const PurchaseIngredientHelper = ({ ingredient }) => {
  console.log("ingredient");
  console.log(ingredient);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [productIsSelected, setProductIsSelected] = React.useState(false);

  // var label_string = "";
  // if (produit.labels && produit.labels.length > 0) {
  //   produit.labels.forEach((label) => (label_string += label.name + "; "));
  //   label_string = label_string.substring(0, label_string.length - 2);
  // }

  const { data: produits_for_ingredient, error: retrievalError } = useSWR(
    "http://127.0.0.1:8000/api/ingredient/produits/" + ingredient.ingredient_id,
    fetcher
  );

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
          {retrievalError ? (
            <div>
              Une erreur est survenue lors du chargement de la page. Si cette
              erreur persiste, contactez le service technique.
            </div>
          ) : produits_for_ingredient && produits_for_ingredient.length > 0 ? (
            productIsSelected ? (
              <div className="col-12 d-flex flex-column">
                <Button
                  color="white"
                  className="btn"
                  style={{
                    color: "#0D6EFD",
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
                <PlaceOrder
                  produit={selectedProduct}
                  closeModal={setModalOpen}
                ></PlaceOrder>
              </div>
            ) : produits_for_ingredient.length > 0 ? (
              produits_for_ingredient.map((produit) => (
                <div
                  className="d-flex flex-row justify-content-start align-items-center"
                  style={{ overflow: "scroll" }}
                >
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
                        style={{
                          textDecoration: "underline",
                          color: "#0D6EFD",
                        }}
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
                        id="see-provenance"
                        style={{
                          textDecoration: "underline",
                          color: "#0D6EFD",
                        }}
                      >
                        Provenance
                      </Button>
                      <UncontrolledPopover
                        placement="bottom"
                        target="see-provenance"
                        trigger="legacy"
                      >
                        <PopoverHeader>Origine Géographique</PopoverHeader>
                        <PopoverBody>{produit.geographic_location}</PopoverBody>
                      </UncontrolledPopover>
                    </div>
                  ) : null}
                </div>
              ))
            ) : null
          ) : produits_for_ingredient && produits_for_ingredient.length == 0 ? (
            <div>
              Aucun de vos fournisseurs ne propose actuellement ce produit. Vous
              pouvez modifier cela dans la rubrique <i>Mes Fournisseurs</i>.
            </div>
          ) : (
            <div>Chargement en cours ...</div>
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
