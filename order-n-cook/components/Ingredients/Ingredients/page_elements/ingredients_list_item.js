import React, { useState } from "react";
import Link from "next/link";
import PurchaseIngredientHelper from "../modals/purchase_ingredient_modal";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";

/*
 Component to display details about a single ingredient as part of a list of ingredients. 
 This also includes the tools needed to open the PurchaseHelper, to access an ingredient's detail page, and
 to open information dialogues about the ingredient's allergenes and labels.
*/
const IngredientListItem = ({ ingredient }) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Create the string that will be displayed as the list of allergene for the ingredient
  var allergene_string = "";
  if (ingredient.allergenes.length > 0) {
    ingredient.allergenes.forEach(
      (allergene) => (allergene_string += allergene.name + "; ")
    );
    allergene_string = allergene_string.substring(
      0,
      allergene_string.length - 2
    );
  }

  return (
    <tr>
      <td className={"w-10"}>
        <PurchaseIngredientHelper
          onClose={() => setShowPurchaseModal(false)}
          show={showPurchaseModal}
        ></PurchaseIngredientHelper>
      </td>
      <td className={"w-25"} style={{ verticalAlign: "middle" }}>
        <Link href={"/ingredients/" + ingredient.id}>{ingredient.name}</Link>
      </td>
      <td className={"w-25"}>
        <div className={"d-flex flex-row"}>
          {ingredient.labels.map((label) => (
            <div>
              <Button
                color="white"
                id={"see-labels-" + ingredient.id + label.id}
                type="button"
              >
                {label.name}
              </Button>
              <UncontrolledPopover
                placement="bottom"
                target={"see-labels-" + ingredient.id + label.id}
                trigger="legacy"
              >
                <PopoverHeader>{label.name}</PopoverHeader>
                <PopoverBody>
                  Legacy is a reactstrap special trigger value (outside of
                  bootstrap‘s spec/standard). Before reactstrap correctly
                  supported click and focus, it had a hybrid which was very
                  useful and has been brought back as trigger=“legacy“. One
                  advantage of the legacy trigger is that it allows the popover
                  text to be selected while also closing when clicking outside
                  the triggering element and popover itself.
                </PopoverBody>
              </UncontrolledPopover>
            </div>
          ))}
        </div>
      </td>
      <td className={"w-25"}>
        <div>
          <div>
            {ingredient.allergenes.length > 0 ? (
              <div className="d-flex flex-row justify-content-end">
                <Button
                  color="white"
                  type="button"
                  id={"see-allergenes" + ingredient.id}
                >
                  ℹ️
                </Button>
                <UncontrolledPopover
                  placement="bottom"
                  target={"see-allergenes" + ingredient.id}
                  trigger="legacy"
                >
                  <PopoverHeader>Allergènes</PopoverHeader>
                  <PopoverBody>{allergene_string}</PopoverBody>
                </UncontrolledPopover>
              </div>
            ) : null}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default IngredientListItem;
