import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  Modal,
  ModalBody,
} from "reactstrap";
import PlaceOrder from "@/components/general/place_order";
import { useState } from "react";
import { setOriginalNode } from "typescript";

const ProductListItem = ({ produit, ingredient }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div
      className="d-flex flex-row justify-content-between align-items-center col-10 mb-2"
      style={{
        overflow: "scroll",
        marginBottom: "1px",
        borderBottom: "solid",
        borderColor: "#c2c1d1",
        borderWidth: "1px",
      }}
    >
      <Button
        className="emoji_button"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        🛒
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header col-12">
          <h5 className="modal-title">
            Passer commande chez {produit.fournisseur_name}
          </h5>
          <button
            aria-label="Close"
            className="close btn btn-secondary"
            type="button"
            onClick={() => {
              setModalOpen(!modalOpen);
            }}
            style={{ backgroundColor: "transparent", border: 0 }}
          >
            Annuler
          </button>
        </div>
        <ModalBody>
          <PlaceOrder
            closeModal={setModalOpen}
            produit={{ ...produit, ingredient: ingredient }}
          ></PlaceOrder>
        </ModalBody>
      </Modal>

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
        <div className="d-flex flex-row justify-content-end col-1">
          <Button
            color="white"
            type="button"
            id="see-labels"
            style={{ textDecoration: "underline", color: "#0D6EFD" }}
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
      ) : (
        <div className="d-flex flex-row justify-content-end col-1"></div>
      )}
      {produit.geographic_location ? (
        <div className="d-flex flex-row justify-content-end col-1">
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
      ) : (
        <div className="d-flex flex-row justify-content-end col-1"></div>
      )}
    </div>
  );
};

export default ProductListItem;
