import SeasonnalityDisplay from "../../Ingredients/Ingredients/page_elements/seasonnality_display";
import {
  get_taste_string,
  get_genre_string,
  get_formatted_duration,
} from "./helper_functions/general_recette_data";
import GeneralRecetteDataModify from "./edit_only/general_recette_data_modify";

/**
 * Shows general information for a Recette and handles switching between edit mode and non-edit mode.
 *
 * @param recette the Recette on display
 * @param is_edit boolean conditionning if edit mode should be shown or just normal mode (defaults to normal mode)
 */
const GeneralRecetteDataDisplay = ({ recette, is_edit = false }) => {
  return (
    <>
      {is_edit ? (
        <GeneralRecetteDataModify recette={recette}></GeneralRecetteDataModify>
      ) : (
        <>
          <div className="d-flex flex-row justify-content-between col-lg-10 col-12">
            <div className="d-flex flex-column justify-content-start col-6 align-items-start">
              <div className="col-12 d-flex flex-row justify-content-start align-items-center flex-wrap">
                <p
                  className="col-5 me-2"
                  style={{ fontSize: "14px", textAlign: "end" }}
                >
                  Quantité:
                </p>
                <p style={{ fontSize: "16px" }}>
                  {(recette.quantity ? recette.quantity : "?") +
                    " " +
                    (recette.unit ? recette.unit : "")}
                </p>
              </div>

              {recette.duration ? (
                <div className="col-12 d-flex flex-row justify-content-start align-items-center flex-wrap">
                  <p
                    className="col-5 me-2"
                    style={{ fontSize: "14px", textAlign: "end" }}
                  >
                    Temps de cuisson:
                  </p>
                  <p style={{ fontSize: "16px" }}>
                    {get_formatted_duration(recette)}
                  </p>
                </div>
              ) : null}
              {recette.temperature ? (
                <div className="col-12 d-flex flex-row justify-content-start align-items-center flex-wrap">
                  <p
                    className="col-5 me-2"
                    style={{ fontSize: "14px", textAlign: "end" }}
                  >
                    Température de cuisson:
                  </p>
                  <p style={{ fontSize: "16px" }}>{recette.temperature}</p>
                </div>
              ) : null}
              {recette.sous_vide_pression ? (
                <div className="col-12 d-flex flex-row justify-content-start align-items-center flex-wrap">
                  <p
                    className="col-5 me-2"
                    style={{ fontSize: "14px", textAlign: "end" }}
                  >
                    Sous vide - pression:
                  </p>
                  <p style={{ fontSize: "16px" }}>
                    {" "}
                    {recette.sous_vide_pression}
                  </p>
                </div>
              ) : null}
              {recette.sous_vide_soudure ? (
                <div className="col-12 d-flex flex-row justify-content-start align-items-center flex-wrap">
                  <p
                    className="col-5 me-2"
                    style={{ fontSize: "14px", textAlign: "end" }}
                  >
                    Sous vide - soudure:
                  </p>
                  <p style={{ fontSize: "16px" }}>
                    {" "}
                    {recette.sous_vide_soudure}
                  </p>
                </div>
              ) : null}
            </div>
            <div className="d-flex flex-column justify-content-start col-6 align-items-end">
              <div
                className="col-12 d-flex flex-row justify-content-start align-items-center flex-wrap"
                style={
                  recette.all_costs_are_known
                    ? null
                    : { color: "grey", fontStyle: "italic" }
                }
              >
                <p
                  className="col-8 me-2"
                  style={{
                    fontSize: "14px",
                    textAlign: "end",
                  }}
                >
                  Prix de revient:
                </p>
                <p style={{ fontSize: "16px" }}>
                  {recette.cost_ingredients
                    ? recette.cost_ingredients + "€"
                    : "-"}
                  {recette.all_costs_are_known ? null : "*"}
                </p>
              </div>
              <div className="col-12 d-flex flex-row justify-content-start align-items-center flex-wrap">
                <p
                  className="col-8 me-2"
                  style={{ fontSize: "14px", textAlign: "end" }}
                >
                  Taux de TVA:
                </p>
                <p style={{ fontSize: "16px" }}>
                  {recette.tva ? recette.tva + "%" : "?"}
                </p>
              </div>
              <div className="col-12 d-flex flex-row justify-content-start align-items-center flex-wrap">
                <p
                  className="col-8 me-2"
                  style={{ fontSize: "14px", textAlign: "end" }}
                >
                  Coefficient:
                </p>
                <p style={{ fontSize: "16px" }}>
                  {recette.coefficient ? recette.coefficient : "?"}
                </p>
              </div>
              {recette.ht_selling_price &&
              recette.ht_selling_price != "null" ? (
                <p
                  style={
                    { fontSize: "14px", marginBottom: "0px" } +
                    recette.all_costs_are_known
                      ? { color: "grey", fontStyle: "italic" }
                      : null
                  }
                >
                  Prix de vente HT
                  {recette.quantity && recette.unit
                    ? " (pour " + recette.quantity + " " + recette.unit + ")"
                    : null}
                  :{" "}
                  <span style={{ fontSize: "16px" }}>
                    {recette.ht_selling_price + "€"}
                    {recette.all_costs_are_known ? null : "*"}
                  </span>
                </p>
              ) : null}
              {recette.ttc_selling_price &&
              recette.ttc_selling_price != "null" ? (
                <p
                  style={
                    { fontSize: "14px", marginBottom: "0px" } +
                    recette.all_costs_are_known
                      ? { color: "grey", fontStyle: "italic" }
                      : null
                  }
                >
                  Prix de vente TTC
                  {recette.quantity && recette.unit
                    ? "(pour " + recette.quantity + " " + recette.unit + ")"
                    : null}
                  :{" "}
                  <span style={{ fontSize: "16px", fontWeight: "500" }}>
                    {recette.ttc_selling_price + "€"}
                    {recette.all_costs_are_known ? null : "*"}
                  </span>
                </p>
              ) : null}
              {recette.ttc_unit_selling_price &&
              recette.ttc_unit_selling_price != "null" ? (
                <p
                  style={
                    { fontSize: "14px", marginBottom: "0px" } +
                    recette.all_costs_are_known
                      ? { color: "grey", fontStyle: "italic" }
                      : null
                  }
                >
                  Prix de vente unitaire TTC:{" "}
                  <span style={{ fontSize: "16px", fontWeight: "500" }}>
                    {recette.ttc_unit_selling_price + "€"}
                    {recette.all_costs_are_known ? null : "*"}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
          <div className="col-11 d-flex flex-column justify-content-start mt-3 mb-3">
            {recette.allergenes.length > 0 ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-baseline">
                <i className="col-2 me-2" style={{ textAlign: "end" }}>
                  Allergènes:
                </i>
                <p>
                  {recette.allergenes
                    .reduce(
                      (accumultor, allergene) =>
                        accumultor + allergene.name + "; ",
                      ""
                    )
                    .slice(0, -2)}
                </p>
              </div>
            ) : (
              <i className="col-2" style={{ textAlign: "end" }}>
                Aucun allergène
              </i>
            )}
            {recette.season_start && recette.season_end ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-basline">
                <i className="col-2 me-2" style={{ textAlign: "end" }}>
                  Saisonnalité:
                </i>
                <p>
                  de {recette.season_start} à {recette.season_end}
                </p>
              </div>
            ) : (
              <i className="col-2" style={{ textAlign: "end" }}>
                Saisonnalité non renseignée
              </i>
            )}
            {recette.genres ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-baseline">
                <i className="col-2 me-2" style={{ textAlign: "end" }}>
                  Genres:
                </i>
                <div className="col-5">
                  <p style={{ marginBottom: "0px" }}>
                    {get_genre_string(recette)}
                  </p>
                </div>
              </div>
            ) : (
              <i className="col-2" style={{ textAlign: "end" }}>
                Aucun genre renseigné
              </i>
            )}
            {recette.genres ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                <i className="col-2 me-2" style={{ textAlign: "end" }}>
                  Goûts:
                </i>
                <div className="col-5">
                  <p style={{ marginBottom: "0px" }}>
                    {get_taste_string(recette)}
                  </p>
                </div>
              </div>
            ) : (
              <i className="col-2" style={{ textAlign: "end" }}>
                Aucun goût renseigné
              </i>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default GeneralRecetteDataDisplay;
