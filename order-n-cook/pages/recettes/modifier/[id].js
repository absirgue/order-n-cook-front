import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import Link from "next/link";
import AllRecetteIngredientsDisplay from "../../../components/Recettes/page_elements/all_ingredients_display";
import GeneralRecetteDataDisplay from "../../../components/Recettes/page_elements/general_recette_data_display";
import AllSousRecettesDisplay from "../../../components/Recettes/page_elements/all_sous_recettes_display";
import ProgressionDisplay from "../../../components/Recettes/page_elements/all_progression_elements_display";
import RecetteName from "../../../components/Recettes/page_elements/edit_only/granular_displays/recette_name";
const fetcher = (url) => fetch(url).then((res) => res.json());

/**
 * Page to edit a Recette.
 */
export default function EditRecettePage() {
  const router = useRouter();
  const { id } = router.query;

  // Use a ternary operator to only fetch the data when the ID isn't undefined
  const { data, error } = useSWR(
    id ? `http://127.0.0.1:8000/api/recettes/${id}/` : null,
    fetcher
  );

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
              <RecetteName recette={data}></RecetteName>
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
