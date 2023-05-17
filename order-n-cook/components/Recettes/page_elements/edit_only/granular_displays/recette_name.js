import { useState } from "react";
import { useSWRConfig } from "swr";

/**
 * A small element that enables changing the name of a Recette.
 */

const perform_update_request = async (field_to_change, value, recette) => {
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

  // Return response data
  return resData;
};

const RecetteName = ({ recette }) => {
  const [new_data_inputted, set_new_data_inputted] = useState(false);
  const { mutate } = useSWRConfig();

  const update_recette_data_handler = async (
    field_to_change,
    value,
    recette
  ) => {
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
      perform_update_request(field_to_change, value, recette),
      options
    );
  };

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    if (event.target.recette_name.value) {
      update_recette_data_handler(
        "name",
        event.target.recette_name.value,
        recette
      );
    }
    set_new_data_inputted(false);
  };

  return (
    <div className="col-12">
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
          placeholder={recette.name}
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
    </div>
  );
};
export default RecetteName;
