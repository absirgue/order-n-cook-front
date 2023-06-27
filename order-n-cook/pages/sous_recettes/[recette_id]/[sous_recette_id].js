import Link from "next/link";
import AllRecetteIngredientsDisplay from "../../../components/Recettes/page_elements/all_ingredients_display";
import GeneralRecetteDataDisplay from "../../../components/Recettes/page_elements/general_recette_data_display";
import AllSousRecettesDisplay from "../../../components/Recettes/page_elements/all_sous_recettes_display";
import ProgressionDisplay from "../../../components/Recettes/page_elements/all_progression_elements_display";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
} from "reactstrap";
import { useState } from "react";

async function getRecetteData(id) {
  const endpoint = `http://127.0.0.1:8000/api/recettes/${id}/`;
  const data = await fetch(endpoint);
  return await data.json();
}

export const getServerSideProps = async (context) => {
  const page_data = await getRecetteData(context.params?.sous_recette_id);
  page_data["recette_id"] = context.params?.recette_id;

  return {
    props: {
      page_data,
    },
  };
};

export default function SingleRecettePage({ page_data }) {
  //   return;
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center pt-2">
      <div className="col-11 d-flex flew-row justify-content-between mb-4">
        <div className="d-flex flex-row justify-content-start col-2">
          <Link href={"/recettes/" + page_data.recette_id}>
            {"< Retourner à la recette"}
          </Link>
        </div>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center col-lg-8 col-11">
        <div className="col-11 d-flex flex-row justify-content-center">
          <div className="col-1"></div>
          <div className="d-flex flex-column justify-content-center align-items-center mb-3 col-10">
            <h4 style={{ marginBottom: "0px" }}>{page_data.name}</h4>
            <div className="col-12 d-flex flez-row justify-content-center">
              {page_data.selected_for_menu ? (
                <p
                  className="align-self-center me-4"
                  style={{
                    color: "#f19494",
                    marginBottom: "0px",
                    marginLeft: "15px",
                  }}
                >
                  (à la carte)
                </p>
              ) : null}
              {page_data.selected_for_next_menu ? (
                <p
                  className="align-self-center me-4"
                  style={{
                    color: "#77af85",
                    marginBottom: "0px",
                    marginLeft: "15px",
                  }}
                >
                  (à la prochaine carte)
                </p>
              ) : null}
            </div>
            {page_data.is_to_modify ? (
              <div className="col-12 d-flex flex-row justify-content-center align-items-baseline">
                <i
                  className="me-2"
                  style={{
                    marginBottom: "0px",
                    fontWeight: "800",
                    color: "red",
                  }}
                >
                  À Modifier
                </i>
              </div>
            ) : null}
          </div>
        </div>

        <GeneralRecetteDataDisplay
          recette={page_data}
        ></GeneralRecetteDataDisplay>

        {/* <div className="col-12 d-flex flex-row justify-content-center">
          <PricingInformationComponent
            title={"Prix de revient H.T."}
            value={page_data.ingredients_cost}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Taux de TVA"}
            value={page_data.tva}
            is_tva={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Coefficient"}
            value={page_data.coefficient}
            is_coefficient={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Prix de vente H.T."}
            value={page_data.selling_price_ht}
            is_total_price={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Prix de vente T.T.C."}
            value={page_data.selling_price_ttc}
            is_total_price={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Prix de vente unitaire TTC"}
            value={page_data.unit_selling_price_ttc}
          ></PricingInformationComponent>
        </div> */}
        <div className="col-lg-11 col-12">
          {/* Ingrédients */}
          <AllRecetteIngredientsDisplay
            recette={page_data}
          ></AllRecetteIngredientsDisplay>
          {/* Sous recettes */}
          <AllSousRecettesDisplay recette={page_data}></AllSousRecettesDisplay>
          {/* Progression */}
          <ProgressionDisplay recette={page_data}></ProgressionDisplay>
        </div>
      </div>
    </div>
  );
}
