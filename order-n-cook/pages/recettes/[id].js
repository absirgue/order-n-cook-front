import Link from "next/link";
import AllRecetteIngredientsDisplay from "../../components/Recettes/page_elements/all_ingredients_display";
import GeneralRecetteDataDisplay from "../../components/Recettes/page_elements/general_recette_data_display";
import AllSousRecettesDisplay from "../../components/Recettes/page_elements/all_sous_recettes_display";
import ProgressionDisplay from "../../components/Recettes/page_elements/all_progression_elements_display";
import useSWR from "swr";
import { useRouter } from "next/router";
import RecetteTools from "../../components/Recettes/page_elements/recette_tools";

const fetcher = (url) => fetch(url).then((res) => res.json());
/**
 * Page to display RecetteDetails
 */
export default function RecetteDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  // Use a ternary operator to only fetch the data when the ID isn't undefined
  const { data: recette, error } = useSWR(
    id ? `http://127.0.0.1:8000/api/general/recettes/${id}/` : null,
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
  if (!recette) return <div>Chargement en cours ...</div>;

  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center pt-2">
      <div className="col-11 d-flex flew-row justify-content-between mb-4">
        <div className="d-flex flex-row justify-content-start col-2">
          <Link href="/recettes/toutes">{"< Voir toutes les recettes"}</Link>
        </div>
        <div className="d-flex flex-row justify-content-end col-10 flex-wrap align-content-between">
          <RecetteTools recette={recette}></RecetteTools>
        </div>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center col-lg-8 col-11">
        <div className="col-11 d-flex flex-row justify-content-center">
          <div className="col-1"></div>
          <div className="d-flex flex-column justify-content-center align-items-center mb-3 col-10">
            <h4 style={{ marginBottom: "0px" }}>{recette.name}</h4>
            {/* Showing selected_for_menu and selected_for_next_menu */}
            <div className="col-12 d-flex flez-row justify-content-center">
              {recette.selected_for_menu ? (
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
              {recette.selected_for_next_menu ? (
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
            {/* Show is_to_modify */}
            {recette.is_to_modify ? (
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
              href={"/recettes/modifier/" + recette.id}
            >
              Modifier
            </Link>
          </div>
        </div>

        <GeneralRecetteDataDisplay
          recette={recette}
        ></GeneralRecetteDataDisplay>
        <div className="col-lg-11 col-12">
          {/* Ingrédients */}
          <AllRecetteIngredientsDisplay
            recette={recette}
          ></AllRecetteIngredientsDisplay>
          {/* Sous recettes */}
          <AllSousRecettesDisplay recette={recette}></AllSousRecettesDisplay>
          {/* Progression */}
          <ProgressionDisplay recette={recette}></ProgressionDisplay>
        </div>
      </div>
    </div>
  );
}
