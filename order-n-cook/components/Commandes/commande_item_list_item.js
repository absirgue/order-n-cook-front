import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";

export default function CommandeItemListItem({ commandeItem }) {
  return (
    <div
      className="col-12 d-flex flex-row justify-content-between mt-2 align-items-center"
      style={{
        color: commandeItem.pending_avoir
          ? "#f85959"
          : commandeItem.received_avoir
          ? "#fa8144"
          : null,
      }}
    >
      <div className="col-3" style={{ textAlign: "start" }}>
        <p>{commandeItem.name}</p>
      </div>
      <div className="col-3" style={{ textAlign: "start" }}>
        <p>
          {commandeItem.real.quantity +
            " " +
            commandeItem.real.unit +
            " (" +
            commandeItem.conversion.quantity +
            commandeItem.conversion.unit +
            ")"}
        </p>
      </div>
      <div className="col-2" style={{ textAlign: "end" }}>
        <p>{commandeItem.kilogramme_price}€/kg</p>
      </div>
      <div className="col-2" style={{ textAlign: "end" }}>
        {commandeItem.total_price}€
      </div>
      <div className="col-2" style={{ textAlign: "end" }}>
        {commandeItem.pending_avoir || commandeItem.received_avoir ? (
          <>
            <Button color="white" type="button" id={"avoir-" + commandeItem.id}>
              {commandeItem.pending_avoir ? "❗️" : "ℹ️"}
            </Button>
            <UncontrolledPopover
              placement="bottom"
              target={"avoir-" + commandeItem.id}
              trigger="legacy"
            >
              <PopoverBody>
                {commandeItem.pending_avoir
                  ? " Concerné par la demande d'avoir en attente"
                  : "Concerné par l'avoir reçu"}
              </PopoverBody>
            </UncontrolledPopover>
          </>
        ) : null}
      </div>
    </div>
  );
}
