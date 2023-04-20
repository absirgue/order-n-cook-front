import Link from "next/link";
import AllRecetteIngredientsDisplay from "../../components/Recettes/page_elements/all_ingredients_display";
import GeneralRecetteDataDisplay from "../../components/Recettes/page_elements/general_recette_data_display";
import AllSousRecettesDisplay from "../../components/Recettes/page_elements/all_sous_recettes_display";
import ProgressionDisplay from "../../components/Recettes/page_elements/all_progression_elements_display";
import SeasonnalityDisplay from "../../components/Ingredients/Ingredients/page_elements/seasonnality_display";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import { useState } from "react";
function getRecetteData(id) {
  return {
    id: 1,
    name: "Soupe de poisson",
    quantity: 1,
    unit: "littre",
    season: [
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
      true,
    ],
    genres: [
      { id: 1, name: "français" },
      { id: 2, name: "marseille" },
      { id: 3, name: "mijoté" },
    ],
    category: "plat",
    tastes: [{ id: 1, name: "doux" }],
    duration: 75,
    selected_for_menu: true,
    selling_price_ht: 24.8,
    selling_price_ttc: 35.6,
    unit_selling_price_ttc: 35.6,
    ingredients_cost: 9.87,
    coefficient: 3.2,
    allergenes: "noix",
    tva: 10,
    ingredients: [
      {
        id: 1,
        name: "Fraise",
        quantity: 45,
        unit: "unités",
        // section: 0,
        note: "gariguettes de préférence",
        allergenes: [],
        cost: 1.3,
      },
      {
        id: 6,
        name: "Framboise",
        quantity: 5,
        unit: "hectogramme",
        section: 0,
        allergenes: [],
        cost: 0.9,
      },
      {
        id: 3,
        name: "côte de boeuf",
        quantity: 1,
        section: 0,
        allergenes: [{ id: 1, name: "inventé" }],
        cost: 3,
      },
      {
        id: 5,
        name: "Carotte",
        section: 1,
        allergenes: [
          { id: 1, name: "inventé" },
          { id: 2, name: "créé" },
        ],
        cost: 0.2,
      },
    ],
    sous_recette: [
      // {
      //   name: "condiment betterave",
      //   quantity: 300,
      //   unit: "millilittres",
      //   id: 2,
      //   allergenes: [{ id: 1, name: "lactose" }],
      //   cost: 4,
      // },
    ],
    sections: [
      { number: 0, name: "Préparation inventée numéro 1" },
      { number: 1, name: "préparation inventée numéro 2" },
    ],
    progression_elements: [
      // {
      //   id: 1,
      //   rank: 0,
      //   text: "L1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      //   section: 0,
      // },
      // {
      //   id: 2,
      //   rank: 1,
      //   text: "L2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      //   section: 0,
      // },
      // {
      //   id: 3,
      //   rank: 2,
      //   text: "L3: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      //   section: 0,
      // },
      // {
      //   id: 4,
      //   rank: 3,
      //   text: "L4: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      //   section: 0,
      // },
      // {
      //   id: 5,
      //   rank: 0,
      //   text: "L5: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      //   section: 1,
      // },
      // {
      //   id: 6,
      //   rank: 1,
      //   text: "L6: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      //   section: 1,
      // },
      // {
      //   id: 7,
      //   rank: 2,
      //   text: "L7: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      //   section: 1,
      // },
      {
        id: 8,
        rank: 3,
        text: "L8:bore et dolore magna aliqua.",
        // section: 1,
      },
    ],
  };
}

export const getStaticProps = async (context) => {
  //   const recetteId = context.params?.id;
  const recetteData = getRecetteData();
  return {
    props: {
      recetteData,
    },
  };
};

export const getStaticPaths = async () => {
  const data = { stars: [{ id: "1" }, { id: "6" }] };
  const pathsWithParams = data.stars.map((star) => ({
    params: { id: star.id },
  }));

  return {
    paths: pathsWithParams,
    fallback: true,
  };
};

export default function SingleRecettePage({ recetteData }) {
  const deleteRecette = () => {
    alert("Suppression");
  };
  const [showTools, setShowTools] = useState(false);

  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center pt-2">
      <div className="col-11 d-flex flew-row justify-content-between mb-4">
        <div className="d-flex flex-row justify-content-start col-4">
          <Link href="/recettes/toutes">{"< Voir toutes les recettes"}</Link>
        </div>
        <div className="d-flex flex-row justify-content-end col-8">
          {showTools ? (
            <>
              <Button
                className="me-4"
                style={{
                  textDecoration: "underline",
                  color: "#086EFD",
                  backgroundColor: "transparent",
                  border: 0,
                }}
                onClick={() => setShowTools(false)}
              >
                {"Ranger les outils >"}
              </Button>
              <Button
                className="btn-danger me-4"
                onClick={() => {
                  if (
                    window.confirm(
                      "Êtes-vous sûr de vouloir supprimer cette recette ?"
                    )
                  )
                    deleteRecette();
                }}
              >
                Supprimer
              </Button>
              <Button
                className="btn-success me-4"
                onClick={() => {
                  window.location.reload(false);
                  recetteData.selected_for_menu =
                    !recetteData.selected_for_menu;
                }}
              >
                {recetteData.selected_for_menu
                  ? "Retirer de la carte"
                  : "Marquer à la carte"}
              </Button>
              <Button className="btn-primary me-4">🛒 Commander</Button>
              <Button className="btn-secondary">🖨 Imprimer</Button>
            </>
          ) : (
            <Button
              style={{
                textDecoration: "underline",
                color: "#086EFD",
                backgroundColor: "transparent",
                border: 0,
              }}
              onClick={() => setShowTools(true)}
            >
              {"< Montrer les outils"}
            </Button>
          )}
        </div>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center col-lg-8 col-11">
        <div className="col-11 d-flex flex-row justify-content-center">
          <div className="col-1"></div>
          <div className="d-flex flex-column justify-content-center align-items-center mb-3 col-10">
            <h4 style={{ marginBottom: "0px" }}>{recetteData.name}</h4>
            {recetteData.selected_for_menu ? (
              <p
                className="align-self-center"
                style={{
                  color: "#f19494",
                  marginBottom: "0px",
                  marginLeft: "15px",
                }}
              >
                (à la carte)
              </p>
            ) : null}
          </div>
          <div className="col-1 d-flex flex-row justify-content-end align-items-start">
            <Link
              className="emoji_button"
              style={{ textDecoration: "none" }}
              href={"/recettes/modifier/" + recetteData.id}
            >
              Modifier
            </Link>
          </div>
        </div>

        <GeneralRecetteDataDisplay
          recette={recetteData}
        ></GeneralRecetteDataDisplay>

        {/* <div className="col-12 d-flex flex-row justify-content-center">
          <PricingInformationComponent
            title={"Prix de revient H.T."}
            value={recetteData.ingredients_cost}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Taux de TVA"}
            value={recetteData.tva}
            is_tva={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Coefficient"}
            value={recetteData.coefficient}
            is_coefficient={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Prix de vente H.T."}
            value={recetteData.selling_price_ht}
            is_total_price={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Prix de vente T.T.C."}
            value={recetteData.selling_price_ttc}
            is_total_price={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Prix de vente unitaire TTC"}
            value={recetteData.unit_selling_price_ttc}
          ></PricingInformationComponent>
        </div> */}
        <div className="col-lg-11 col-12">
          <div className="col-12 d-flex flex-column justify-content-start mt-3 mb-3">
            {recetteData.allergenes ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-baseline">
                <i className="me-2" style={{ marginBottom: "0px" }}>
                  Allergènes:
                </i>
                <p style={{ marginBottom: "0px" }}>{recetteData.allergenes}</p>
              </div>
            ) : (
              <i style={{ marginBottom: "0px" }}>Aucun allergène</i>
            )}
            <div className="col-12 d-flex flex-row justify-content-start align-items-center">
              <i className="me-2" style={{ marginBottom: "0px" }}>
                Saisonnalité:
              </i>
              <div className="col-5">
                <SeasonnalityDisplay
                  ingredient_data={recetteData}
                ></SeasonnalityDisplay>
              </div>
            </div>
          </div>
          {/* Ingrédients */}
          <AllRecetteIngredientsDisplay
            recette={recetteData}
          ></AllRecetteIngredientsDisplay>
          {/* Sous recettes */}
          <AllSousRecettesDisplay
            recette={recetteData}
          ></AllSousRecettesDisplay>
          {/* Progression */}
          <ProgressionDisplay recette={recetteData}></ProgressionDisplay>
        </div>
      </div>
    </div>
  );
}
