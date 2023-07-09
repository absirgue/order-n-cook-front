import { Button } from "reactstrap";
import DeliveryDaysDisplay from "../../../components/Fournisseurs/delivery_days_display";
import FournisseurProduitsDisplay from "../../../components/Fournisseurs/produits_display";
import useSWR from "swr";
import { useRouter } from "next/router";
import Link from "next/link";
import FournsiseurName from "../../../components/Fournisseurs/edit_only/granular/name_edit";
import EditFournisseurGeneralData from "../../../components/Fournisseurs/edit_only/granular/general_data_edit";
import AddProduit from "../../../components/Fournisseurs/edit_only/granular/add_produit";
function getIngredientData() {
  return {
    id: 1,
    name: "Anthès",
    adresse: "12 avenue de la Gare",
    address_line_2: "3e étage",
    postal_code: "12600",
    city: "Villefranche",
    department: "Aveyron",
    country: "France",
    client_code: "CECIESTEST",
    principal_phone_number: "0789654567",
    ordering_phone_number: "0719651567",
    // accounting_phone_number:"0719651567",
    principal_email: "anthes@test.org",
    ordering_email: "anthes@test.org",
    // cc_sales_email:"anthes@test.org",
    // last_time_to_order:"16h",
    category: "Crèmerie",
    specialty: "Maître Frommager",
    delivers_monday: true,
    delivers_tuesday: false,
    delivers_wednesday: false,
    delivers_thursday: false,
    delivers_friday: true,
    delivers_saturday: true,
    delivers_sunday: true,
    produits: [
      {
        ingredient: {
          name: "crème",
          labels: [
            { id: 1, name: "AOC" },
            { id: 2, name: "AOP" },
          ],
          id: 2,
          allergenes: [
            { id: 1, name: "noix" },
            { id: 2, name: "lactose" },
          ],
          category: "crémerie",
          sous_category: "crème",
        },
        real_unit: {
          quantity: 1,
          unit: "plaquette",
        },
        conversion_unit: {
          quantity: 250,
          unit: "gramme",
        },
        price: 5.5,
        kilogramme_price: 22,
        last_known_price: 5,
        date_last_known_price: "12/12/1492",
      },
      {
        ingredient: {
          name: "beurre",
          category: "crémerie",
          sous_category: "beurre",
          id: 2,
        },
        real_unit: {
          quantity: 1,
          unit: "kilogramme",
        },
        conversion_unit: {
          quantity: 250,
          unit: "gramme",
        },
        price: 15,
      },
      {
        ingredient: {
          name: "mozarella",
          category: "crémerie",
          sous_category: "frommage",
          id: 2,
        },
        real_unit: {
          quantity: 1,
          unit: "unité",
        },
        conversion_unit: {
          quantity: 300,
          unit: "gramme",
        },
        price: 4,
        kilogramme_price: 15,
        last_known_price: 4,
      },
      {
        ingredient: {
          name: "crème épaisse",
          labels: [{ id: 1, name: "AOC" }],
          category: "crémerie",
          sous_category: "crème",
          id: 2,
        },
        real_unit: {
          quantity: 1,
          unit: "pot",
        },
        conversion_unit: {
          quantity: 300,
          unit: "gramme",
        },
        price: 5.25,
        kilogramme_price: 22,
        last_known_price: 6,
      },
    ],
  };
}
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
        ></EditFournisseurGeneralData>
      </div>
      <div className={"col-6 d-flex justify-content-center"}></div>
      <div className="col-11 col-lg-10 d-flex flex-row justify-content-end">
        <AddProduit fournisseur_id={fournisseurData.id}></AddProduit>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center">
        {fournisseurData.produits ? (
          <FournisseurProduitsDisplay
            fournisseurIngredientsData={fournisseurData.produits}
            isEdit={true}
            fournisseur_id={fournisseurData.id}
            fournisseur_name={fournisseurData.name}
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
