import React, { useState } from "react";
import Link from "next/link";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import RecetteComponentModifier from "./recette_component_modifier";
const SousRecetteListItem = ({ sous_recette, is_edit = false }) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const deleteSousRecette = () => {
    alert("Suppression");
  };
  // Create the string that will be displayed as the list of allergene for the ingredient
  var allergene_string = "";
  if (sous_recette.allergenes.length > 0) {
    sous_recette.allergenes.forEach(
      (allergene) => (allergene_string += allergene.name + "; ")
    );
    allergene_string = allergene_string.substring(
      0,
      allergene_string.length - 2
    );
  }

  return (
    <tr>
      <td
        className={"col-1"}
        style={{
          verticalAlign: "middle",
        }}
      >
        <p style={{ marginBottom: "0px", textAlign: "end" }}>
          {sous_recette.quantity ? sous_recette.quantity : "quantité inconnue"}
        </p>
      </td>
      <td
        className={"col-3"}
        style={{
          verticalAlign: "middle",
        }}
      >
        <p style={{ marginBottom: "0px" }}>
          {sous_recette.unit ? sous_recette.unit : "unité inconnue"}
        </p>
      </td>
      <td className={"col-7"} style={{ verticalAlign: "middle" }}>
        <Link href={"/recettes/" + sous_recette.id}>{sous_recette.name}</Link>
        {sous_recette.note ? " (" + sous_recette.note + ")" : null}
      </td>
      {is_edit ? (
        <>
          <td className={"col-1"}>{/* Empty on purpose */}</td>
          <td className={"col-1"}>
            <RecetteComponentModifier
              component={sous_recette}
              is_sous_recette={true}
            ></RecetteComponentModifier>
          </td>
          <td className={"col-1"}>
            <Button
              className="emoji_button"
              onClick={() => {
                if (
                  window.confirm(
                    'Êtes-vous sûr de vouloir supprimer la sous recette "' +
                      sous_recette.name.toLowerCase() +
                      '" de cette recette ?'
                  )
                )
                  deleteSousRecette();
              }}
            >
              🗑
            </Button>
          </td>
        </>
      ) : (
        <>
          <td className={"col-1"}>
            <div>
              <div>
                {sous_recette.allergenes.length > 0 ? (
                  <div className="d-flex flex-row justify-content-end">
                    <Button
                      color="white"
                      type="button"
                      id={"see-allergenes" + sous_recette.id}
                    >
                      ℹ️
                    </Button>
                    <UncontrolledPopover
                      placement="bottom"
                      target={"see-allergenes" + sous_recette.id}
                      trigger="legacy"
                    >
                      <PopoverHeader>Allergènes</PopoverHeader>
                      <PopoverBody>{allergene_string}</PopoverBody>
                    </UncontrolledPopover>
                  </div>
                ) : null}
              </div>
            </div>
          </td>
          <td
            className={"col-1"}
            style={{
              verticalAlign: "middle",
            }}
          >
            <p
              style={{
                marginBottom: "0px",
                textAlign: "end",
                fontSize: "12px",
              }}
            >
              {sous_recette.cost + "€"}
            </p>
          </td>
        </>
      )}
    </tr>
  );
};

export default SousRecetteListItem;
