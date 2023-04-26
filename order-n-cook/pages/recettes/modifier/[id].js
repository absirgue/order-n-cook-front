import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import Link from "next/link";
import AllRecetteIngredientsDisplay from "../../../components/Recettes/page_elements/all_ingredients_display";
import GeneralRecetteDataDisplay from "../../../components/Recettes/page_elements/general_recette_data_display";
import AllSousRecettesDisplay from "../../../components/Recettes/page_elements/all_sous_recettes_display";
import ProgressionDisplay from "../../../components/Recettes/page_elements/all_progression_elements_display";

function getRecetteData(id) {
  return {
    id: 1,
    name: "Soupe de poisson",
    quantity: 1,
    unit: "littre",
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
    sous_vide_soudure: 3,
    temperature: 120,
    season: [
      true,
      false,
      false,
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
    sous_vide_pression: 2,
    selling_price_ttc: 35.6,
    unit_selling_price_ttc: 35.6,
    ingredients_cost: 9.87,
    coefficient: 3.2,
    tva: 10,
    ingredients: [
      {
        id: 1,
        name: "Fraise",
        quantity: 45,
        unit: "unités",
        section: 0,
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
      {
        name: "condiment betterave",
        quantity: 300,
        unit: "millilittres",
        id: 2,
        allergenes: [{ id: 1, name: "lactose" }],
        cost: 4,
      },
    ],
    sections: [
      { number: 0, name: "Préparation inventée numéro 1", id: 1 },
      { number: 1, name: "préparation inventée numéro 2", id: 2 },
      { number: 2, name: "préparation inventée numéro 3", id: 3 },
    ],
    progression_elements: [
      {
        id: 1,
        rank: 0,
        text: "L1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 0,
      },
      {
        id: 2,
        rank: 1,
        text: "L2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 0,
      },
      {
        id: 3,
        rank: 2,
        text: "L3: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 0,
      },
      {
        id: 4,
        rank: 3,
        text: "L4: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 0,
      },
      {
        id: 5,
        rank: 0,
        text: "L5: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 1,
      },
      {
        id: 6,
        rank: 1,
        text: "L6: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 1,
      },
      {
        id: 7,
        rank: 2,
        text: "L7: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 1,
      },
      {
        id: 8,
        rank: 3,
        text: "L8: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 1,
      },
    ],
  };
}

// export const getStaticProps = async (context) => {
//   //   const recetteId = context.params?.id;
//   const data = getRecetteData();
//   return {
//     props: {
//       data,
//     },
//   };
// };

// export const getStaticPaths = async () => {
//   const data = { stars: [{ id: "1" }, { id: "6" }] };
//   const pathsWithParams = data.stars.map((star) => ({
//     params: { id: star.id },
//   }));

//   return {
//     paths: pathsWithParams,
//     fallback: false,
//   };
// };

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SingleRecettePage() {
  const router = useRouter();
  const [new_data_inputted, set_new_data_inputted] = useState(false);
  const { id } = router.query;
  const { mutate } = useSWRConfig();

  // Use a ternary operator to only fetch the data when the ID isn't undefined
  const { data, error } = useSWR(
    id ? `http://127.0.0.1:8000/api/recettes/${id}/` : null,
    fetcher
  );

  const perform_update_request = async (field_to_change, value) => {
    let body_data = {};
    body_data[field_to_change] = value;
    const response = await fetch(`http://127.0.0.1:8000/api/recettes/${id}/`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body_data),
    });

    // Awaiting response.json()
    const resData = await response.json();

    // Return response data
    return resData;
  };
  const update_recette_data_handler = async (field_to_change, value) => {
    let new_data = { ...data };
    new_data[field_to_change] = value;
    const options = {
      optimisticData: new_data,
      rollbackOnError(error) {
        // If it's timeout abort error, don't rollback
        return error.name !== "AbortError";
      },
    };

    mutate(
      `http://127.0.0.1:8000/api/recettes/${id}/`,
      perform_update_request(field_to_change, value),
      options
    );
  };

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    if (event.target.recette_name.value) {
      update_recette_data_handler("name", event.target.recette_name.value);
    }
    set_new_data_inputted(false);
  };

  console.log(data);
  if (error) {
    return (
      <div>
        Une erreur est survenue lors du chargement de la page. Si cette erreur
        persiste, contactez le service technique.
      </div>
    );
  }
  if (!data) return <div>Chargement en cours ...</div>;

  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center pt-2">
      <div className="d-flex flex-column justify-content-center align-items-center col-lg-8 col-11">
        <div className="col-12 d-flex flex-row justify-content-center">
          <div className="col-11 d-flex flex-row justify-content-center">
            <div className="col-1"></div>
            <div className="d-flex flex-column justify-content-center align-items-center mb-3 col-10">
              <form
                className="col-12 d-flex flex-column justify-content-center"
                style={{
                  fontSize: "14px",
                  marginBottom: "0px",
                }}
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  name="recette_name"
                  style={{
                    textAlign: "center",
                    backgroundColor: "transparent",
                    fontSize: "22px",
                    border: 0,
                    color: "black",
                  }}
                  placeholder={data.name}
                  onChange={() => set_new_data_inputted(true)}
                ></input>
                <div className="col-12 d-flex flex-row justify-content-end mt-2">
                  {new_data_inputted ? (
                    <button className="btn btn-primary" type="submit">
                      Enregistrer
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="col-12 d-flex flez-row justify-content-center">
                {data.selected_for_menu ? (
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
                {data.selected_for_next_menu ? (
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
            </div>
            <div className="col-1 d-flex flex-row justify-content-end align-items-start">
              <Link
                className="emoji_button"
                style={{ textDecoration: "none" }}
                href={"/recettes/" + data.id}
              >
                Quiter
              </Link>
            </div>
          </div>
        </div>

        <GeneralRecetteDataDisplay
          recette={data}
          is_edit={true}
        ></GeneralRecetteDataDisplay>
        <div className="col-12">
          {/* <div className="col-12 d-flex flex-row justify-content-center">
          <PricingInformationComponent
            title={"Prix de revient H.T."}
            value={data.ingredients_cost}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Taux de TVA"}
            value={data.tva}
            is_tva={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Coefficient"}
            value={data.coefficient}
            is_coefficient={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Prix de vente H.T."}
            value={data.selling_price_ht}
            is_total_price={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Prix de vente T.T.C."}
            value={data.selling_price_ttc}
            is_total_price={true}
          ></PricingInformationComponent>
          <PricingInformationComponent
            title={"Prix de vente unitaire TTC"}
            value={data.unit_selling_price_ttc}
          ></PricingInformationComponent>
        </div> */}
          <div className="col-12">
            {/* Ingrédients */}
            <AllRecetteIngredientsDisplay
              recette={data}
              is_edit={true}
            ></AllRecetteIngredientsDisplay>
            {/* Sous recettes */}
            <AllSousRecettesDisplay
              recette={data}
              is_edit={true}
            ></AllSousRecettesDisplay>
            {/* Progression */}
            <ProgressionDisplay
              recette={data}
              is_edit={true}
            ></ProgressionDisplay>
          </div>
        </div>
      </div>
    </div>
  );
}
