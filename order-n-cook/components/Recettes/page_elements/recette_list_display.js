import React, { useState } from "react";
import Link from "next/link";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
/*
 Component to display details about a single recette as part of a list of recettes. 
*/
const RecetteListItem = ({ recette }) => {
  var tastes_string = "";
  if (recette.tastes.length > 0) {
    recette.tastes.forEach((taste) => (tastes_string += taste.name + "; "));
    tastes_string = tastes_string.substring(0, tastes_string.length - 2);
  }

  return (
    <Link
      href={"/recettes/" + recette.id}
      className="mb-2 d-flex flex-row align-align-items-center
      justify-content-between p-3"
      style={{
        borderRadius: "20px",
        backgroundColor: "white",
        minHeight: "80px",
        textDecoration: "none",
      }}
    >
      <div className="d-flex flex-column justify-content-start col-5">
        <h4
          style={{ verticalAlign: "center", marginBottom: 0, color: "#0254c7" }}
        >
          {recette.name}
        </h4>
        <p style={{ marginBottom: 0, color: "#95929c" }}>{recette.category}</p>
      </div>
      <div className="d-flex flex-column justify-content-start col-3 align-items-end">
        <p style={{ marginBottom: 0, fontSize: "14px", color: "#95929c" }}>
          Prix de vente recommandé:
        </p>
        <h5
          style={{
            verticalAlign: "center",
            marginBottom: 0,
            color: "#0254c7",
            fontSize: "26px",
          }}
        >
          {recette.selling_price + "euro_symbol"}
        </h5>
      </div>
    </Link>
  );
};

export default RecetteListItem;
