import { useState } from "react";
import Select from "react-select";
import SeasonnalityDisplay from "../../Ingredients/Ingredients/page_elements/seasonnality_display";
import {
  get_taste_string,
  get_genre_string,
  get_formatted_duration,
} from "./helper_functions/general_recette_data";
import GeneralRecetteDataModify from "./edit_only/general_recette_data_modify";

const GeneralRecetteDataDisplay = ({ recette, is_edit = false }) => {
  return (
    <>
      {is_edit ? (
        <GeneralRecetteDataModify recette={recette}></GeneralRecetteDataModify>
      ) : (
        <>
          <div className="d-flex flex-row justify-content-between col-8">
            <div className="d-flex flex-column justify-content-start col-4 align-items-start">
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Quantité:{" "}
                <span style={{ fontSize: "16px" }}>
                  {(recette.quantity ? recette.quantity:"?") + " " + (recette.unit ? recette.unit : "")}
                </span>
              </p>
              {recette.duration ? 
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Temps de cuisson:{" "}
                <span style={{ fontSize: "16px" }}>
                  {get_formatted_duration(recette)}
                </span>
              </p>:null}
              {recette.temperature ? 
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Température de cuisson:{" "}
                <span style={{ fontSize: "16px" }}>{recette.temperature}</span>
              </p>:null}
              {recette.sous_vide_pression ? 
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Sous vide - pression:{" "}
                <span style={{ fontSize: "16px" }}>
                  {recette.sous_vide_pression}
                </span>
              </p> : null}
              {recette.sous_vide_soudure ? 
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Sous vide - soudure:{" "}
                <span style={{ fontSize: "16px" }}>
                  {recette.sous_vide_soudure}
                </span>
              </p>:null}
            </div>
            <div className="d-flex flex-column justify-content-start col-6 align-items-end">
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Prix de revient:{" "}
                <span style={{ fontSize: "16px" }}>
                  {recette.cost_ingredients? recette.cost_ingredients + "€":"-"}
                </span>
              </p>
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Taux de TVA:{" "}
                <span style={{ fontSize: "16px" }}>{recette.tva ? recette.tva + "%" : "?"}</span>
              </p>
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Coefficient:{" "}
                <span style={{ fontSize: "16px" }}>{recette.coefficient ? recette.coefficient : "?"}</span>
              </p>
              {recette.ht_selling_price && recette.ht_selling_price!= "null" ? (
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Prix de vente HT (pour {recette.quantity + " " + recette.unit}
                ):{" "}
                <span style={{ fontSize: "16px" }}>
                  {recette.ht_selling_price + "€"}
                </span>
              </p>):null}
              {recette.ttc_selling_price && recette.ttc_selling_price!= "null" ? (
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Prix de vente TTC (pour {recette.quantity + " " + recette.unit}
                ):{" "}
                <span style={{ fontSize: "16px", fontWeight: "500" }}>
                  {recette.ttc_selling_price + "€"}
                </span>
              </p>):null}
              {recette.ttc_unit_selling_price && recette.ttc_unit_selling_price!= "null" ? (
                <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                  Prix de vente unitaire TTC:{" "}
                  <span style={{ fontSize: "16px", fontWeight: "500" }}>
                    {recette.ttc_unit_selling_price + "€"}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
          <div className="col-11 d-flex flex-column justify-content-start mt-3 mb-3">
            {recette.allergenes.length > 0 ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-baseline">
                <i className="me-2" style={{ marginBottom: "0px" }}>
                  Allergènes:
                </i>
                <p style={{ marginBottom: "0px" }}>{recette.allergenes.reduce((accumultor, allergene)=> accumultor + allergene.name + "; ","").slice(0, -2)}</p>
              </div>
            ) : (
              <i style={{ marginBottom: "0px" }}>Aucun allergène</i>
            )}
            {recette.season && recette.season.length > 0 ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                <i className="me-2" style={{ marginBottom: "0px" }}>
                  Saisonnalité:
                </i>
                <div className="col-5">
                  <SeasonnalityDisplay
                    ingredient_data={recette}
                  ></SeasonnalityDisplay>
                </div>
              </div>
            ) : (
              <i style={{ marginBottom: "0px" }}>Saisonnalité non renseignée</i>
            )}
            {recette.genres ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                <i className="me-2" style={{ marginBottom: "0px" }}>
                  Genres:
                </i>
                <div className="col-5">
                  <p style={{ marginBottom: "0px" }}>
                    {get_genre_string(recette)}
                  </p>
                </div>
              </div>
            ) : (
              <i style={{ marginBottom: "0px" }}>Aucun genre renseigné</i>
            )}
            {recette.genres ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                <i className="me-2" style={{ marginBottom: "0px" }}>
                  Goûts:
                </i>
                <div className="col-5">
                  <p style={{ marginBottom: "0px" }}>
                    {get_taste_string(recette)}
                  </p>
                </div>
              </div>
            ) : (
              <i style={{ marginBottom: "0px" }}>Aucun goût renseigné</i>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default GeneralRecetteDataDisplay;
