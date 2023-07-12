import { useContext, useState, useReducer } from "react";
import { useDispatch, ReactReduxContext, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, Table } from "reactstrap";
import RecordOrder from "../../components/Panier/record_order";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "../../redux/cart.slice";

function get_grouped_cart_elements(cart_items) {
  const grouped_default_data = cart_items.reduce((group, item) => {
    const { fournisseur_name } = item;
    group[fournisseur_name] = group[fournisseur_name] ?? [];
    group[fournisseur_name].push(item);
    return group;
  }, {});
  var default_data = [];

  for (var key in grouped_default_data) {
    if (grouped_default_data.hasOwnProperty(key)) {
      default_data.push({
        group_name: key,
        items: grouped_default_data[key],
      });
    }
  }
  return default_data;
}

export default function Cart() {
  const dispatch = useDispatch();
  const { store } = useContext(ReactReduxContext);

  const cartItems = useSelector((state) => state.cart);

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  if (cartItems && cartItems.length > 0) {
    return (
      <div className="col-12 d-flex flex-column justify-content-center align-items-center">
        {get_grouped_cart_elements(cartItems).map((group) => (
          <div className="col-10 d-flex justify-content-center align-items-center flex-column mb-3">
            <h5
              className="col-12 pt-1 pb-1"
              style={{
                background: "#CDCCCD",
                paddingLeft: "10px",
                textAlign: "center",
              }}
            >
              {group.group_name}
            </h5>
            <Table
              hover
              style={{ marginBottom: "5px", backgroundColor: "transparent" }}
            >
              <tbody>
                {group.items.map((item) => (
                  <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                    <div
                      className="col-2 d-flex flex-row justify-content-between align-items-center"
                      style={{ maxWidth: "150px" }}
                    >
                      <Button
                        className="btn-sm"
                        onClick={() => {
                          dispatch(decrementQuantity(item.id));
                          forceUpdate();
                        }}
                      >
                        -
                      </Button>
                      {item.quantity}
                      <Button
                        className="btn-sm"
                        onClick={() => {
                          dispatch(incrementQuantity(item.id));
                          forceUpdate();
                        }}
                      >
                        +
                      </Button>
                    </div>
                    <div className="col-3" style={{ fontWeight: 500 }}>
                      {item.ingredient.name}
                    </div>
                    <div className="col-3">
                      Quantité unitaire:{" "}
                      {item.real_unit.quantity +
                        " " +
                        item.real_unit.unit +
                        " (" +
                        item.conversion_unit.quantity +
                        item.conversion_unit.unit +
                        ")"}
                    </div>
                    <div className="col-1" style={{ textAlign: "end" }}>
                      {item.kilogramme_price}€/kg
                    </div>
                    <div className="col-2" style={{ textAlign: "end" }}>
                      Coût estimé: {(item.quantity * item.price).toFixed(2)}€
                    </div>
                    <div className="col-1" style={{ textAlign: "end" }}>
                      <Button
                        className="emoji_button"
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        🗑
                      </Button>
                    </div>
                  </div>
                ))}
              </tbody>
            </Table>
            <div className="col-12 d-flex flex-row justify-content-end align-items-center mt-1 p-1">
              <p
                className="pe-2 ps-5"
                style={{ fontWeight: 500, backgroundColor: "#f3f0f0" }}
              >
                Total HT estimé:{" "}
                {group.items
                  .reduce(
                    (total, item) => (total += item.quantity * item.price),
                    0
                  )
                  .toFixed(2)}
                €
              </p>
            </div>
            <div className="col-12 d-flex flex-row justify-content-end align-items-center mt-1 p-1">
              <RecordOrder items={group.items}></RecordOrder>
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return <p>Il n'y actuellement aucun produit dans votre panier.</p>;
  }
}
