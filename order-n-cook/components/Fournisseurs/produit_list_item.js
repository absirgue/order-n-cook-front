import { Button, Modal, ModalBody, ModalFooter, Table } from "reactstrap";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import EditProduit from "./edit_only/granular/edit_produit";
export default function ProduitListItem({ produit, isEdit = false }) {
  const [modifyProduit, setModifyProduit] = useState(false);
  const delete_confirmation_text =
    'Êtes-vous sûr de vouloir supprimer le produit "' +
    produit.ingredient.name +
    '" de ce fournisseur?';

  return (
    <div
      style={{ paddingTop: "0px" }}
      className="d-flex flex-row justify-content-start col-12"
    >
      <Button
        color="primary"
        type="button"
        className="pe-3 ps-3"
        onClick={() => filteredSearch()}
      >
        🛒
      </Button>
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
        title="Quantité proposée et sa conversion en unité de masse"
      >
        {produit.real_data.quantity + " " + produit.real_data.unit}
        {produit.conversion
          ? " (" + produit.conversion.quantity + produit.conversion.unit + ")"
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
          {/* Purposefully empty, think of a message when unknwon conversion */}
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
            <EditProduit produit={produit}></EditProduit>
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
          {produit.ingredient.labels ? (
            <p
              className="col-1 d-flex flew-row justify-content-end align-items-center"
              style={{ marginBottom: "0px", paddingTop: "0px" }}
            >
              {produit.ingredient.labels.map((label) => (
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
