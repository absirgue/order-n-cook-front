import React from "react";
import Link from "next/link";

/*
 Component to display details about a single commadne as part of a list of commandes. 
*/
const CommandeListItem = ({ commande }) => {
  return (
    <Link
      href={"/commandes/" + commande.id}
      className="col-12"
      style={{ textDecoration: "none", marginTop: "7px" }}
    >
      <div
        className="mb-2 d-flex flex-row align-align-items-center
      justify-content-between p-3"
        style={{
          borderRadius: "20px",
          backgroundColor: "white",
          minHeight: "80px",
          textDecoration: "none",
        }}
      >
        <div className="d-flex flex-column justify-content-start col-4">
          <h4
            style={{
              verticalAlign: "center",
              marginBottom: 0,
              color: "#0254c7",
            }}
          >
            {commande.fournisseur.name}
          </h4>
          <p style={{ color: "#95929c" }}>{commande.fournisseur.category}</p>
        </div>
        {commande.cde ? (
          <div className="col-2" style={{ color: "#95929c" }}>
            <p>CDE: {commande.cde.value}</p>
            <p>{commande.cde.date}</p>
          </div>
        ) : (
          <div className="col-2"></div>
        )}
        {commande.bl ? (
          <div className="col-2" style={{ color: "#95929c" }}>
            <p>BL: {commande.bl.value}</p>
            <p>{commande.bl.date}</p>
          </div>
        ) : (
          <div className="col-2"></div>
        )}
        {commande.avoir ? (
          <div className="col-2" style={{ color: "#95929c" }}>
            <p>N Avoir: {commande.avoir.value}</p>
            <p>{commande.avoir.date}</p>
          </div>
        ) : (
          <div className="col-2"></div>
        )}
        {commande.facture ? (
          <div className="col-2" style={{ color: "#95929c" }}>
            <p>N Facture: {commande.facture.value}</p>
            <p>{commande.facture.date}</p>
          </div>
        ) : (
          <div className="col-2 d-flex flex-column align-items-center">
            <p>{commande.status_text}</p>
            <p style={{ color: "#95929c" }}>
              {commande.nb_jours ? commande.nb_jours + "j." : null}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CommandeListItem;
