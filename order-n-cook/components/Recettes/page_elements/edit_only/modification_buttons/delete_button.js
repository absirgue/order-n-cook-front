import { Button } from "reactstrap";
import { useSWRConfig } from "swr";

/**
 * This component allows to delete an element, whether a progression element, an ingredient, or a sous recette.
 * @param is_progression if the targetted element is a progression element
 * @param is_ingredient if the targetted element is an ingredient
 * @param is_sous_recette if the targetted element is a sous recette
 * @param element the targetted element
 * @param recette_id the id of the Recette on display
 * @returns
 */
const DeleteButton = ({
  is_progression = false,
  is_ingredient = false,
  is_sous_recette = false,
  element,
  recette_id,
}) => {
  const { mutate } = useSWRConfig();
  let delete_confirmation_text = "";
  if (is_progression) {
    delete_confirmation_text =
      "Êtes-vous sûr de vouloir supprimer cet élément de progression ?";
  } else if (is_sous_recette) {
    delete_confirmation_text =
      "Êtes-vous sûr de vouloir supprimer cette sous recette?";
  } else if (is_ingredient) {
    delete_confirmation_text =
      "Êtes-vous sûr de vouloir supprimer l'ingrédient \"" +
      element.name.toLowerCase() +
      '" de cette recette ?';
  }

  const deleteItem = async () => {
    console.log("ELEMENT");
    console.log(element);
    let endpoint = "http://127.0.0.1:8000/api/general/";
    if (is_ingredient) {
      endpoint += "recette_ingredients/";
    } else if (is_progression) {
      endpoint += "recette_progression/";
    }
    endpoint += element.id;
    console.log("ENDPOINT");
    console.log(endpoint);
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
      mutate(`http://127.0.0.1:8000/api/general/recettes/${recette_id}/`);
    } else {
      alert("Une erreur est survenue. Merci de réessayer plus tard.");
    }
  };
  return (
    <Button
      className="emoji_button"
      title="Supprimer"
      onClick={() => {
        if (window.confirm(delete_confirmation_text)) deleteItem();
      }}
    >
      🗑
    </Button>
  );
};

export default DeleteButton;
