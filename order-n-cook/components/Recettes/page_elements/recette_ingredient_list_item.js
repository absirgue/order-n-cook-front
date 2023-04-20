import React, { useState } from "react";
import Link from "next/link";
import PurchaseIngredientHelper from "../../Ingredients/Ingredients/modals/purchase_ingredient_modal";
import RecetteComponentModifier from "./edit_only/modification_buttons/recette_component_modifier";
import DeleteButton from "./edit_only/modification_buttons/delete_button";
import ChangeSectionButton from "./edit_only/modification_buttons/change_section_button";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";

const RecetteIngredientListItem = ({
  ingredient,
  is_edit = false,
  all_sections,
}) => {
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
          <td className={"col-1"}></td>
          <td className={"col-1"} style={{ verticalAlign: "middle" }}>
            <ChangeSectionButton
              is_ingredient={true}
              all_sections={all_sections}
              element={ingredient}
            ></ChangeSectionButton>
          </td>

          <td className={"col-1"} style={{ verticalAlign: "middle" }}>
            <RecetteComponentModifier
              component={ingredient}
            ></RecetteComponentModifier>
          </td>
          <td className={"col-1"} style={{ verticalAlign: "middle" }}>
            <DeleteButton
              element={ingredient}
              is_ingredient={true}
            ></DeleteButton>
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
