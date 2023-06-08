import React, { useState } from "react";
import Link from "next/link";
import RecetteComponentModifier from "../edit_only/modification_buttons/recette_component_modifier";
import DeleteButton from "../edit_only/modification_buttons/delete_button";
import AllergenesPopover from "../granular_elements/allergenes_popover";

/**
 * Item to show a SousRecette as part of a list of multiple SousRecette. Enables the navigation to the
 * page showing details for this sous recette.
 * @param sous_recette -> the sous recette to show
 * @param is_edit -> if the tool set to edit a sous recette should be shown or not
 *  @param recette_id -> id of the recette this SousRecette is linekd to
 */
const SousRecetteListItem = ({ sous_recette, is_edit = false, recette_id }) => {
  console.log("SOUS RECETTE");
  console.log(sous_recette);

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
        <Link
          href={
            "/sous_recettes/" + recette_id + "/" + sous_recette.sous_recette_id
          }
        >
          {sous_recette.name}
        </Link>
        {sous_recette.note ? " (" + sous_recette.note + ")" : null}
      </td>
      {is_edit ? (
        <>
          <td className={"col-1"}>{/* Empty on purpose */}</td>
          <td className={"col-1"}>
            <RecetteComponentModifier
              recette_id={recette_id}
              component={sous_recette}
              is_sous_recette={true}
            ></RecetteComponentModifier>
          </td>
          <td className={"col-1"}>
            <DeleteButton
              element={sous_recette}
              is_sous_recette={true}
              recette_id={recette_id}
            ></DeleteButton>
          </td>
        </>
      ) : (
        <>
          <td className={"col-1"}>
            <div>
              <div>
                {sous_recette.allergenes.length > 0 ? (
                  <div className="d-flex flex-row justify-content-end">
                    <AllergenesPopover
                      object={sous_recette}
                    ></AllergenesPopover>
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
