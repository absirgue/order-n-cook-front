import React, { useState } from "react";
import Link from "next/link";
import PurchaseIngredientHelper from "../../../Ingredients/Ingredients/modals/purchase_ingredient_modal";
import RecetteComponentModifier from "../edit_only/modification_buttons/recette_component_modifier";
import DeleteButton from "../edit_only/modification_buttons/delete_button";
import ChangeSectionButton from "../edit_only/modification_buttons/change_section_button";
import AllergenesPopover from "../granular_elements/allergenes_popover";

const RecetteIngredientListItem = ({
  ingredient,
  is_edit = false,
  all_sections,
  recette_id,
}) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Create the string that will be displayed as the list of allergene for the ingredient

  return (
    <tr>
      {/* Purchase modal for not in edit mode */}
      {!is_edit ? (
        <td className={"col-1"}>
          <PurchaseIngredientHelper
            ingredient={ingredient}
            onClose={() => setShowPurchaseModal(false)}
            show={showPurchaseModal}
          ></PurchaseIngredientHelper>
        </td>
      ) : null}
      {/* Quantity and Unit */}
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
      {/* Name as a link to access ingredient detail page */}
      <td className={"col-7"} style={{ verticalAlign: "middle" }}>
        <Link href={"/ingredients/" + ingredient.ingredient_id}>
          {ingredient.name}
        </Link>
        {ingredient.note ? " (" + ingredient.note + ")" : null}
      </td>
      {/* All the buttons to edit if we are in edit mode
      OR
      an Allergene modal and the price of the ingredient if not if not */}
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
              recette_id={recette_id}
              component={ingredient}
            ></RecetteComponentModifier>
          </td>
          <td className={"col-1"} style={{ verticalAlign: "middle" }}>
            <DeleteButton
              element={ingredient}
              is_ingredient={true}
              recette_id={recette_id}
            ></DeleteButton>
          </td>
        </>
      ) : (
        <>
          <td className={"col-1"}>
            <div>
              <div>
                {ingredient.allergenes.length > 0 ? (
                  <AllergenesPopover object={ingredient}></AllergenesPopover>
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
