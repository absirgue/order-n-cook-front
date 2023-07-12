import { Button } from "reactstrap";
import DeliveryDaysDisplay from "../../../components/Fournisseurs/delivery_days_display";
import FournisseurProduitsDisplay from "../../../components/Fournisseurs/produits_display";
import useSWR from "swr";
import { useRouter } from "next/router";
import Link from "next/link";
import FournsiseurName from "../../../components/Fournisseurs/edit_only/granular/name_edit";
import EditFournisseurGeneralData from "../../../components/Fournisseurs/edit_only/granular/general_data_edit";
import AddProduit from "../../../components/Fournisseurs/edit_only/granular/add_produit";

const fetcher = (url) => fetch(url).then((res) => res.json());
/**
 * Page to display Fournisseur details
 */
export default function EditFournisseurDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  async function deleteFournisseur() {
    let endpoint = `http://127.0.0.1:8000/api/fournisseurs/${id}/`;
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
      window.location.href = "/fournisseurs/tous";
    } else {
      alert("Une erreur est survenue. Merci de réessayer plus tard.");
    }
  }

  // Use a ternary operator to only fetch the data when the ID isn't undefined
  const { data: fournisseurData, error } = useSWR(
    id ? `http://127.0.0.1:8000/api/fournisseurs/${id}/` : null,
    fetcher
  );

  const mutate = () => window.location.reload();

  if (error) {
    return (
      <div>
        Une erreur est survenue lors du chargement de la page. Si cette erreur
        persiste, contactez le service technique.
      </div>
    );
  }
  if (!fournisseurData) return <div>Chargement en cours ...</div>;
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
      <div className={"d-flex flex-row mb-2 justify-content-center col-11"}>
        <div
          className={
            "d-flex flex-row justify-content-center col-11 align-items-center"
          }
        >
          <div className={"col-3 d-flex flex-row justify-content-end"}>
            {" "}
            <Button
              className="btn btn-danger"
              onClick={() => {
                if (
                  window.confirm(
                    "Voulez-vous supprimer le fournisseur " +
                      fournisseurData.name +
                      " ?"
                  )
                )
                  if (
                    window.confirm(
                      "La suppression sera définitive. Confirmez-vous vouloir supprimer le fournisseur " +
                        fournisseurData.name +
                        " ?"
                    )
                  )
                    deleteFournisseur;
              }}
            >
              Supprimer
            </Button>
          </div>
          <div
            className={
              "d-flex flex-column justify-content-center align-items-center col-8"
            }
          >
            <FournsiseurName fournisseur={fournisseurData}></FournsiseurName>
          </div>
          <div className={"col-3 d-flex flex-row justify-content-start"}>
            <Link href={"/fournisseurs/" + fournisseurData.id}>
              Quitter la modification
            </Link>
          </div>
        </div>
      </div>
      <div className={"d-flex flex-col justify-content-between col-8"}>
        <EditFournisseurGeneralData
          fournisseur={fournisseurData}
          mutate={mutate}
        ></EditFournisseurGeneralData>
      </div>
      <div className={"col-6 d-flex justify-content-center"}></div>
      <div className="col-11 col-lg-10 d-flex flex-row justify-content-end">
        <AddProduit
          fournisseur_id={fournisseurData.id}
          mutate={mutate}
        ></AddProduit>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center">
        {fournisseurData.produits ? (
          <FournisseurProduitsDisplay
            fournisseurIngredientsData={fournisseurData.produits}
            isEdit={true}
            fournisseur_id={fournisseurData.id}
            fournisseur_name={fournisseurData.name}
            mutate={mutate}
          ></FournisseurProduitsDisplay>
        ) : (
          <p>
            Aucun ingrédient n'a encore été renseigné pour ce fournisseur.
            Modifier la recette pour ajouter des ingrédients.
          </p>
        )}
      </div>
    </div>
  );
}
