import React from "react";
import { useState, useReducer } from "react";
import Select from "react-select";
import { Button } from "reactstrap";

async function createAvoir(data, commande_id) {
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint =
    `http://127.0.0.1:8000/api/create_avoir/` + commande_id + "/";

  // Form the request for sending data to the server.
  const options = {
    // The method is POST because we are sending data.
    method: "PUT",
    // Tell the server we're sending JSON.
    headers: {
      "Content-Type": "application/json",
    },
    // Body of the request is the JSON data we created above.
    body: JSONdata,
  };

  // Send the form data to our forms API on Vercel and get a response.
  const response = await fetch(endpoint, options);
  return response;
}

function CreateAvoir({ commande, closeModal = () => {} }) {
  const [itemsOfAvoir, setItemsOfAvoir] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const options = commande.items.map((item) => {
    return { value: item, label: item.name };
  });

  async function recordAvoir() {
    const unvalid_items = itemsOfAvoir.filter(
      (item) => item.quantity == 0 || item.reason == ""
    );
    if (unvalid_items.length == 0) {
      let data = {};
      data["items"] = itemsOfAvoir.map((item) => {
        return {
          item: item.id,
          quantity_demanded: item.quantity,
          reason: item.reason,
        };
      });
      if (
        window.confirm(
          "Assurez-vous de ne pas devoir demander un avoir pour d'autres éléments de la commande, sera ne sera plus possible via Order n'Cook."
        )
      ) {
        const response = await createAvoir(data, commande.id);
        if (response.status == 201) {
          alert("L'avoir a bien été créé et envoyé à votre fournisseur.");
          closeModal();
        } else {
          alert(
            "Une erreur est survenue. Merci de réessayer utlérieurement ou de contacter le service technique."
          );
        }
      }
    } else {
      alert(
        "Merci de renseigner une quantité et une raison pour chaque élément de l'avoir."
      );
    }
  }

  function addSelectedItem() {
    if (selectedItem) {
      console.log("ON EST LA");
      console.log(itemsOfAvoir);
      if (itemsOfAvoir != null && itemsOfAvoir != []) {
        if (
          itemsOfAvoir.filter((item) => item.name == selectedItem.value.name)
            .length < 1
        ) {
          setItemsOfAvoir([
            ...itemsOfAvoir,
            { ...selectedItem.value, quantity: 0, reason: "" },
          ]);
        }
        console.log(itemsOfAvoir);
      } else {
        setItemsOfAvoir([
          ...itemsOfAvoir,
          { ...selectedItem.value, quantity: 0, reason: "" },
        ]);
        console.log(itemsOfAvoir);
      }
    }
  }
  return (
    <>
      <div className="col-12 d-flex flex-row justify-content-between">
        <Select
          className="flex-grow-1 col-9 me-2"
          options={options}
          placeholder="Ajouter des labels"
          isSearchable={true}
          value={selectedItem}
          onChange={(data) => {
            setSelectedItem(data);
          }}
        />
        <Button className="btn btn-primary col-lg-3" onClick={addSelectedItem}>
          Ajouter à l'avoir
        </Button>
      </div>
      {itemsOfAvoir != null ? (
        <div className="col-12 d-flex flex-column">
          {console.log("LA")}
          {console.log(itemsOfAvoir)}
          {itemsOfAvoir.map((item) => (
            <>
              <div
                className="col-12 d-flex flex-row justify-content-between align-items-center p-3 mt-2 mb-2"
                style={{ borderRadius: "15px", backgroundColor: "#f3f0f0" }}
              >
                <div className="col-3" style={{ fontWeight: 500 }}>
                  {item.name}
                </div>
                <div className="col-3" style={{ textAlign: "start" }}>
                  <p>
                    {item.real.quantity +
                      " " +
                      item.real.unit +
                      " (" +
                      item.conversion.quantity +
                      item.conversion.unit +
                      ")"}
                  </p>
                  <p>{item.unit_price + "€/" + item.real.unit + " HT"}</p>
                </div>
                <div className="col-6 d-flex flex-column">
                  <div className="d-flex col-12 justify-content-between">
                    <p className="col-9" style={{ fontWeight: 500 }}>
                      Quantité demandée:{" "}
                    </p>
                    <input
                      className="col-3"
                      type="number"
                      step="any"
                      value={item.quantity}
                      onChange={(event) => {
                        if (item.number_of_units >= event.target.value) {
                          console.log("HEREHERHE" + event.target.value);
                          const new_state = itemsOfAvoir;
                          new_state[new_state.indexOf(item)].quantity =
                            event.target.value;
                          console.log(new_state);
                          setItemsOfAvoir(new_state);
                          forceUpdate();
                          console.log(itemsOfAvoir);
                        } else {
                          alert(
                            "La quantité d'avoir demandée ne peut pas être supérieure à la quantité commandée."
                          );
                        }
                      }}
                    />
                    <p>{item.real.unit + item.quantity > 1 ? "s" : null}</p>
                  </div>
                  <div className="d-flex justify-content-between col-12 mt-2">
                    <p className="col-4" style={{ fontWeight: 500 }}>
                      Raison:{" "}
                    </p>
                    <input
                      className="col-8"
                      type="text"
                      value={item.reason}
                      onChange={(event) => {
                        console.log("HEREHERHE" + event.target.value);
                        const new_state = itemsOfAvoir;
                        new_state[new_state.indexOf(item)].reason =
                          event.target.value;
                        console.log(new_state);
                        setItemsOfAvoir(new_state);
                        forceUpdate();
                        console.log(itemsOfAvoir);
                      }}
                    />
                  </div>
                </div>
              </div>
              {item.quantity > 0 ? (
                <div
                  className="d-flex justify-content-center col-12 mt-2"
                  style={{ color: "#f85959" }}
                >
                  <p>
                    Montant demandé pour ce produit:{" "}
                    {(item.quantity * item.unit_price).toFixed(2)}€ HT
                  </p>
                </div>
              ) : null}
            </>
          ))}
        </div>
      ) : null}
      {itemsOfAvoir.length > 0 ? (
        <div className="col-12 d-flex flex-row justify-content-end">
          <Button className="btn btn-primary" onClick={recordAvoir}>
            Demander l'Avoir
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default CreateAvoir;

// {
//     id: 1,
//     name: "beurre",
//     conversion: {
//       unit: "g",
//       quantity: 250,
//     },
//     real: {
//       unit: "plaquette",
//       quantity: 1,
//     },
//     quantity: 3,
//     kilogramme_price: 8,
//     unit_price: 2,
//     total_price: 6,
//   },
