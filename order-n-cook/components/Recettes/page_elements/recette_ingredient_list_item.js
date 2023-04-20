import React, { useState } from "react";
import Link from "next/link";
import PurchaseIngredientHelper from "../../Ingredients/Ingredients/modals/purchase_ingredient_modal";
import RecetteComponentModifier from "./recette_component_modifier";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";

const RecetteIngredientListItem = ({ ingredient, is_edit = false }) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const deleteIngredient = () => {
    alert("Suppression");
  };
  // Create the string that will be displayed as the list of allergene for the ingredient
  var allergene_string = "";
  if (ingredient.allergenes.length > 0) {
    ingredient.allergenes.forEach(
      (allergene) => (allergene_string += allergene.name + "; ")
    );
    allergene_string = allergene_string.substring(
      0,
      allergene_string.length - 2
    );
  }

  return (
    <tr>
      {!is_edit ? (
        <td className={"col-1"}>
          <PurchaseIngredientHelper
            onClose={() => setShowPurchaseModal(false)}
            show={showPurchaseModal}
          ></PurchaseIngredientHelper>
        </td>
      ) : null}

      <td
        className={"col-1"}
        style={{
          verticalAlign: "middle",
        }}
      >
        <p style={{ marginBottom: "0px", textAlign: "end" }}>
          {ingredient.quantity ? ingredient.quantity : "quantité inconnue"}
        </p>
      </td>
      <td
        className={"col-2"}
        style={{
          verticalAlign: "middle",
        }}
      >
        <p style={{ marginBottom: "0px" }}>
          {ingredient.unit ? ingredient.unit : "unité inconnue"}
        </p>
      </td>
      <td className={"col-7"} style={{ verticalAlign: "middle" }}>
        <Link href={"/ingredients/" + ingredient.id}>{ingredient.name}</Link>
        {ingredient.note ? " (" + ingredient.note + ")" : null}
      </td>
      {is_edit ? (
        <>
          <td className={"col-1"}>{/* Empty on purpose */}</td>
          <td className={"col-1"}>
            <RecetteComponentModifier
              component={ingredient}
            ></RecetteComponentModifier>
          </td>
          <td className={"col-1"}>
            <Button
              className="emoji_button"
              onClick={() => {
                if (
                  window.confirm(
                    "Êtes-vous sûr de vouloir supprimer l'ingrédient \"" +
                      ingredient.name.toLowerCase() +
                      '" de cette recette ?'
                  )
                )
                  deleteIngredient();
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
                {ingredient.allergenes.length > 0 ? (
                  <div className="d-flex flex-row justify-content-end">
                    <Button
                      color="white"
                      type="button"
                      id={"see-allergenes" + ingredient.id}
                    >
                      ℹ️
                    </Button>
                    <UncontrolledPopover
                      placement="bottom"
                      target={"see-allergenes" + ingredient.id}
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
              {ingredient.cost + "€"}
            </p>
          </td>
        </>
      )}
    </tr>
  );
};

export default RecetteIngredientListItem;
