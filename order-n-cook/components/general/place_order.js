import { useDispatch, ReactReduxContext } from "react-redux";
import { addToCart } from "../../redux/cart.slice";
// reactstrap components
import { Button } from "reactstrap";
import React from "react";
import { useContext } from "react";
//

export default function PlaceOrder({ produit, closeModal = null }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = React.useState(null);
  const { store } = useContext(ReactReduxContext);

  console.log("PRODUIT IN MODAL");
  console.log(produit);

  return (
    <>
      <div className="d-flex flex-column">
        <div className="d-flex flex-column justify-content-start col-12 align-items-start">
          <i style={{ color: "grey" }}>
            Ce produit est vendu en unité de{" "}
            {produit.real_unit.quantity + " " + produit.real_unit.unit} au prix
            unitaire estimé de {produit.price}€.
          </i>
          <div className="d-flex flex-row justify-content-between col-12">
            <div className="col-12 d-flex flex-row justify-content-center align-items-baseline mt-3 mb-3 ">
              <label htmlFor="quantity">Quantité désirée:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                step="any"
                style={{
                  backgroundColor: "transparent",
                  border: 0,
                  borderBottom: "5px",
                  textAlign: "end",
                  width: "100px",
                }}
                placeholder={"3"}
                required
                onChange={(event) => setQuantity(parseInt(event.target.value))}
              ></input>
            </div>
          </div>
          {quantity ? (
            <>
              <i>Soit</i>
              <ul>
                <li>
                  {produit.real_unit.quantity * quantity}{" "}
                  {produit.real_unit.quantity * quantity > 1
                    ? produit.real_unit.unit + "s"
                    : produit.real_unit.unit}
                </li>
                {produit.real_unit.unit != "kilogramme" ? (
                  <li>
                    {produit.conversion_unit.quantity * quantity}{" "}
                    {produit.conversion_unit.quantity * quantity > 1
                      ? produit.conversion_unit.unit + "s"
                      : produit.conversion_unit.unit}
                  </li>
                ) : null}

                <li>
                  Un coût total estimé de{" "}
                  <span style={{ fontWeight: 600 }}>
                    {produit.price * quantity}€
                  </span>
                </li>
              </ul>
            </>
          ) : null}
          {quantity ? (
            <div className="col-12 d-flex flex-row justify-content-end">
              <Button
                className="btn btn-primary"
                onClick={() => {
                  dispatch(addToCart({ ...produit, quantity: quantity }));
                  if (closeModal) {
                    closeModal(false);
                  }
                  console.log(store.getState());
                }}
              >
                Ajouter au panier
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
