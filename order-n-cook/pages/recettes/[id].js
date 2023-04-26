import Link from "next/link";
import AllRecetteIngredientsDisplay from "../../components/Recettes/page_elements/all_ingredients_display";
import GeneralRecetteDataDisplay from "../../components/Recettes/page_elements/general_recette_data_display";
import AllSousRecettesDisplay from "../../components/Recettes/page_elements/all_sous_recettes_display";
import ProgressionDisplay from "../../components/Recettes/page_elements/all_progression_elements_display";
import useSWR, { useSWRConfig } from "swr";
import {Redirect} from "react-router-dom"
import { useRouter } from "next/router";
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
function getRecetteData(id) {
  return {
    id: 1,
    name: "Soupe de poisson",
    quantity: 1,
    unit: "littre",
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
    sous_vide_soudure: 3,
    temperature: 120,
    sous_vide_pression: 2,
    selected_for_next_menu: true,
    ingredients_cost: 9.87,
    coefficient: 3.2,
    is_to_modify: true,
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
        section: 1,
      },
      {
        id: 2,
        rank: 1,
        text: "L2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 1,
      },
      {
        id: 3,
        rank: 2,
        text: "L3: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 1,
      },
      {
        id: 4,
        rank: 3,
        text: "L4: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 1,
      },
      {
        id: 5,
        rank: 0,
        text: "L5: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 0,
      },
      {
        id: 6,
        rank: 1,
        text: "L6: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 0,
      },
      {
        id: 7,
        rank: 2,
        text: "L7: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        section: 0,
      },
      {
        id: 8,
        rank: 3,
        text: "L8:bore et dolore magna aliqua.",
        section: 0,
      },
    ],
  };
}

// export const getStaticProps = async (context) => {
//   const recetteID = context.params?.id;
//   const res = await fetch(`http://127.0.0.1:8000/api/recettes/` + recetteID);

//   const data = await res.json();
//   return {
//     props: {
//       data,
//     },
//   };
// };

// export const getStaticPaths = async () => {
//   const res = await fetch(`http://127.0.0.1:8000/api/recettes/`);
//   const allRecettesData = await res.json();
//   const pathsWithParams = allRecettesData.map((recette) => ({
//     params: { id: recette.id.toString() },
//   }));

//   return {
//     paths: pathsWithParams,
//     fallback: true,
//   };
// };

async function sendRequest(url, { arg }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SingleRecettePage() {
  const deleteRecette = () => {
    alert("Suppression");
  };
  const [redirect,setRedirect] = useState(null)
  const [showTools, setShowTools] = useState(false);
  const [autresOutilsOpen, setAutresOutilsDropdownOpen] = useState(false);
  const [cartesOutilsOpen, setCartesOutilsOpen] = useState(false);
  const toggleAutresOutils = () =>
    setAutresOutilsDropdownOpen((prevState) => !prevState);
  const toggleCarteOutils = () =>
    setCartesOutilsOpen((prevState) => !prevState);
  const router = useRouter();
  const { id } = router.query;

  const duplicate_recette = async () => {
    let endpoint = "http://127.0.0.1:8000/api/duplicate_recette/"+data.id+"/";
    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "GET",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);
    if (response.status == 201) {
      alert("La recette a bien été dupliquée !");
    } else {
      alert("Une erreur est survenue. Merci de réessayer plus tard.");
    }
  }

  const delete_recette = async () => {
    let endpoint = "http://127.0.0.1:8000/api/recettes/"+data.id+"/";
    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "DELETE",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);
  
    if (response.status == 204) {
      window.location.href = '/recettes/toutes'
    } else {
      alert("Une erreur est survenue. Merci de réessayer plus tard.");
    }
  }

  // Use a ternary operator to only fetch the data when the ID isn't undefined
  const { data, error } = useSWR(
    id ? `http://127.0.0.1:8000/api/recettes/${id}/` : null,
    fetcher
  );

  const { mutate } = useSWRConfig();

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

  if (error) {
    return (
      <div>
        Une erreur est survenue lors du chargement de la page. Si cette erreur
        persiste, contactez le service technique.
      </div>
    );
  }
  if (!data) return <div>Chargement en cours ...</div>;

  console.log(data);

  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center pt-2">
      <div className="col-11 d-flex flew-row justify-content-between mb-4">
        <div className="d-flex flex-row justify-content-start col-2">
          <Link href="/recettes/toutes">{"< Voir toutes les recettes"}</Link>
        </div>
        <div className="d-flex flex-row justify-content-end col-10 flex-wrap align-content-between">
          {showTools ? (
            <>
              <Button
                className="me-4 mb-1"
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
                className="btn-danger me-4 mb-1"
                onClick={() => {
                  if (
                    window.confirm(
                      "Êtes-vous sûr de vouloir supprimer cette recette ?"
                    )
                  )
                    if (
                      window.confirm(
                        "Cette suppression sera définitive. Confirmez-vous vouloir supprimer cette recette ?"
                      )
                    )
                    delete_recette();
                }}
              >
                Supprimer
              </Button>
              <UncontrolledDropdown
                className={"mb-1 me-4"}
                isOpen={autresOutilsOpen}
                toggle={toggleAutresOutils}
                id="autre_outils"
              >
                <DropdownToggle
                  htmlFor="autre_outils"
                  className={"btn-secondary"}
                  caret
                >
                  Autres outils
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      alert("imprimer");
                    }}
                  >
                    Imprimer
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      duplicate_recette()
                    }}
                  >
                    Dupliquer
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <Dropdown
                className={"mb-1 me-4"}
                isOpen={cartesOutilsOpen}
                toggle={toggleCarteOutils}
                id="cartes"
              >
                <DropdownToggle className={"btn-success"} caret>
                  Gérer les cartes
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      update_recette_data_handler(
                        "selected_for_menu",
                        !data.selected_for_menu
                      );
                    }}
                  >
                    {data.selected_for_menu
                      ? "Retirer de la carte"
                      : "Marquer à la carte"}
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      update_recette_data_handler(
                        "selected_for_next_menu",
                        !data.selected_for_next_menu
                      );
                    }}
                  >
                    {data.selected_for_next_menu
                      ? "Retirer de la prochaine carte"
                      : "Marquer à la prochaine carte"}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Button
                className="btn-secondary me-4 mb-1"
                onClick={() => {
                  update_recette_data_handler(
                    "is_to_modify",
                    !data.is_to_modify
                  );
                }}
              >
                {data.is_to_modify
                  ? "Modifications faites"
                  : "Marquer à modifier"}
              </Button>

              <Button className="btn-primary me-4 mb-1">🛒 Commander</Button>
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
            <h4 style={{ marginBottom: "0px" }}>{data.name}</h4>
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
            {data.is_to_modify ? (
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
          <div className="col-1 d-flex flex-row justify-content-end align-items-start">
            <Link
              className="emoji_button"
              style={{ textDecoration: "none" }}
              href={"/recettes/modifier/" + data.id}
            >
              Modifier
            </Link>
          </div>
        </div>

        <GeneralRecetteDataDisplay recette={data}></GeneralRecetteDataDisplay>

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
        <div className="col-lg-11 col-12">
          {/* Ingrédients */}
          <AllRecetteIngredientsDisplay
            recette={data}
          ></AllRecetteIngredientsDisplay>
          {/* Sous recettes */}
          <AllSousRecettesDisplay recette={data}></AllSousRecettesDisplay>
          {/* Progression */}
          <ProgressionDisplay recette={data}></ProgressionDisplay>
        </div>
      </div>
    </div>
  );
}
