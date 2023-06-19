import React from "react";
import { useState, useReducer } from "react";
import Select from "react-select";
import { Button } from "reactstrap";
function CreateAvoir({ commande }) {
  const [itemsOfAvoir, setItemsOfAvoir] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const options = commande.items.map((item) => {
    return { value: item, label: item.name };
  });

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
                      Montant de l'avoir demandé:{" "}
                    </p>
                    <input
                      className="col-3"
                      type="number"
                      step="any"
                      value={item.quantity}
                      onChange={(event) => {
                        console.log("HEREHERHE" + event.target.value);
                        const new_state = itemsOfAvoir;
                        new_state[new_state.indexOf(item)].quantity =
                          event.target.value;
                        console.log(new_state);
                        setItemsOfAvoir(new_state);
                        forceUpdate();
                        console.log(itemsOfAvoir);
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
                      onChange={(event) =>
                        (item["reason"] = event.target.value)
                      }
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
                    {item.quantity * item.unit_price}€
                  </p>
                </div>
              ) : null}
            </>
          ))}
        </div>
      ) : null}
      {itemsOfAvoir.length > 0 ? (
        <div className="col-12 d-flex flex-row justify-content-end">
          <Button
            className="btn btn-primary"
            onClick={() => {
              if (
                window.confirm(
                  "Assurez-vous de ne pas devoir demander un avoir pour d'autres éléments de la commande, sera ne sera plus possible via Order n'Cook."
                )
              )
                console.log("OK");
              // ENREGISTRER L"AVOIR
            }}
          >
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
