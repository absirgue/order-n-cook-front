import PurchaseIngredientHelper from "./purchase_ingredient_modal";
import PlaceOrder from "@/components/general/place_order";
import { useState } from "react";
import { Button } from "reactstrap";

export default function OrderModalsHandler({ ingredient }) {
  const [firstModalOpen, setFirstModalOpen] = useState(false);
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [secondModalProduit, setSecondModalProduit] = useState({});
  return (
    <>
      <Button
        className="emoji_button"
        onClick={() => setFirstModalOpen(!firstModalOpen)}
      >
        🛒
      </Button>
      <PurchaseIngredientHelper
        ingredient={ingredient}
        modalOpen={firstModalOpen}
        setModalOpen={setFirstModalOpen}
        setOtherModalProduit={setSecondModalProduit}
        openOtherModal={setSecondModalOpen}
      ></PurchaseIngredientHelper>
      <PlaceOrder
        produit={secondModalProduit}
        toggleOpen={setSecondModalOpen}
      ></PlaceOrder>
    </>
  );
}
