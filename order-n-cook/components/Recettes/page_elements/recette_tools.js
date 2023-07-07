import { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
} from "reactstrap";
import { useSWRConfig } from "swr";

/**
 * Drawer with all tools related to a Recette but not to edit. To calrify, these tools are:
 *         - Duplicate
 *         - Delete
 *         - Change is_to_modify
 *         - Change selected_for_menu
 *         - Change is_selected_for_next_menu
 *         - Imprimer
 *         - Commander
 * @param recette The Recette object tools are relative too.
 */
const RecetteTools = ({ recette }) => {
  const [showTools, setShowTools] = useState(false);
  const [autresOutilsOpen, setAutresOutilsDropdownOpen] = useState(false);
  const [cartesOutilsOpen, setCartesOutilsOpen] = useState(false);
  const toggleAutresOutils = () =>
    setAutresOutilsDropdownOpen((prevState) => !prevState);
  const toggleCarteOutils = () =>
    setCartesOutilsOpen((prevState) => !prevState);
  const { mutate } = useSWRConfig();
  const duplicate_recette = async () => {
    let endpoint =
      "http://127.0.0.1:8000/api/duplicate_recette/" + recette.id + "/";
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
  };

  const delete_recette = async () => {
    let endpoint = "http://127.0.0.1:8000/api/recettes/" + recette.id + "/";
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
      window.location.href = "/recettes/toutes";
    } else {
      alert("Une erreur est survenue. Merci de réessayer plus tard.");
    }
  };

  const perform_update_request = async (field_to_change, value) => {
    let body_data = {};
    body_data[field_to_change] = value;
    const response = await fetch(
      `http://127.0.0.1:8000/api/recettes/${recette.id}/`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body_data),
      }
    );

    // Awaiting response.json()
    const resData = await response.json();

    // Return response recette
    return resData;
  };
  const update_recette_data_handler = async (field_to_change, value) => {
    let new_data = { ...recette };
    new_data[field_to_change] = value;
    const options = {
      optimisticData: new_data,
      rollbackOnError(error) {
        // If it's timeout abort error, don't rollback
        return error.name !== "AbortError";
      },
    };

    mutate(
      `http://127.0.0.1:8000/api/recettes/${recette.id}/`,
      perform_update_request(field_to_change, value),
      options
    );
  };

  return (
    <div className="col-12 d-flex flex-row justify-content-end">
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
                  alert("Cette fonctionnalité n'est pas encore implémentée.");
                }}
              >
                Télécharger
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  duplicate_recette();
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
                    !recette.selected_for_menu
                  );
                }}
              >
                {recette.selected_for_menu
                  ? "Retirer de la carte"
                  : "Marquer à la carte"}
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  update_recette_data_handler(
                    "selected_for_next_menu",
                    !recette.selected_for_next_menu
                  );
                }}
              >
                {recette.selected_for_next_menu
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
                !recette.is_to_modify
              );
            }}
          >
            {recette.is_to_modify
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
  );
};
export default RecetteTools;
