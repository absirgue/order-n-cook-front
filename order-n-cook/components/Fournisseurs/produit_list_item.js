import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import EditProduit from "./edit_only/granular/edit_produit";
import PlaceOrder from "../general/place_order";
export default function ProduitListItem({
  produit,
  isEdit = false,
  fournisseur_name,
  fournisseur_id,
  mutate = null,
}) {
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const delete_confirmation_text =
    'Êtes-vous sûr de vouloir supprimer le produit "' +
    produit.ingredient.name +
    '" de ce fournisseur?';

  async function deleteItem() {
    let endpoint = "http://127.0.0.1:8000/api/produits/" + produit.id + "/";
    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "DELETE",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    if (response.status != 204) {
      alert("Une erreur est survenue. Merci de réessayer plus tard.");
    }
  }

  return (
    <div
      style={{ paddingTop: "0px" }}
      className="d-flex flex-row justify-content-start col-12"
    >
      <Button
        color="primary"
        type="button"
        className="pe-3 ps-3"
        onClick={() => setOpenOrderModal(!openOrderModal)}
      >
        🛒
      </Button>
      <Modal
        show={openOrderModal}
        onHide={() => setOpenOrderModal(!openOrderModal)}
      >
        <Modal.Header>
          Passer commande - {produit.ingredient.name} chez {fournisseur_name}
        </Modal.Header>
        <Modal.Body>
          <PlaceOrder
            closeModal={setOpenOrderModal}
            produit={{
              ...produit,
              fournisseur_name: fournisseur_name,
              fournisseur_id: fournisseur_id,
            }}
          ></PlaceOrder>
        </Modal.Body>
      </Modal>
      <Link
        style={{ paddingTop: "0px" }}
        className="col-3 ms-2 d-flex flex-column justify-content-center"
        href={"/ingredients/" + produit.ingredient.id}
      >
        {produit.ingredient.name}
      </Link>

      <p
        style={{ paddingTop: "0px", marginBottom: "0px" }}
        className="col-3 d-flex flex-column justify-content-center"
        title="Quantité proposée et sa conversion_unit en unité de masse"
      >
        {produit.real_unit.quantity + " " + produit.real_unit.unit}
        {produit.conversion_unit
          ? " (" +
            produit.conversion_unit.quantity +
            produit.conversion_unit.unit +
            ")"
          : null}
      </p>

      <p
        style={{ paddingTop: "0px", marginBottom: "0px" }}
        className="col-1 d-flex flex-column justify-content-center"
        title="Prix unitaire (estimé)"
      >
        {produit.price + "€"}
      </p>

      {produit.kilogramme_price ? (
        <p
          style={{ paddingTop: "0px", marginBottom: "0px" }}
          className="col-1 d-flex flex-column justify-content-center"
          title="Prix au kilogramme (estimé)"
        >
          {produit.kilogramme_price + "€/kg"}
        </p>
      ) : (
        <p className="col-1" style={{ marginBottom: "0px" }}>
          {/* Purposefully empty, think of a message when unknwon conversion_unit */}
        </p>
      )}
      {produit.last_known_price ? (
        <div
          className="col-2 d-flex flex-column align-items-center justify-content-center"
          title={
            "Dernier prix unitaire connu" +
            (produit.date_last_known_price
              ? " (" + produit.date_last_known_price + ")"
              : "")
          }
          style={{ paddingTop: "0px" }}
        >
          <p style={{ marginBottom: "0px", color: "#95929c" }}>
            {produit.last_known_price + "€"}
          </p>
          <p
            style={{
              marginBottom: "0px",
              color: "#95929c",
              fontSize: "14px",
            }}
          >
            {produit.date_last_known_price
              ? "le " + produit.date_last_known_price
              : "Dernier prix connu"}
          </p>
        </div>
      ) : (
        <p className="col-2" style={{ marginBottom: "0px" }}>
          {/* Purposefully empty, think of a message when unknwon last price */}
        </p>
      )}
      {isEdit ? (
        <>
          <div className="col-1 d-flex flex-row justify-content-end">
            <EditProduit
              produit={produit}
              fournisseur_id={fournisseur_id}
              mutate={mutate}
            ></EditProduit>
            <Button
              className="emoji_button"
              title="Supprimer"
              onClick={() => {
                if (window.confirm(delete_confirmation_text)) deleteItem();
              }}
            >
              🗑
            </Button>
          </div>
        </>
      ) : (
        <>
          {produit.labels ? (
            <p
              className="col-1 d-flex flew-row justify-content-end align-items-center"
              style={{ marginBottom: "0px", paddingTop: "0px" }}
            >
              {produit.labels.map((label) => (
                <span className="me-1">{label.name}</span>
              ))}
            </p>
          ) : (
            <div className="col-1">{/* Purposefully empty*/}</div>
          )}
        </>
      )}
    </div>
  );
}
