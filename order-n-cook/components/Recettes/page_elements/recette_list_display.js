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
      <Link
        href={"/recettes/" + recette.id}
        className="d-flex flex-column justify-content-start col-9"
        style={{ textDecoration: "none" }}
      >
        <h4
          style={{ verticalAlign: "center", marginBottom: 0, color: "#0254c7" }}
        >
          {recette.name}
        </h4>
        <p style={{ marginBottom: 0, color: "#95929c" }}>{recette.category}</p>
      </Link>
      <div className="d-flex flex-row justify-content-start col-3 align-items-end">
        <div className="col-4 d-flex flex-row justify-content-start">
          <div className="d-flex flex-row justify-content-end col-6">
            {recette.is_to_modify ? (
              <div className="d-flex flex-row justify-content-end">
                <Button
                  color="white"
                  type="button"
                  id={"to-modify" + recette.id}
                >
                  ❗️
                </Button>
                <UncontrolledPopover
                  placement="bottom"
                  target={"to-modify" + recette.id}
                  trigger="legacy"
                >
                  <PopoverBody>Recette à modifier</PopoverBody>
                </UncontrolledPopover>
              </div>
            ) : null}
          </div>

          <div className="col-6">
            {recette.allergenes && recette.allergenes.length > 0 ? (
              <div className="d-flex flex-row justify-content-end">
                <Button
                  color="white"
                  type="button"
                  id={"see-allergenes" + recette.id}
                >
                  ℹ️
                </Button>
                <UncontrolledPopover
                  placement="bottom"
                  target={"see-allergenes" + recette.id}
                  trigger="legacy"
                >
                  <PopoverHeader>Allergènes</PopoverHeader>
                  <PopoverBody>{recette.allergenes}</PopoverBody>
                </UncontrolledPopover>
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-8 d-flex flex-column justidy-content-center align-items-end">
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
            {recette.selling_price + "€"}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default RecetteListItem;
